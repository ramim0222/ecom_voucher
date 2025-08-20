export function RecentOrders({ recentOrders }) {
    if (!recentOrders || recentOrders.length === 0) {
        return (
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
                <h3 className="font-heading font-semibold text-xl text-white mb-6">
                    Recent Orders
                </h3>
                <div className="text-center py-8 text-slate-400">
                    <p>No recent orders found</p>
                </div>
            </div>
        );
    }

    const statusColors = {
        completed: "text-green-400 bg-green-400/20",
        processing: "text-yellow-400 bg-yellow-400/20",
        pending: "text-blue-400 bg-blue-400/20",
        cancelled: "text-red-400 bg-red-400/20",
        refunded: "text-purple-400 bg-purple-400/20",
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-semibold text-xl text-white">
                    Recent Orders
                </h3>
                <a
                    href="/admin/orders"
                    className="text-orange-400 hover:text-orange-300 text-sm"
                >
                    View All
                </a>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-700">
                            <th className="text-left py-3 text-slate-400 font-medium">
                                Order ID
                            </th>
                            <th className="text-left py-3 text-slate-400 font-medium">
                                Customer
                            </th>
                            <th className="text-left py-3 text-slate-400 font-medium">
                                Total
                            </th>
                            <th className="text-left py-3 text-slate-400 font-medium">
                                Status
                            </th>
                            <th className="text-left py-3 text-slate-400 font-medium">
                                Date
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders.map((order) => (
                            <tr
                                key={order.id}
                                className="border-b border-slate-700/50"
                            >
                                <td className="py-3 text-white font-medium">
                                    {order.order_number}
                                </td>
                                <td className="py-3 text-slate-300">
                                    <div>
                                        <div>{order.customer_name}</div>
                                        <div className="text-xs text-slate-500">
                                            {order.customer_email}
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 text-white font-medium">
                                    ${order.total_amount}
                                </td>
                                <td className="py-3">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            statusColors[order.status] ||
                                            "text-slate-400 bg-slate-400/20"
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                                <td className="py-3 text-slate-400">
                                    {order.created_at}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
