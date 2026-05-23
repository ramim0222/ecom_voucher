"use client";

import { useRef } from "react";
import { Link } from "@inertiajs/react";
import { SiteLayout } from "@/Components/Layout/SiteLayout";
import { PageHead } from "@/Components/PageHead";
import { DashboardLayout } from "@/Components/Dashboard/DashboardLayout";
import { OrderCard } from "@/Components/Dashboard/OrderCard";
import { StatsCard } from "@/Components/Dashboard/StatsCard";
import { GamingButton } from "@/Components/ui/GamingButton";
import { useGsap } from "@/hooks/useGsap";
import { fadeInUp, staggerIn } from "@/lib/animations";

export default function DashboardPage({ user, recentOrders, stats }) {
    const welcomeRef = useRef(null);
    const statsRef = useRef(null);
    const ordersRef = useRef(null);
    const actionsRef = useRef(null);

    useGsap(() => {
        fadeInUp(welcomeRef.current);

        if (statsRef.current) {
            staggerIn(statsRef.current.children, 0.08, { delay: 0.1 });
        }

        fadeInUp(ordersRef.current, { delay: 0.2 });

        if (actionsRef.current) {
            staggerIn(actionsRef.current.children, 0.06, { delay: 0.3 });
        }
    }, []);

    return (
        <SiteLayout>
            <PageHead title="Dashboard" />
            <DashboardLayout>
                <div className="space-y-8">
                    {/* Welcome Section */}
                    <div ref={welcomeRef} className="glass-card rounded-xl p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl mb-2">
                                    Welcome back, {user?.name || "Gamer"}!
                                </h1>
                                <p className="text-muted-foreground">
                                    Here's what's happening with your gaming
                                    vouchers
                                </p>
                            </div>
                            <Link href={route("products")}>
                                <GamingButton variant="primary" size="lg">
                                    Browse New Vouchers
                                </GamingButton>
                            </Link>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div
                        ref={statsRef}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {stats && Array.isArray(stats) && stats.length > 0 ? (
                            stats.map((stat, index) => (
                                <StatsCard key={index} {...stat} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8 text-muted-foreground">
                                <p>No statistics available</p>
                            </div>
                        )}
                    </div>

                    {/* Recent Orders */}
                    <div ref={ordersRef} className="glass-card rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-heading font-semibold text-xl">
                                Recent Orders
                            </h2>
                            <Link href={route("dashboard.orders")}>
                                <GamingButton variant="ghost">
                                    View All Orders
                                </GamingButton>
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {recentOrders &&
                            Array.isArray(recentOrders) &&
                            recentOrders.length > 0 ? (
                                recentOrders.map((order) => (
                                    <OrderCard key={order.id} order={order} />
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p className="text-lg mb-2">
                                        No orders yet
                                    </p>
                                    <p>
                                        Start shopping to see your order history
                                        here!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="glass-card rounded-xl p-6">
                        <h2 className="font-heading font-semibold text-xl mb-6">
                            Quick Actions
                        </h2>
                        <div
                            ref={actionsRef}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                        >
                            <Link href={route("products")}>
                                <GamingButton
                                    variant="secondary"
                                    size="lg"
                                    className="h-20 flex-col w-full"
                                >
                                    <span className="text-2xl mb-1">🛒</span>
                                    <span>Shop Vouchers</span>
                                </GamingButton>
                            </Link>
                            <Link href={route("dashboard.orders")}>
                                <GamingButton
                                    variant="secondary"
                                    size="lg"
                                    className="h-20 flex-col w-full"
                                >
                                    <span className="text-2xl mb-1">📋</span>
                                    <span>Order History</span>
                                </GamingButton>
                            </Link>
                            <Link href={route("wishlist")}>
                                <GamingButton
                                    variant="secondary"
                                    size="lg"
                                    className="h-20 flex-col w-full"
                                >
                                    <span className="text-2xl mb-1">❤️</span>
                                    <span>Wishlist</span>
                                </GamingButton>
                            </Link>
                            <Link href={route("dashboard.profile")}>
                                <GamingButton
                                    variant="secondary"
                                    size="lg"
                                    className="h-20 flex-col w-full"
                                >
                                    <span className="text-2xl mb-1">⚙️</span>
                                    <span>Account Settings</span>
                                </GamingButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </SiteLayout>
    );
}
