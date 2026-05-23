"use client";

import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { GamingButton } from "@/Components/ui/GamingButton";

export function DashboardLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItems = [
        { href: "/dashboard", label: "Dashboard", icon: "🏠" },
        { href: "/dashboard/profile", label: "Profile", icon: "👤" },
        { href: "/dashboard/orders", label: "Orders", icon: "📦" },
    ];

    const handleLogout = () => {
        router.post(route("logout"));
    };

    return (
        <div className="flex min-h-screen">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 glass-card transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                }`}
            >
                <div className="flex flex-col h-full p-6">
                    <nav className="flex-1 space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors group"
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium group-hover:text-accent">
                                    {item.label}
                                </span>
                            </Link>
                        ))}

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors group w-full text-left"
                        >
                            <span className="text-xl">➡️</span>
                            <span className="font-medium group-hover:text-accent">
                                Logout
                            </span>
                        </button>
                    </nav>

                    <div className="pt-6 border-t border-border">
                        <GamingButton
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={handleLogout}
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
                <div className="lg:hidden flex items-center justify-between p-4 glass-card">
                    <GamingButton
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        ☰
                    </GamingButton>
                    <span className="font-heading font-bold text-lg">
                        Dashboard
                    </span>
                    <div></div>
                </div>

                <div className="p-6">{children}</div>
            </main>
        </div>
    );
}
