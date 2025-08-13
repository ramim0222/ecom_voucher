"use client";

import { useState } from "react";
import { Header } from "@/Components/Layout/Header";
import { DashboardLayout } from "@/Components/Dashboard/DashboardLayout";
import { OrderCard } from "@/Components/Dashboard/OrderCard";
import { GamingButton } from "@/Components/ui/GamingButton";

export default function OrdersPage() {
    const [filter, setFilter] = useState("all");

    const orders = [
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
        {
            id: "ORD-2024-004",
            date: "2024-01-08",
            status: "cancelled",
            total: 45.99,
            items: [
                { title: "Steam Wallet $50", platform: "Steam", price: 45.99 },
            ],
        },
        {
            id: "ORD-2024-005",
            date: "2024-01-05",
            status: "delivered",
            total: 22.99,
            items: [
                {
                    title: "PlayStation Store $25",
                    platform: "PlayStation",
                    price: 22.99,
                },
            ],
        },
    ];

    const filteredOrders = orders.filter((order) => {
        if (filter === "all") return true;
        return order.status === filter;
    });

    const filterOptions = [
        { value: "all", label: "All Orders" },
        { value: "delivered", label: "Delivered" },
        { value: "processing", label: "Processing" },
        { value: "cancelled", label: "Cancelled" },
    ];

    return (
        <div className="min-h-screen">
            <Header />
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2">
                                Order History
                            </h1>
                            <p className="text-muted-foreground">
                                Track and manage all your voucher purchases
                            </p>
                        </div>

                        <div className="flex gap-2">
                            {filterOptions.map((option) => (
                                <GamingButton
                                    key={option.value}
                                    variant={
                                        filter === option.value
                                            ? "primary"
                                            : "ghost"
                                    }
                                    size="sm"
                                    onClick={() => setFilter(option.value)}
                                >
                                    {option.label}
                                </GamingButton>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card rounded-xl p-6">
                        <div className="space-y-4">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <OrderCard
                                        key={order.id}
                                        order={order}
                                        detailed
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📦</div>
                                    <h3 className="font-heading font-semibold text-xl mb-2">
                                        No orders found
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        {filter === "all"
                                            ? "You haven't placed any orders yet."
                                            : `No ${filter} orders found.`}
                                    </p>
                                    <GamingButton
                                        variant="primary"
                                        onClick={() =>
                                            (window.location.href = "/products")
                                        }
                                    >
                                        Start Shopping
                                    </GamingButton>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </div>
    );
}
