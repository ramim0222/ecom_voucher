import { useRef } from 'react';
import { useGsap } from '@/hooks/useGsap';
import {
    fadeInUp,
    fadeInLeft,
    fadeInRight,
    revealOnScroll,
    staggerIn,
    staggerInOnScroll,
} from '@/lib/animations';

export function usePageAnimations(config = {}) {
    const refs = {
        hero: useRef(null),
        heroTitle: useRef(null),
        heroDescription: useRef(null),
        heroCta: useRef(null),
        header: useRef(null),
        sidebar: useRef(null),
        grid: useRef(null),
        left: useRef(null),
        right: useRef(null),
        form: useRef(null),
        summary: useRef(null),
        sections: useRef(null),
        panel: useRef(null),
        content: useRef(null),
    };

    useGsap(() => {
        if (config.hero) {
            fadeInUp(refs.heroTitle.current, { delay: 0.05 });
            fadeInUp(refs.heroDescription.current, { delay: 0.15 });
            fadeInUp(refs.heroCta.current, { delay: 0.25 });
        }

        if (config.header) {
            fadeInUp(refs.header.current);
        }

        if (config.sidebar) {
            fadeInLeft(refs.sidebar.current, { delay: 0.1 });
        }

        if (config.grid) {
            if (refs.grid.current) {
                staggerInOnScroll(refs.grid.current.children, 0.08, {
                    trigger: refs.grid.current,
                });
            }
        }

        if (config.split) {
            fadeInLeft(refs.left.current, { delay: 0.05 });
            fadeInRight(refs.summary.current || refs.right.current, {
                delay: 0.15,
            });
        }

        if (config.form) {
            fadeInLeft(refs.form.current, { delay: 0.05 });
            fadeInRight(refs.summary.current, { delay: 0.15 });
        }

        if (config.list) {
            const listTarget = refs.grid.current || refs.left.current;

            if (listTarget) {
                staggerIn(listTarget.children, 0.08);
            }
        }

        if (config.panel) {
            fadeInUp(refs.panel.current, { fromY: 20 });
        }

        if (config.sections && refs.sections.current) {
            revealOnScroll(refs.sections.current.children, {
                trigger: refs.sections.current,
            });
        }

        if (config.content) {
            fadeInUp(refs.content.current);
        }
    }, []);

    return refs;
}
