import { router } from "@inertiajs/react";

export function QuickActions({ stats }) {
    const actions = [
        {
            label: "Add Product",
            description: "Create a new voucher listing",
            icon: "🎮",
            href: "/admin/products",
        },
        {
            label: "View Orders",
            description: `${stats?.pendingOrders ?? 0} pending`,
            icon: "📦",
            href: route("admin.orders.index"),
        },
        {
            label: "Manage Users",
            description: `${stats?.totalCustomers ?? 0} customers`,
            icon: "👥",
            href: "/admin/users",
        },
        {
            label: "Moderate Reviews",
            description: `${stats?.pendingReviews ?? 0} pending`,
            icon: "💬",
            href: route("admin.reviews"),
        },
        {
            label: "Categories",
            description: "Organize products",
            icon: "📂",
            href: "/admin/categories",
        },
        {
            label: "View Store",
            description: "See the storefront",
            icon: "🛒",
            href: "/",
        },
    ];

    return (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
            <h3 className="font-heading font-semibold text-xl text-white mb-6">
                Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {actions.map((action) => (
                    <button
                        key={action.label}
                        type="button"
                        onClick={() => router.visit(action.href)}
                        className="flex flex-col items-start gap-2 rounded-lg border border-slate-700 bg-slate-700/30 p-4 text-left transition-colors hover:border-orange-500/50 hover:bg-slate-700/50"
                    >
                        <span className="text-2xl">{action.icon}</span>
                        <span className="text-white font-medium text-sm">
                            {action.label}
                        </span>
                        <span className="text-slate-400 text-xs">
                            {action.description}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
