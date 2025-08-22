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
        <div className="glass-card rounded-lg p-3 sm:p-4 md:p-5 lg:p-6 hover-lift transition-all duration-200">
            {/* Mobile Layout (320px - 767px) */}
            <div className="block sm:hidden">
                <div className="space-y-3">
                    {/* Header */}
                    <div className="flex flex-col gap-2">
                        <h3 className="font-heading font-semibold text-base sm:text-lg">
                            {order?.order_number ||
                                order?.id ||
                                "Unknown Order"}
                        </h3>
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border w-fit ${
                                statusColors[order?.status] ||
                                statusColors.pending
                            }`}
                        >
                            {statusLabels[order?.status] || "Unknown"}
                        </span>
                    </div>

                    {/* Order Info */}
                    <div className="space-y-2">
                        <p className="text-xs sm:text-sm text-muted-foreground">
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
                                            className="flex items-center justify-between text-xs sm:text-sm"
                                        >
                                            <span className="flex-1 pr-2">
                                                {item?.title || "Unknown Item"}{" "}
                                                <span className="text-muted-foreground">
                                                    (
                                                    {item?.platform ||
                                                        "Unknown Platform"}
                                                    )
                                                </span>
                                            </span>
                                            <span className="font-medium text-right">
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
                            <p className="text-xs sm:text-sm">
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

                    {/* Mobile Actions */}
                    <div className="flex items-center justify-between pt-2">
                        <div className="text-left">
                            <p className="text-lg sm:text-xl font-bold text-accent">
                                $
                                {typeof order?.total === "number"
                                    ? order.total.toFixed(2)
                                    : "0.00"}
                            </p>
                        </div>
                        <GamingButton
                            variant="ghost"
                            size="sm"
                            className="text-xs px-3 py-1"
                            onClick={() =>
                                (window.location.href = `/orders/${order?.id}`)
                            }
                        >
                            View
                        </GamingButton>
                    </div>
                </div>
            </div>

            {/* Tablet Layout (768px - 1023px) */}
            <div className="hidden sm:block lg:hidden">
                <div className="flex flex-col gap-4">
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                        <h3 className="font-heading font-semibold text-lg">
                            {order?.order_number ||
                                order?.id ||
                                "Unknown Order"}
                        </h3>
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-medium border ${
                                statusColors[order?.status] ||
                                statusColors.pending
                            }`}
                        >
                            {statusLabels[order?.status] || "Unknown"}
                        </span>
                    </div>

                    {/* Content Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex-1 space-y-2">
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
                                                    {item?.title ||
                                                        "Unknown Item"}{" "}
                                                    <span className="text-muted-foreground">
                                                        (
                                                        {item?.platform ||
                                                            "Unknown Platform"}
                                                        )
                                                    </span>
                                                </span>
                                                <span className="font-medium">
                                                    $
                                                    {typeof item?.price ===
                                                    "number"
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

                        <div className="flex flex-col items-end gap-3 ml-6">
                            <p className="text-xl font-bold text-accent">
                                $
                                {typeof order?.total === "number"
                                    ? order.total.toFixed(2)
                                    : "0.00"}
                            </p>
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

            {/* Desktop Layout (1024px+) */}
            <div className="hidden lg:block">
                <div className="flex items-center justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                            <h3 className="font-heading font-semibold text-lg">
                                {order?.order_number ||
                                    order?.id ||
                                    "Unknown Order"}
                            </h3>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium border ${
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
                                                    {item?.title ||
                                                        "Unknown Item"}{" "}
                                                    <span className="text-muted-foreground">
                                                        (
                                                        {item?.platform ||
                                                            "Unknown Platform"}
                                                        )
                                                    </span>
                                                </span>
                                                <span className="font-medium">
                                                    $
                                                    {typeof item?.price ===
                                                    "number"
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

                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-xl font-bold text-accent">
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
        </div>
    );
}
