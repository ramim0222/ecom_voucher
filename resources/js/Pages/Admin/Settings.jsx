"use client";

import { Head, Link } from "@inertiajs/react";
import { AdminLayout } from "@/Components/Admin/AdminLayout";

export default function Settings() {
    const storeSettings = [
        {
            href: route("admin.settings.branding"),
            title: "Store Branding",
            description:
                "Upload logo and favicon, set brand name, homepage content, and auth page panel.",
            icon: "🎨",
        },
        {
            href: route("admin.settings.payment"),
            title: "Payment Settings",
            description:
                "Configure bKash, Nagad, and Rocket gateway credentials and toggle each method on or off.",
            icon: "💳",
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

    const storePages = [
        {
            href: route("admin.settings.content.faq"),
            title: "FAQ",
            description:
                "Manage frequently asked questions shown on the public help page.",
            icon: "❓",
        },
        {
            href: route("admin.settings.content.refund"),
            title: "Refund & Cancellation Policy",
            description:
                "Edit refund rules, cancellation terms, and return conditions.",
            icon: "↩️",
        },
        {
            href: route("admin.settings.content.privacy"),
            title: "Privacy Policy",
            description:
                "Update how customer data is collected, used, and protected.",
            icon: "🔒",
        },
        {
            href: route("admin.settings.content.terms"),
            title: "Terms & Conditions",
            description:
                "Set the store terms and conditions for customers.",
            icon: "📄",
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
                        Manage store branding, integrations, marketing
                        tracking, and legal pages.
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
                        Store Pages
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {storePages.map((item) => (
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
