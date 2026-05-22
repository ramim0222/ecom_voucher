export function SalesChart({ salesData }) {
    if (!salesData?.revenue?.length) {
        return (
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
                <h3 className="font-heading font-semibold text-xl text-white mb-6">
                    Sales Overview
                </h3>
                <div className="text-center py-12 text-slate-400">
                    No sales data available
                </div>
            </div>
        );
    }

    const { labels, revenue, orders } = salesData;
    const maxRevenue = Math.max(...revenue, 1);
    const totalRevenue = revenue.reduce((sum, value) => sum + value, 0);
    const totalOrders = orders.reduce((sum, value) => sum + value, 0);

    return (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h3 className="font-heading font-semibold text-xl text-white">
                        Sales Overview
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">
                        Last 30 days revenue and order activity
                    </p>
                </div>
                <div className="flex gap-6 text-sm">
                    <div>
                        <p className="text-slate-400">30-day revenue</p>
                        <p className="text-white font-semibold">
                            Tk {totalRevenue.toLocaleString()}
                        </p>
                    </div>
                    <div>
                        <p className="text-slate-400">30-day orders</p>
                        <p className="text-white font-semibold">
                            {totalOrders.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-end gap-1 h-48">
                {revenue.map((value, index) => {
                    const height = Math.max((value / maxRevenue) * 100, value > 0 ? 4 : 0);
                    const showLabel = index % 5 === 0 || index === revenue.length - 1;

                    return (
                        <div
                            key={index}
                            className="flex-1 flex flex-col items-center justify-end gap-2 min-w-0 group"
                        >
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-orange-300 whitespace-nowrap">
                                Tk {value.toLocaleString()}
                            </div>
                            <div
                                className="w-full rounded-t bg-gradient-to-t from-orange-600 to-orange-400 transition-all duration-300 group-hover:from-orange-500 group-hover:to-orange-300"
                                style={{ height: `${height}%` }}
                                title={`${labels[index]}: Tk ${value} (${orders[index]} orders)`}
                            />
                            {showLabel && (
                                <span className="text-[10px] text-slate-500 truncate w-full text-center">
                                    {labels[index]}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
