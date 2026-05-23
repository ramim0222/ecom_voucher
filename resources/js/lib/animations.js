import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let scrollTriggerRegistered = false;

export const mm = gsap.matchMedia();

export function prefersReducedMotion() {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isMobileViewport() {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.innerWidth < 768;
}

export function registerScrollTrigger() {
    if (scrollTriggerRegistered || typeof window === 'undefined') {
        return;
    }

    gsap.registerPlugin(ScrollTrigger);
    scrollTriggerRegistered = true;
}

function getDuration(defaultDuration, options = {}) {
    if (prefersReducedMotion()) {
        return 0;
    }

    if (options.duration !== undefined) {
        return options.duration;
    }

    return isMobileViewport() ? Math.min(defaultDuration, 0.2) : defaultDuration;
}

function applyWillChange(targets) {
    const elements = gsap.utils.toArray(targets);

    elements.forEach((el) => {
        if (el && el.style) {
            el.style.willChange = 'transform, opacity';
        }
    });
}

function clearWillChange(targets) {
    const elements = gsap.utils.toArray(targets);

    elements.forEach((el) => {
        if (el && el.style) {
            el.style.willChange = '';
        }
    });
}

export function fadeIn(targets, options = {}) {
    if (!targets) {
        return null;
    }

    if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, clearProps: 'transform' });
        return null;
    }

    const duration = getDuration(0.35, options);

    return gsap.fromTo(
        targets,
        { opacity: 0 },
        {
            opacity: 1,
            duration,
            ease: options.ease || 'power2.out',
            delay: options.delay || 0,
            onStart: () => applyWillChange(targets),
            onComplete: () => clearWillChange(targets),
            ...options,
        },
    );
}

export function fadeInUp(targets, options = {}) {
    if (!targets) {
        return null;
    }

    if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0, clearProps: 'transform' });
        return null;
    }

    const duration = getDuration(0.5, options);
    const useTransform = !isMobileViewport() && options.y !== false;

    return gsap.fromTo(
        targets,
        {
            opacity: 0,
            ...(useTransform ? { y: options.fromY ?? 40 } : {}),
        },
        {
            opacity: 1,
            ...(useTransform ? { y: 0 } : {}),
            duration,
            ease: options.ease || 'power2.out',
            delay: options.delay || 0,
            onStart: () => applyWillChange(targets),
            onComplete: () => clearWillChange(targets),
            ...options,
        },
    );
}

export function fadeInLeft(targets, options = {}) {
    if (!targets) {
        return null;
    }

    if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, x: 0, clearProps: 'transform' });
        return null;
    }

    const duration = getDuration(0.5, options);
    const useTransform = !isMobileViewport();

    return gsap.fromTo(
        targets,
        {
            opacity: 0,
            ...(useTransform ? { x: options.fromX ?? -30 } : {}),
        },
        {
            opacity: 1,
            ...(useTransform ? { x: 0 } : {}),
            duration,
            ease: options.ease || 'power2.out',
            delay: options.delay || 0,
            onStart: () => applyWillChange(targets),
            onComplete: () => clearWillChange(targets),
            ...options,
        },
    );
}

export function fadeInRight(targets, options = {}) {
    if (!targets) {
        return null;
    }

    if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, x: 0, clearProps: 'transform' });
        return null;
    }

    const duration = getDuration(0.5, options);
    const useTransform = !isMobileViewport();

    return gsap.fromTo(
        targets,
        {
            opacity: 0,
            ...(useTransform ? { x: options.fromX ?? 30 } : {}),
        },
        {
            opacity: 1,
            ...(useTransform ? { x: 0 } : {}),
            duration,
            ease: options.ease || 'power2.out',
            delay: options.delay || 0,
            onStart: () => applyWillChange(targets),
            onComplete: () => clearWillChange(targets),
            ...options,
        },
    );
}

export function scaleIn(targets, options = {}) {
    if (!targets) {
        return null;
    }

    if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, scale: 1, clearProps: 'transform' });
        return null;
    }

    const duration = getDuration(0.45, options);
    const useTransform = !isMobileViewport();

    return gsap.fromTo(
        targets,
        {
            opacity: 0,
            ...(useTransform ? { scale: options.fromScale ?? 0.96 } : {}),
        },
        {
            opacity: 1,
            ...(useTransform ? { scale: 1 } : {}),
            duration,
            ease: options.ease || 'power2.out',
            delay: options.delay || 0,
            onStart: () => applyWillChange(targets),
            onComplete: () => clearWillChange(targets),
            ...options,
        },
    );
}

export function staggerIn(targets, stagger = 0.08, options = {}) {
    if (!targets) {
        return null;
    }

    const elements = gsap.utils.toArray(targets);

    if (elements.length === 0) {
        return null;
    }

    if (prefersReducedMotion()) {
        gsap.set(elements, { opacity: 1, y: 0, x: 0, scale: 1, clearProps: 'transform' });
        return null;
    }

    const duration = getDuration(0.45, options);
    const useTransform = !isMobileViewport() && options.y !== false;
    const mobileStagger = Math.min(stagger, 0.05);

    return gsap.fromTo(
        elements,
        {
            opacity: 0,
            ...(useTransform ? { y: options.fromY ?? 30 } : {}),
        },
        {
            opacity: 1,
            ...(useTransform ? { y: 0 } : {}),
            duration,
            stagger: isMobileViewport() ? mobileStagger : stagger,
            ease: options.ease || 'power2.out',
            delay: options.delay || 0,
            onStart: () => applyWillChange(elements),
            onComplete: () => clearWillChange(elements),
            ...options,
        },
    );
}

export function staggerInOnScroll(targets, stagger = 0.08, options = {}) {
    if (!targets) {
        return null;
    }

    const elements = gsap.utils.toArray(targets);

    if (elements.length === 0) {
        return null;
    }

    if (prefersReducedMotion()) {
        gsap.set(elements, { opacity: 1, y: 0, clearProps: 'transform' });
        return null;
    }

    if (isMobileViewport()) {
        return staggerIn(elements, stagger, options);
    }

    registerScrollTrigger();

    const duration = getDuration(0.5, options);

    return gsap.fromTo(
        elements,
        {
            opacity: 0,
            y: options.fromY ?? 40,
        },
        {
            opacity: 1,
            y: 0,
            duration,
            stagger,
            ease: options.ease || 'power2.out',
            delay: options.delay || 0,
            scrollTrigger: {
                trigger: options.trigger || elements[0],
                start: options.start || 'top 85%',
                once: true,
                ...options.scrollTrigger,
            },
            onStart: () => applyWillChange(elements),
            onComplete: () => clearWillChange(elements),
            ...options,
        },
    );
}

export function revealOnScroll(targets, options = {}) {
    if (!targets) {
        return null;
    }

    if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0, clearProps: 'transform' });
        return null;
    }

    if (isMobileViewport()) {
        return fadeInUp(targets, options);
    }

    registerScrollTrigger();

    const duration = getDuration(0.5, options);

    return gsap.fromTo(
        targets,
        {
            opacity: 0,
            y: options.fromY ?? 40,
        },
        {
            opacity: 1,
            y: 0,
            duration,
            ease: options.ease || 'power2.out',
            delay: options.delay || 0,
            scrollTrigger: {
                trigger: options.trigger || targets,
                start: options.start || 'top 85%',
                once: true,
                ...options.scrollTrigger,
            },
            onStart: () => applyWillChange(targets),
            onComplete: () => clearWillChange(targets),
            ...options,
        },
    );
}

export function pageEnter(container, options = {}) {
    if (!container) {
        return null;
    }

    if (prefersReducedMotion()) {
        gsap.set(container, { opacity: 1, y: 0, clearProps: 'transform' });
        return null;
    }

    const duration = isMobileViewport() ? 0.15 : 0.3;
    const useTransform = !isMobileViewport();

    return gsap.fromTo(
        container,
        {
            opacity: 0,
            ...(useTransform ? { y: 20 } : {}),
        },
        {
            opacity: 1,
            ...(useTransform ? { y: 0 } : {}),
            duration: options.duration ?? duration,
            ease: 'power2.out',
            onStart: () => applyWillChange(container),
            onComplete: () => clearWillChange(container),
            ...options,
        },
    );
}

export function pageExit(container, callback, options = {}) {
    if (!container) {
        callback?.();
        return null;
    }

    if (prefersReducedMotion()) {
        callback?.();
        return null;
    }

    const duration = isMobileViewport() ? 0.12 : 0.2;
    const useTransform = !isMobileViewport();

    return gsap.to(container, {
        opacity: 0,
        ...(useTransform ? { y: -10 } : {}),
        duration: options.duration ?? duration,
        ease: 'power2.in',
        onStart: () => applyWillChange(container),
        onComplete: () => {
            clearWillChange(container);
            callback?.();
        },
        ...options,
    });
}

export function slideDown(element, open = true, options = {}) {
    if (!element) {
        return null;
    }

    if (prefersReducedMotion()) {
        gsap.set(element, {
            height: open ? 'auto' : 0,
            opacity: open ? 1 : 0,
            overflow: 'hidden',
        });
        return null;
    }

    if (open) {
        gsap.set(element, { height: 'auto', overflow: 'hidden' });
        const height = element.offsetHeight;

        return gsap.fromTo(
            element,
            { height: 0, opacity: 0 },
            {
                height,
                opacity: 1,
                duration: options.duration ?? 0.3,
                ease: 'power2.out',
                onComplete: () => {
                    gsap.set(element, { height: 'auto', overflow: '' });
                },
            },
        );
    }

    return gsap.to(element, {
        height: 0,
        opacity: 0,
        duration: options.duration ?? 0.25,
        ease: 'power2.in',
        overflow: 'hidden',
    });
}

export function countUp(element, targetValue, options = {}) {
    if (!element || prefersReducedMotion()) {
        if (element) {
            element.textContent = String(targetValue);
        }
        return null;
    }

    const counter = { value: 0 };

    return gsap.to(counter, {
        value: targetValue,
        duration: options.duration ?? 1.2,
        ease: 'power2.out',
        onUpdate: () => {
            element.textContent = Math.round(counter.value).toLocaleString();
        },
        ...options,
    });
}

export function dropdownEnter(element) {
    if (!element) {
        return null;
    }

    if (prefersReducedMotion()) {
        gsap.set(element, { opacity: 1, scaleY: 1, clearProps: 'transform' });
        return null;
    }

    gsap.set(element, { transformOrigin: 'top center' });

    return gsap.fromTo(
        element,
        { opacity: 0, scaleY: 0.9 },
        {
            opacity: 1,
            scaleY: 1,
            duration: 0.2,
            ease: 'power2.out',
        },
    );
}

export function dropdownLeave(element, onComplete) {
    if (!element) {
        onComplete?.();
        return null;
    }

    if (prefersReducedMotion()) {
        onComplete?.();
        return null;
    }

    return gsap.to(element, {
        opacity: 0,
        scaleY: 0.9,
        duration: 0.15,
        ease: 'power2.in',
        onComplete,
    });
}
