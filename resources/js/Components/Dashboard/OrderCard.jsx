"use client";

import { GamingButton } from "@/Components/ui/GamingButton";

export function OrderCard({ order, detailed = false }) {
    const statusColors = {
        delivered: "bg-green-500/20 text-green-400 border-green-500/30",
        processing: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
    };

    const statusLabels = {
        delivered: "Delivered",
        processing: "Processing",
        cancelled: "Cancelled",
    };

    return (
        <div className="glass-card rounded-lg p-4 hover-lift">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                        <h3 className="font-heading font-semibold text-lg">
                            {order.id}
                        </h3>
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                statusColors[order.status]
                            }`}
                        >
                            {statusLabels[order.status]}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Ordered on{" "}
                            {new Date(order.date).toLocaleDateString()}
                        </p>

                        {detailed && (
                            <div className="space-y-1">
                                {order.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <span>
                                            {item.title} ({item.platform})
                                        </span>
                                        <span className="font-medium">
                                            ${item.price}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!detailed && (
                            <p className="text-sm">
                                {order.items.length} item
                                {order.items.length > 1 ? "s" : ""}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-lg font-bold text-accent">
                            ${order.total.toFixed(2)}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <GamingButton variant="ghost" size="sm">
                            View Details
                        </GamingButton>
                        {order.status === "delivered" && (
                            <GamingButton variant="primary" size="sm">
                                Download
                            </GamingButton>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
