import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { ToastProvider } from '@/Components/Admin/ToastProvider';
import PageTransition from '@/Components/PageTransition';

createInertiaApp({
    title: (title) => title || 'GameVault',
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        if (import.meta.env.SSR) {
            hydrateRoot(
                el,
                <ToastProvider>
                    <PageTransition>
                        <App {...props} />
                    </PageTransition>
                </ToastProvider>,
            );
            return;
        }

        createRoot(el).render(
            <ToastProvider>
                <PageTransition>
                    <App {...props} />
                </PageTransition>
            </ToastProvider>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});
