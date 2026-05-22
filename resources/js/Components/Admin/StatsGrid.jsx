export function StatsGrid({ stats }) {
    if (!stats) return null;

    const formatGrowth = (value) =>
        `${value >= 0 ? "+" : ""}${value ?? 0}% vs last month`;

    const statCards = [
        {
            label: "Total Revenue",
            value: `Tk ${Number(stats.totalRevenue ?? 0).toLocaleString()}`,
            sublabel: "All-time paid orders",
            change: formatGrowth(stats.monthGrowth),
            positive: stats.monthGrowth >= 0,
            icon: "💰",
        },
        {
            label: "This Month",
            value: `Tk ${Number(stats.monthRevenue ?? 0).toLocaleString()}`,
            sublabel: `${stats.monthOrders ?? 0} orders this month`,
            change: formatGrowth(stats.monthOrdersGrowth),
            positive: stats.monthOrdersGrowth >= 0,
            icon: "📈",
        },
        {
            label: "Today's Sales",
            value: `Tk ${Number(stats.todayRevenue ?? 0).toLocaleString()}`,
            sublabel: `${stats.todayOrders ?? 0} orders today`,
            change: `${stats.totalOrders ?? 0} total orders`,
            positive: true,
            icon: "🛒",
        },
        {
            label: "Customers",
            value: (stats.totalCustomers ?? 0).toLocaleString(),
            sublabel: `${stats.newCustomersThisMonth ?? 0} new this month`,
            change: `${stats.totalReviews ?? 0} approved reviews`,
            positive: true,
            icon: "👥",
        },
        {
            label: "Products",
            value: (stats.activeProducts ?? 0).toLocaleString(),
            sublabel: `${stats.totalProducts ?? 0} total listings`,
            change: `${stats.availableCodes ?? 0} codes in stock`,
            positive: (stats.availableCodes ?? 0) > 0,
            icon: "🎮",
        },
        {
            label: "Needs Action",
            value: (
                (stats.pendingOrders ?? 0) + (stats.pendingReviews ?? 0)
            ).toLocaleString(),
            sublabel: `${stats.pendingOrders ?? 0} orders · ${stats.pendingReviews ?? 0} reviews`,
            change: `${stats.processingOrders ?? 0} processing`,
            positive: false,
            icon: "⚡",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {statCards.map((stat, index) => (
                <div
                    key={index}
                    className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-5 border border-slate-700"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">{stat.icon}</span>
                                <p className="text-sm text-slate-400">
                                    {stat.label}
                                </p>
                            </div>
                            <p className="text-2xl font-bold text-white truncate">
                                {stat.value}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                {stat.sublabel}
                            </p>
                        </div>
                        <div
                            className={`text-xs font-medium text-right shrink-0 ${
                                stat.positive
                                    ? "text-green-400"
                                    : "text-orange-400"
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
