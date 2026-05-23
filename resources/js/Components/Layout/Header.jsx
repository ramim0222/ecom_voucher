import { GamingButton } from "@/Components/ui/GamingButton";
import { usePage, Link, router } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function Header() {
    const {
        auth,
        branding = {},
        categories = [],
        cartCount = 0,
        wishlistCount = 0,
        url,
    } = usePage().props;
    const isAuthenticated = !!auth.user;
    const isAdmin = auth.user?.role === "admin";
    const dashboardRoute = isAdmin ? route("admin") : route("dashboard");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const brandName = branding?.brand_name || "GameVault";
    const brandDescription =
        branding?.brand_description || "Premium Gaming Vouchers";
    const logoPath = branding?.logo_path || "";
    const brandInitial = brandName.charAt(0).toUpperCase() || "G";
    const mobileNavRef = useRef(null);

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setIsCategoriesOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((open) => !open);
    };

    useEffect(() => {
        closeMobileMenu();
    }, [url]);

    useEffect(() => {
        if (!isMobileMenuOpen) {
            return undefined;
        }

        const { overflow } = document.body.style;
        document.body.style.overflow = "hidden";

        const onKeyDown = (event) => {
            if (event.key === "Escape") {
                closeMobileMenu();
            }
        };

        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = overflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth >= 1024) {
                closeMobileMenu();
            }
        };

        window.addEventListener("resize", onResize);

        return () => window.removeEventListener("resize", onResize);
    }, []);

    useEffect(() => {
        const nav = mobileNavRef.current;

        if (!nav) {
            return undefined;
        }

        if (isMobileMenuOpen) {
            gsap.fromTo(
                nav,
                { y: -20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
            );
        } else {
            gsap.set(nav, { clearProps: "all" });
        }
    }, [isMobileMenuOpen]);

    return (
        <header className="sticky top-0 z-50 glass-card border-b border-border/50 shrink-0">
            <div className="relative z-50 container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 py-2.5 sm:py-3 md:py-4">
                <div className="flex items-center justify-between gap-2 sm:gap-3 min-w-0">
                    {/* Logo + desktop nav */}
                    <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 lg:flex-none">
                        <Link
                            href={route("welcome")}
                            className="flex min-w-0 items-center gap-1.5 sm:gap-2 shrink-0"
                        >
                            {logoPath ? (
                                <img
                                    src={`/storage/${logoPath}`}
                                    alt={brandName}
                                    className="h-7 w-auto max-w-[2.75rem] sm:max-w-[3.25rem] md:max-w-[4rem] object-contain sm:h-8 md:h-9 shrink-0"
                                />
                            ) : (
                                <div className="flex h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                                    <span className="text-sm font-bold text-white sm:text-base md:text-lg">
                                        {brandInitial}
                                    </span>
                                </div>
                            )}
                            <div className="min-w-0 flex flex-col">
                                <span className="truncate font-heading text-sm font-bold leading-tight sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                                    {brandName}
                                </span>
                                <span className="hidden md:block truncate text-xs leading-tight text-muted-foreground">
                                    {brandDescription}
                                </span>
                            </div>
                        </Link>

                        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-8">
                            <Link
                                href={route("welcome")}
                                className="text-sm text-foreground transition-colors hover:text-accent xl:text-base"
                            >
                                Home
                            </Link>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="flex items-center gap-1 text-sm text-foreground transition-colors hover:text-accent xl:text-base"
                                    >
                                        Categories
                                        <span aria-hidden="true">▾</span>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content
                                    align="left"
                                    width="48"
                                    contentClasses="py-0 bg-white dark:bg-slate-800 overflow-hidden"
                                >
                                    <div className="dropdown-scroll max-h-64 overflow-y-auto overflow-x-hidden py-1">
                                        {(categories || []).map((cat) => (
                                            <Dropdown.Link
                                                key={cat.id}
                                                href={route("products", {
                                                    category: cat.id,
                                                })}
                                                className="dark:text-slate-200 dark:hover:bg-slate-700"
                                            >
                                                {cat.name}
                                            </Dropdown.Link>
                                        ))}
                                        {(!categories ||
                                            categories.length === 0) && (
                                            <div className="px-4 py-2 text-sm text-muted-foreground">
                                                No categories
                                            </div>
                                        )}
                                    </div>
                                </Dropdown.Content>
                            </Dropdown>
                            <Link
                                href={route("contact")}
                                className="text-sm text-foreground transition-colors hover:text-accent xl:text-base"
                            >
                                Support
                            </Link>
                        </nav>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-0.5 sm:gap-1 md:gap-2 lg:gap-3 xl:gap-4">
                        <div className="relative hidden md:flex">
                            <input
                                type="search"
                                placeholder="Search vouchers..."
                                aria-label="Search vouchers"
                                className="w-40 rounded-lg border border-border bg-input py-2 pl-3 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary lg:w-48 xl:w-56 2xl:w-64"
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent"
                                aria-label="Search"
                            >
                                🔍
                            </button>
                        </div>

                        <Link
                            href={route("cart")}
                            className="relative rounded-lg p-1.5 transition-colors hover:bg-muted sm:p-2"
                            aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
                        >
                            <span className="text-lg sm:text-xl" aria-hidden="true">
                                🛒
                            </span>
                            {cartCount > 0 && (
                                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground sm:-right-1 sm:-top-1 sm:h-5 sm:w-5">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <Link
                            href={route("wishlist")}
                            className="relative rounded-lg p-1.5 transition-colors hover:bg-muted sm:p-2"
                            aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ""}`}
                        >
                            <span className="text-lg sm:text-xl" aria-hidden="true">
                                💖
                            </span>
                            {wishlistCount > 0 && (
                                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground sm:-right-1 sm:-top-1 sm:h-5 sm:w-5">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <GamingButton
                                variant="primary"
                                size="sm"
                                onClick={() => router.visit(dashboardRoute)}
                                className="hidden px-3 py-2 text-sm lg:inline-flex"
                            >
                                Dashboard
                            </GamingButton>
                        ) : (
                            <div className="hidden items-center gap-2 lg:flex">
                                <GamingButton
                                    onClick={() => router.visit(route("login"))}
                                    variant="ghost"
                                    size="sm"
                                    className="px-3 py-2 text-sm"
                                >
                                    Sign In
                                </GamingButton>
                                <GamingButton
                                    variant="primary"
                                    size="sm"
                                    onClick={() =>
                                        router.visit(route("register"))
                                    }
                                    className="px-3 py-2 text-sm"
                                >
                                    Sign Up
                                </GamingButton>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={toggleMobileMenu}
                            className="rounded-lg p-2 transition-colors hover:bg-muted lg:hidden"
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-nav"
                            aria-label={
                                isMobileMenuOpen ? "Close menu" : "Open menu"
                            }
                        >
                            <span className="inline-flex h-5 w-5 items-center justify-center text-lg leading-none">
                                {isMobileMenuOpen ? "✕" : "☰"}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
                    aria-label="Close menu"
                    onClick={closeMobileMenu}
                />
            )}

            {isMobileMenuOpen && (
                <div
                    id="mobile-nav"
                    ref={mobileNavRef}
                    className="relative z-50 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-border/50 bg-background/95 backdrop-blur-xl lg:hidden"
                >
                    <nav className="container mx-auto flex flex-col gap-1 px-3 py-4 sm:px-4 md:px-6">
                            <div className="mb-3 md:hidden">
                                <input
                                    type="search"
                                    placeholder="Search vouchers..."
                                    aria-label="Search vouchers"
                                    className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <Link
                                href={route("welcome")}
                                className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted hover:text-accent"
                                onClick={closeMobileMenu}
                            >
                                Home
                            </Link>

                            <div className="rounded-lg">
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-between px-3 py-3 text-left text-base font-medium text-foreground transition-colors hover:bg-muted hover:text-accent"
                                    onClick={() =>
                                        setIsCategoriesOpen((open) => !open)
                                    }
                                    aria-expanded={isCategoriesOpen}
                                >
                                    Categories
                                    <span
                                        className={`text-sm transition-transform ${isCategoriesOpen ? "rotate-180" : ""}`}
                                        aria-hidden="true"
                                    >
                                        ▾
                                    </span>
                                </button>
                                <div
                                    className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                                        isCategoriesOpen
                                            ? "grid-rows-[1fr]"
                                            : "grid-rows-[0fr]"
                                    }`}
                                >
                                    <div className="min-h-0 overflow-hidden">
                                        <div className="dropdown-scroll max-h-48 space-y-1 overflow-y-auto overflow-x-hidden pb-2 pl-3">
                                            {(categories || []).map((cat) => (
                                                <Link
                                                    key={cat.id}
                                                    href={route("products", {
                                                        category: cat.id,
                                                    })}
                                                    className="block rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted hover:text-accent"
                                                    onClick={closeMobileMenu}
                                                >
                                                    {cat.name}
                                                </Link>
                                            ))}
                                            {(!categories ||
                                                categories.length === 0) && (
                                                <div className="px-3 py-2 text-sm text-muted-foreground">
                                                    No categories
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href={route("contact")}
                                className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted hover:text-accent"
                                onClick={closeMobileMenu}
                            >
                                Support
                            </Link>

                            <div className="mt-4 space-y-2 border-t border-border/50 pt-4">
                                {isAuthenticated ? (
                                    <>
                                        <GamingButton
                                            variant="primary"
                                            size="sm"
                                            onClick={() => {
                                                closeMobileMenu();
                                                router.visit(dashboardRoute);
                                            }}
                                            className="w-full py-2.5 text-sm"
                                        >
                                            Dashboard
                                        </GamingButton>
                                        <GamingButton
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                closeMobileMenu();
                                                router.post(route("logout"));
                                            }}
                                            className="w-full py-2.5 text-sm"
                                        >
                                            Sign Out
                                        </GamingButton>
                                    </>
                                ) : (
                                    <>
                                        <GamingButton
                                            variant="primary"
                                            size="sm"
                                            onClick={() => {
                                                closeMobileMenu();
                                                router.visit(route("register"));
                                            }}
                                            className="w-full py-2.5 text-sm"
                                        >
                                            Sign Up
                                        </GamingButton>
                                        <GamingButton
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                closeMobileMenu();
                                                router.visit(route("login"));
                                            }}
                                            className="w-full py-2.5 text-sm"
                                        >
                                            Sign In
                                        </GamingButton>
                                    </>
                                )}
                            </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
