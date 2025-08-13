"use client";

import { Header } from "@/Components/Layout/Header";
import { DashboardLayout } from "@/Components/Dashboard/DashboardLayout";
import { OrderCard } from "@/Components/Dashboard/OrderCard";
import { StatsCard } from "@/Components/Dashboard/StatsCard";
import { GamingButton } from "@/Components/ui/GamingButton";

export default function DashboardPage() {
    const recentOrders = [
        {
            id: "ORD-2024-001",
            date: "2024-01-15",
            status: "delivered",
            total: 99.33,
            items: [
                { title: "Steam Wallet $50", platform: "Steam", price: 45.99 },
                {
                    title: "PlayStation Store $25",
                    platform: "PlayStation",
                    price: 22.99,
                },
            ],
        },
        {
            id: "ORD-2024-002",
            date: "2024-01-12",
            status: "delivered",
            total: 29.99,
            items: [
                {
                    title: "Xbox Game Pass 3 Months",
                    platform: "Xbox",
                    price: 29.99,
                },
            ],
        },
        {
            id: "ORD-2024-003",
            date: "2024-01-10",
            status: "processing",
            total: 18.99,
            items: [
                {
                    title: "Nintendo eShop $20",
                    platform: "Nintendo",
                    price: 18.99,
                },
            ],
        },
    ];

    const stats = [
        { label: "Total Orders", value: "12", icon: "📦" },
        { label: "Total Spent", value: "$456.78", icon: "💰" },
        { label: "Vouchers Redeemed", value: "8", icon: "🎮" },
        { label: "Account Level", value: "Gold", icon: "⭐" },
    ];

    return (
        <div className="min-h-screen">
            <Header />
            <DashboardLayout>
                <div className="space-y-8">
                    {/* Welcome Section */}
                    <div className="glass-card rounded-xl p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2">
                                    Welcome back, John!
                                </h1>
                                <p className="text-muted-foreground">
                                    Here's what's happening with your gaming
                                    vouchers
                                </p>
                            </div>
                            <GamingButton variant="primary" size="lg">
                                Browse New Vouchers
                            </GamingButton>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <StatsCard key={index} {...stat} />
                        ))}
                    </div>

                    {/* Recent Orders */}
                    <div className="glass-card rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-heading font-semibold text-xl">
                                Recent Orders
                            </h2>
                            <GamingButton
                                variant="ghost"
                                onClick={() =>
                                    (window.location.href = "/dashboard/orders")
                                }
                            >
                                View All Orders
                            </GamingButton>
                        </div>

                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <OrderCard key={order.id} order={order} />
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="glass-card rounded-xl p-6">
                        <h2 className="font-heading font-semibold text-xl mb-6">
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <GamingButton
                                variant="secondary"
                                size="lg"
                                className="h-20 flex-col"
                                onClick={() =>
                                    (window.location.href = "/products")
                                }
                            >
                                <span className="text-2xl mb-1">🛒</span>
                                <span>Shop Vouchers</span>
                            </GamingButton>
                            <GamingButton
                                variant="secondary"
                                size="lg"
                                className="h-20 flex-col"
                                onClick={() =>
                                    (window.location.href = "/dashboard/orders")
                                }
                            >
                                <span className="text-2xl mb-1">📋</span>
                                <span>Order History</span>
                            </GamingButton>
                            <GamingButton
                                variant="secondary"
                                size="lg"
                                className="h-20 flex-col"
                                onClick={() =>
                                    (window.location.href =
                                        "/dashboard/profile")
                                }
                            >
                                <span className="text-2xl mb-1">⚙️</span>
                                <span>Account Settings</span>
                            </GamingButton>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </div>
    );
}
