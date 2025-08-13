export function RecentOrders() {
    const orders = [
        {
            id: "ORD-2024-001",
            customer: "John Doe",
            total: "$99.33",
            status: "delivered",
            date: "2024-01-15",
        },
        {
            id: "ORD-2024-002",
            customer: "Jane Smith",
            total: "$29.99",
            status: "processing",
            date: "2024-01-15",
        },
        {
            id: "ORD-2024-003",
            customer: "Mike Johnson",
            total: "$18.99",
            status: "pending",
            date: "2024-01-14",
        },
        {
            id: "ORD-2024-004",
            customer: "Sarah Wilson",
            total: "$45.99",
            status: "delivered",
            date: "2024-01-14",
        },
    ];

    const statusColors = {
        delivered: "text-green-400 bg-green-400/20",
        processing: "text-yellow-400 bg-yellow-400/20",
        pending: "text-blue-400 bg-blue-400/20",
        cancelled: "text-red-400 bg-red-400/20",
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
                        {orders.map((order) => (
                            <tr
                                key={order.id}
                                className="border-b border-slate-700/50"
                            >
                                <td className="py-3 text-white font-medium">
                                    {order.id}
                                </td>
                                <td className="py-3 text-slate-300">
                                    {order.customer}
                                </td>
                                <td className="py-3 text-white font-medium">
                                    {order.total}
                                </td>
                                <td className="py-3">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            statusColors[order.status]
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                                <td className="py-3 text-slate-400">
                                    {new Date(order.date).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
