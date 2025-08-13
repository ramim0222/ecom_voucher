export function StatsGrid() {
    const stats = [
        {
            label: "Total Revenue",
            value: "$12,456",
            change: "+12.5%",
            positive: true,
        },
        {
            label: "Total Orders",
            value: "1,234",
            change: "+8.2%",
            positive: true,
        },
        {
            label: "Active Users",
            value: "5,678",
            change: "+15.3%",
            positive: true,
        },
        {
            label: "Products Sold",
            value: "2,345",
            change: "-2.1%",
            positive: false,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
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
