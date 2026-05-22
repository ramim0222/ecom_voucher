export function OrderStatusOverview({ orderStatusBreakdown = [] }) {
    const statusColors = {
        pending: "bg-blue-500",
        processing: "bg-yellow-500",
        completed: "bg-green-500",
        cancelled: "bg-red-500",
        refunded: "bg-purple-500",
    };

    const total = orderStatusBreakdown.reduce(
        (sum, item) => sum + item.count,
        0
    );

    if (!total) {
        return (
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
                <h3 className="font-heading font-semibold text-xl text-white mb-6">
                    Order Status
                </h3>
                <div className="text-center py-12 text-slate-400">
                    No orders yet
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
            <h3 className="font-heading font-semibold text-xl text-white mb-2">
                Order Status
            </h3>
            <p className="text-slate-400 text-sm mb-6">
                {total.toLocaleString()} total orders
            </p>

            <div className="flex h-3 rounded-full overflow-hidden mb-6">
                {orderStatusBreakdown.map(
                    (item) =>
                        item.count > 0 && (
                            <div
                                key={item.status}
                                className={`${
                                    statusColors[item.status] || "bg-slate-500"
                                }`}
                                style={{
                                    width: `${(item.count / total) * 100}%`,
                                }}
                                title={`${item.status}: ${item.count}`}
                            />
                        )
                )}
            </div>

            <div className="space-y-3">
                {orderStatusBreakdown.map((item) => {
                    const percentage = total
                        ? Math.round((item.count / total) * 100)
                        : 0;

                    return (
                        <div
                            key={item.status}
                            className="flex items-center justify-between gap-3"
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <span
                                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                        statusColors[item.status] ||
                                        "bg-slate-500"
                                    }`}
                                />
                                <span className="text-slate-300 capitalize truncate">
                                    {item.status}
                                </span>
                            </div>
                            <div className="text-right shrink-0">
                                <span className="text-white font-medium">
                                    {item.count}
                                </span>
                                <span className="text-slate-500 text-sm ml-2">
                                    {percentage}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
