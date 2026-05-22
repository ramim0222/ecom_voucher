"use client";

import { useState } from "react";
import { GamingButton } from "@/Components/ui/GamingButton";
import { FlashToastListener } from "@/Components/Admin/ToastProvider";
import { router } from "@inertiajs/react";

export function AdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItems = [
        { href: "/admin", label: "Dashboard", icon: "📊" },
        { href: "/admin/profile", label: "Profile", icon: "👤" },
        { href: "/admin/products", label: "Products", icon: "🎮" },
        { href: "/admin/orders", label: "Orders", icon: "📦" },
        { href: "/admin/users", label: "Users", icon: "👥" },
        { href: "/admin/categories", label: "Categories", icon: "📂" },
        { href: "/admin/reviews", label: "Reviews", icon: "💬" },
        { href: "/admin/settings", label: "Settings", icon: "⚙️" },

        { href: "/", label: "View Store", icon: "🛒" },
    ];

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <FlashToastListener />
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-800/50 backdrop-blur-xl border-r border-slate-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full p-6">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                                A
                            </span>
                        </div>
                        <span className="font-heading font-bold text-xl text-white">
                            Admin Panel
                        </span>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {menuItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-colors group text-slate-300 hover:text-white"
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium">
                                    {item.label}
                                </span>
                            </a>
                        ))}
                    </nav>

                    <div className="pt-6 border-t border-slate-700">
                        <GamingButton
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-slate-300 hover:text-white"
                            onClick={() => router.post(route("logout"))}
                        >
                            <span className="text-xl mr-3">🚪</span>
                            Sign Out
                        </GamingButton>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-0">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between p-4 bg-slate-800/50 backdrop-blur-xl border-b border-slate-700">
                    <GamingButton
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-white"
                    >
                        ☰
                    </GamingButton>
                    <span className="font-heading font-bold text-lg text-white">
                        Admin Panel
                    </span>
                    <div></div>
                </div>

                <div className="p-6 text-white">{children}</div>
            </main>
        </div>
    );
}
