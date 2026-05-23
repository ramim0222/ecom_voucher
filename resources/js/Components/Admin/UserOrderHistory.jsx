"use client";

import { useState } from "react";
import { GamingButton } from "@/Components/ui/GamingButton";
import { router } from "@inertiajs/react";

export function UserOrderHistory({ userId }) {
    const [orders] = useState([
        {
            id: "ORD-2024-001",
            date: "2024-01-20T10:30:00Z",
            status: "delivered",
            total: 89.99,
            items: [
                { name: "Steam $50 Gift Card", quantity: 1, price: 50.0 },
                { name: "PlayStation Plus 1 Month", quantity: 1, price: 39.99 },
            ],
        },
        {
            id: "ORD-2024-002",
            date: "2024-01-15T14:22:00Z",
            status: "processing",
            total: 129.98,
            items: [
                {
                    name: "Xbox Game Pass Ultimate 3 Months",
                    quantity: 1,
                    price: 129.98,
                },
            ],
        },
        {
            id: "ORD-2023-045",
            date: "2023-12-28T09:15:00Z",
            status: "delivered",
            total: 199.97,
            items: [
                {
                    name: "Nintendo eShop $100 Gift Card",
                    quantity: 1,
                    price: 100.0,
                },
                { name: "Steam $50 Gift Card", quantity: 1, price: 50.0 },
                { name: "Epic Games $25 Gift Card", quantity: 1, price: 49.97 },
            ],
        },
    ]);

    const getStatusColor = (status) => {
        switch (status) {
            case "delivered":
                return "text-green-400 bg-green-400/20";
            case "processing":
                return "text-yellow-400 bg-yellow-400/20";
            case "cancelled":
                return "text-red-400 bg-red-400/20";
            default:
                return "text-slate-400 bg-slate-400/20";
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold text-lg text-white">
                    Order History
                </h3>
                <div className="text-slate-400 text-sm">
                    {orders.length} total orders
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-slate-400 text-lg mb-2">
                        No orders found
                    </div>
                    <p className="text-slate-500 text-sm">
                        This user hasn't placed any orders yet
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-slate-700/30 border border-slate-600 rounded-lg p-4"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <h4 className="font-medium text-white">
                                            {order.id}
                                        </h4>
                                        <p className="text-slate-400 text-sm">
                                            {new Date(
                                                order.date
                                            ).toLocaleDateString()}{" "}
                                            at{" "}
                                            {new Date(
                                                order.date
                                            ).toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                            order.status
                                        )}`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-white font-medium">
                                            Tk {order.total.toFixed(2)}
                                        </div>
                                        <div className="text-slate-400 text-sm">
                                            {order.items.length} items
                                        </div>
                                    </div>
                                    <GamingButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            router.visit(
                                                route(
                                                    "admin.orders.show",
                                                    order.id
                                                )
                                            )
                                        }
                                        className="text-slate-300"
                                    >
                                        View Details
                                    </GamingButton>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="border-t border-slate-600 pt-4">
                                <div className="space-y-2">
                                    {order.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between text-sm"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-400">
                                                    ×{item.quantity}
                                                </span>
                                                <span className="text-white">
                                                    {item.name}
                                                </span>
                                            </div>
                                            <span className="text-slate-300">
                                                Tk {item.price.toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
