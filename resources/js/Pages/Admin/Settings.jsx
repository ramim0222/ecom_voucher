"use client";

import { Head, Link } from "@inertiajs/react";
import { AdminLayout } from "@/Components/Admin/AdminLayout";

export default function Settings() {
    const storeSettings = [
        {
            href: route("admin.settings.branding"),
            title: "Store Branding",
            description:
                "Upload logo and favicon, and set your brand name and description.",
            icon: "🎨",
        },
    ];

    const marketingIntegrations = [
        {
            href: route("admin.settings.marketing.meta"),
            title: "Meta (Facebook)",
            description:
                "Configure Facebook Conversion API, pixel ID, and browser/server tracking.",
            icon: "📘",
        },
        {
            href: route("admin.settings.marketing.google"),
            title: "Google Analytics & Tag Manager",
            description:
                "Add Google Analytics and GTM scripts for head and body sections.",
            icon: "📈",
        },
        {
            href: route("admin.settings.marketing.tiktok"),
            title: "TikTok Pixel",
            description:
                "Paste your TikTok Pixel script for conversion tracking and audiences.",
            icon: "🎵",
        },
    ];
    return (
        <AdminLayout>
            <Head title="Settings" />

            <div className="space-y-6">
                <div>
                    <h1 className="font-heading font-bold text-3xl text-white mb-2">
                        ⚙️ Settings
                    </h1>
                    <p className="text-slate-400">
                        Manage store branding, integrations, and marketing
                        tracking.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-white mb-4">
                        Store Settings
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {storeSettings.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6 hover:border-orange-500/50 hover:bg-slate-800/70 transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    <span className="text-3xl">{item.icon}</span>
                                    <div>
                                        <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-slate-400 mt-2">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-white mb-4">
                        Marketing Integrations
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {marketingIntegrations.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6 hover:border-orange-500/50 hover:bg-slate-800/70 transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    <span className="text-3xl">{item.icon}</span>
                                    <div>
                                        <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-slate-400 mt-2">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
