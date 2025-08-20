export function StatsGrid({ stats }) {
    if (!stats) return null;

    const statCards = [
        {
            label: "Total Revenue",
            value: `$${stats.totalRevenue?.toLocaleString() || "0"}`,
            change: `${stats.monthGrowth >= 0 ? "+" : ""}${
                stats.monthGrowth || 0
            }%`,
            positive: stats.monthGrowth >= 0,
        },
        {
            label: "Total Orders",
            value: stats.totalOrders?.toLocaleString() || "0",
            change: `Today: ${stats.todayOrders || 0}`,
            positive: true,
        },
        {
            label: "Total Customers",
            value: stats.totalCustomers?.toLocaleString() || "0",
            change: `Products: ${stats.totalProducts || 0}`,
            positive: true,
        },
        {
            label: "Today's Revenue",
            value: `$${stats.todayRevenue?.toLocaleString() || "0"}`,
            change: `Reviews: ${stats.totalReviews || 0}`,
            positive: true,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
                <div
                    key={index}
                    className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400 mb-1">
                                {stat.label}
                            </p>
                            <p className="text-2xl font-bold text-white">
                                {stat.value}
                            </p>
                        </div>
                        <div
                            className={`text-sm font-medium ${
                                stat.positive
                                    ? "text-green-400"
                                    : "text-red-400"
                            }`}
                        >
                            {stat.change}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
