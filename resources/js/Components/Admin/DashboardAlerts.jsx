import { router } from "@inertiajs/react";
import { GamingButton } from "@/Components/ui/GamingButton";

export function DashboardAlerts({ stats, lowStockProducts = [] }) {
    if (!stats) return null;

    const alerts = [
        stats.pendingOrders > 0 && {
            type: "warning",
            title: "Pending Orders",
            message: `${stats.pendingOrders} order${
                stats.pendingOrders !== 1 ? "s" : ""
            } awaiting action`,
            action: "View Orders",
            href: route("admin.orders.index"),
            query: { status: "pending" },
        },
        stats.processingOrders > 0 && {
            type: "info",
            title: "Processing Orders",
            message: `${stats.processingOrders} order${
                stats.processingOrders !== 1 ? "s" : ""
            } in progress`,
            action: "View Orders",
            href: route("admin.orders.index"),
            query: { status: "processing" },
        },
        stats.pendingReviews > 0 && {
            type: "warning",
            title: "Pending Reviews",
            message: `${stats.pendingReviews} review${
                stats.pendingReviews !== 1 ? "s" : ""
            } need moderation`,
            action: "Review Now",
            href: route("admin.reviews"),
            query: { status: "pending" },
        },
    ].filter(Boolean);

    const alertStyles = {
        warning: "border-yellow-500/30 bg-yellow-500/10",
        info: "border-blue-500/30 bg-blue-500/10",
        danger: "border-red-500/30 bg-red-500/10",
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
            <h3 className="font-heading font-semibold text-xl text-white mb-6">
                Needs Attention
            </h3>

            {alerts.length === 0 && lowStockProducts.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-3xl mb-2">✅</div>
                    <p className="text-slate-300">All caught up!</p>
                    <p className="text-slate-500 text-sm mt-1">
                        No urgent items require your attention
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {alerts.map((alert, index) => (
                        <div
                            key={index}
                            className={`rounded-lg border p-4 ${
                                alertStyles[alert.type]
                            }`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-white font-medium">
                                        {alert.title}
                                    </p>
                                    <p className="text-slate-400 text-sm mt-1">
                                        {alert.message}
                                    </p>
                                </div>
                                <GamingButton
                                    variant="ghost"
                                    size="sm"
                                    className="text-orange-400 shrink-0"
                                    onClick={() =>
                                        router.get(alert.href, alert.query)
                                    }
                                >
                                    {alert.action}
                                </GamingButton>
                            </div>
                        </div>
                    ))}

                    {lowStockProducts.length > 0 && (
                        <div
                            className={`rounded-lg border p-4 ${alertStyles.danger}`}
                        >
                            <p className="text-white font-medium mb-3">
                                Low Stock Products
                            </p>
                            <div className="space-y-2">
                                {lowStockProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center justify-between gap-3 text-sm"
                                    >
                                        <span className="text-slate-300 truncate">
                                            {product.title}
                                        </span>
                                        <span
                                            className={`shrink-0 font-medium ${
                                                product.available_codes === 0
                                                    ? "text-red-400"
                                                    : "text-yellow-400"
                                            }`}
                                        >
                                            {product.available_codes} left
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <GamingButton
                                variant="ghost"
                                size="sm"
                                className="text-orange-400 mt-3"
                                onClick={() =>
                                    router.visit("/admin/products")
                                }
                            >
                                Manage Products
                            </GamingButton>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
