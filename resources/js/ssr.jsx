import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { route } from '../../vendor/tightenco/ziggy';
import { ToastProvider } from '@/Components/Admin/ToastProvider';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => title || 'GameVault',
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.jsx`,
                import.meta.glob('./Pages/**/*.jsx'),
            ),
        setup: ({ App, props }) => {
            global.route = (name, params, absolute) =>
                route(name, params, absolute, {
                    ...page.props.ziggy,
                    location: new URL(page.props.ziggy.location),
                });

            return (
                <ToastProvider>
                    <App {...props} />
                </ToastProvider>
            );
        },
    }),
);
