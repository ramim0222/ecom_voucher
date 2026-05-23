"use client";

import { GamingButton } from "@/Components/ui/GamingButton";
import { router } from "@inertiajs/react";

export function UserOrderHistory({ orders = [] }) {
    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "text-green-400 bg-green-400/20";
            case "processing":
                return "text-yellow-400 bg-yellow-400/20";
            case "pending":
                return "text-blue-400 bg-blue-400/20";
            case "cancelled":
                return "text-red-400 bg-red-400/20";
            case "refunded":
                return "text-purple-400 bg-purple-400/20";
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
                                            {order.order_number}
                                        </h4>
                                        <p className="text-slate-400 text-sm">
                                            {new Date(
                                                order.created_at
                                            ).toLocaleDateString()}{" "}
                                            at{" "}
                                            {new Date(
                                                order.created_at
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
                                            Tk{" "}
                                            {parseFloat(
                                                order.total_amount || 0
                                            ).toFixed(2)}
                                        </div>
                                        <div className="text-slate-400 text-sm">
                                            {order.items?.length || 0} items
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

                            {order.items?.length > 0 && (
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
                                                    Tk{" "}
                                                    {parseFloat(
                                                        item.price || 0
                                                    ).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
