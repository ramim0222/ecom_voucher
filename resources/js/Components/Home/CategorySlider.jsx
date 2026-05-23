import { router } from "@inertiajs/react";
import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";

const FALLBACK_CATEGORIES = [
    { id: "steam", name: "Steam" },
    { id: "playstation", name: "PlayStation" },
    { id: "xbox", name: "Xbox" },
    { id: "nintendo", name: "Nintendo" },
];

function CategoryCard({ category, isFallback }) {
    return (
        <div
            className="category-slide glass-card rounded-xl p-3 sm:p-4 md:p-5 shrink-0 w-[130px] sm:w-[155px] md:w-[170px] lg:w-[185px] xl:w-[200px] text-center hover-lift cursor-pointer group select-none"
            data-category-id={category.id}
            data-is-fallback={isFallback ? "true" : "false"}
            role="button"
            tabIndex={0}
        >
            <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mx-auto mb-2 sm:mb-3 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-accent">
                {category.logo ? (
                    <img
                        src={`/storage/${category.logo}`}
                        alt={category.name}
                        className="w-full h-full object-cover"
                        draggable={false}
                    />
                ) : (
                    <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white">
                        {category.name[0]}
                    </span>
                )}
            </div>
            <h3 className="font-heading font-semibold text-xs sm:text-sm md:text-base lg:text-lg group-hover:text-accent transition-colors line-clamp-2">
                {category.name}
            </h3>
        </div>
    );
}

export function CategorySlider({ categories = [] }) {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const tweenRef = useRef(null);

    const items = useMemo(() => {
        const active = categories.filter(
            (c) => String(c.status ?? "active").toLowerCase() === "active"
        );
        return active.length > 0 ? active : FALLBACK_CATEGORIES;
    }, [categories]);

    const isFallback =
        categories.filter(
            (c) => String(c.status ?? "active").toLowerCase() === "active"
        ).length === 0;

    useEffect(() => {
        const container = containerRef.current;
        const track = trackRef.current;
        if (!container || !track || items.length === 0) return;

        const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const removeClones = () => {
            track.querySelectorAll('[data-clone="true"]').forEach((el) => {
                el.remove();
            });
        };

        const getGap = () => {
            const gap = parseFloat(getComputedStyle(track).gap);
            return Number.isFinite(gap) ? gap : 12;
        };

        const measureSetWidth = (slides, gap) => {
            let width = 0;
            slides.forEach((slide, index) => {
                width += slide.offsetWidth;
                if (index < slides.length - 1) width += gap;
            });
            return width;
        };

        const buildLoop = () => {
            gsap.killTweensOf(track);
            tweenRef.current = null;
            removeClones();
            gsap.set(track, { x: 0 });

            const originals = Array.from(
                track.querySelectorAll(".category-slide:not([data-clone])")
            );
            if (originals.length === 0) return;

            const gap = getGap();
            const containerWidth = container.offsetWidth;
            let setWidth = measureSetWidth(originals, gap);

            const appendCloneSet = () => {
                originals.forEach((slide) => {
                    const clone = slide.cloneNode(true);
                    clone.setAttribute("data-clone", "true");
                    clone.setAttribute("aria-hidden", "true");
                    track.appendChild(clone);
                });
            };

            appendCloneSet();
            while (track.scrollWidth < containerWidth * 2) {
                appendCloneSet();
            }

            setWidth = measureSetWidth(originals, gap);

            if (prefersReduced || setWidth <= 0) return;

            const speed = window.innerWidth < 640 ? 35 : 50;

            tweenRef.current = gsap.fromTo(
                track,
                { x: 0 },
                {
                    x: -setWidth,
                    duration: setWidth / speed,
                    ease: "none",
                    repeat: -1,
                }
            );
        };

        buildLoop();

        const pause = () => tweenRef.current?.pause();
        const resume = () => tweenRef.current?.play();

        container.addEventListener("mouseenter", pause);
        container.addEventListener("mouseleave", resume);
        container.addEventListener("pointerdown", pause);
        container.addEventListener("pointerup", resume);
        container.addEventListener("pointercancel", resume);
        container.addEventListener("touchstart", pause, { passive: true });
        container.addEventListener("touchend", resume);

        const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const onReducedChange = () => {
            if (reducedMq.matches) {
                gsap.killTweensOf(track);
                gsap.set(track, { x: 0 });
                removeClones();
            } else {
                buildLoop();
            }
        };
        reducedMq.addEventListener("change", onReducedChange);

        const resizeObserver = new ResizeObserver(() => {
            buildLoop();
        });
        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
            reducedMq.removeEventListener("change", onReducedChange);
            container.removeEventListener("mouseenter", pause);
            container.removeEventListener("mouseleave", resume);
            container.removeEventListener("pointerdown", pause);
            container.removeEventListener("pointerup", resume);
            container.removeEventListener("pointercancel", resume);
            container.removeEventListener("touchstart", pause);
            container.removeEventListener("touchend", resume);
            gsap.killTweensOf(track);
            removeClones();
            gsap.set(track, { x: 0 });
        };
    }, [items]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleNavigate = (e) => {
            const slide = e.target.closest(".category-slide");
            if (!slide) return;

            const isFallback = slide.dataset.isFallback === "true";
            if (isFallback) {
                router.visit(route("products"));
                return;
            }

            router.visit(
                route("products", { category: slide.dataset.categoryId })
            );
        };

        const handleKeyDown = (e) => {
            if (e.key !== "Enter" && e.key !== " ") return;
            const slide = e.target.closest(".category-slide");
            if (!slide) return;
            e.preventDefault();
            slide.click();
        };

        container.addEventListener("click", handleNavigate);
        container.addEventListener("keydown", handleKeyDown);

        return () => {
            container.removeEventListener("click", handleNavigate);
            container.removeEventListener("keydown", handleKeyDown);
        };
    }, [items]);

    return (
        <div
            ref={containerRef}
            className="relative overflow-hidden touch-pan-y -mx-2 sm:mx-0 py-1"
            aria-label="Browse by platform"
        >
            <div
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 sm:w-12 md:w-16 bg-gradient-to-r from-card/80 to-transparent"
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 sm:w-12 md:w-16 bg-gradient-to-l from-card/80 to-transparent"
                aria-hidden="true"
            />

            <div
                ref={trackRef}
                className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 w-max will-change-transform"
            >
                {items.map((category) => (
                    <CategoryCard
                        key={category.id}
                        category={category}
                        isFallback={
                            isFallback &&
                            typeof category.id === "string" &&
                            !Number.isFinite(Number(category.id))
                        }
                    />
                ))}
            </div>
        </div>
    );
}
