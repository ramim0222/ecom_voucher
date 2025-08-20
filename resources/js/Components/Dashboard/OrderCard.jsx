"use client";

import { GamingButton } from "@/Components/ui/GamingButton";

export function OrderCard({ order, detailed = false }) {
    // Debug logging to help identify data issues
    console.log("OrderCard order data:", order);

    const statusColors = {
        pending: "bg-gray-500/20 text-gray-400 border-gray-500/30",
        processing: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        completed: "bg-green-500/20 text-green-400 border-green-500/30",
        cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
        refunded: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    };

    const statusLabels = {
        pending: "Pending",
        processing: "Processing",
        completed: "Completed",
        cancelled: "Cancelled",
        refunded: "Refunded",
    };

    return (
        <div className="glass-card rounded-lg p-4 hover-lift">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                        <h3 className="font-heading font-semibold text-lg">
                            {order?.order_number ||
                                order?.id ||
                                "Unknown Order"}
                        </h3>
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                statusColors[order?.status] ||
                                statusColors.pending
                            }`}
                        >
                            {statusLabels[order?.status] || "Unknown"}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Ordered on{" "}
                            {order?.date
                                ? new Date(order.date).toLocaleDateString()
                                : "Unknown Date"}
                        </p>

                        {detailed &&
                            order?.items &&
                            Array.isArray(order.items) && (
                                <div className="space-y-1">
                                    {order.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between text-sm"
                                        >
                                            <span>
                                                {item?.title || "Unknown Item"}{" "}
                                                (
                                                {item?.platform ||
                                                    "Unknown Platform"}
                                                )
                                            </span>
                                            <span className="font-medium">
                                                $
                                                {typeof item?.price === "number"
                                                    ? item.price.toFixed(2)
                                                    : "0.00"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                        {!detailed && order?.items && (
                            <p className="text-sm">
                                {Array.isArray(order.items)
                                    ? order.items.length
                                    : 0}{" "}
                                item
                                {(Array.isArray(order.items)
                                    ? order.items.length
                                    : 0) > 1
                                    ? "s"
                                    : ""}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-lg font-bold text-accent">
                            $
                            {typeof order?.total === "number"
                                ? order.total.toFixed(2)
                                : "0.00"}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <GamingButton
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                (window.location.href = `/orders/${order?.id}`)
                            }
                        >
                            View Details
                        </GamingButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
