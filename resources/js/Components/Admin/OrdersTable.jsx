"use client";

import { useState } from "react";
import { GamingButton } from "@/Components/ui/GamingButton";

export function OrdersTable({ filter }) {
    const [orders] = useState([
        {
            id: "ORD-2024-001",
            customer: "John Doe",
            email: "john@example.com",
            total: 99.33,
            status: "delivered",
            date: "2024-01-15",
            items: 2,
        },
        {
            id: "ORD-2024-002",
            customer: "Jane Smith",
            email: "jane@example.com",
            total: 29.99,
            status: "processing",
            date: "2024-01-15",
            items: 1,
        },
        {
            id: "ORD-2024-003",
            customer: "Mike Johnson",
            email: "mike@example.com",
            total: 18.99,
            status: "pending",
            date: "2024-01-14",
            items: 1,
        },
    ]);

    const filteredOrders = orders.filter((order) => {
        if (filter === "all") return true;
        return order.status === filter;
    });

    const statusColors = {
        delivered: "text-green-400 bg-green-400/20",
        processing: "text-yellow-400 bg-yellow-400/20",
        pending: "text-blue-400 bg-blue-400/20",
        cancelled: "text-red-400 bg-red-400/20",
    };

    const handleStatusChange = (orderId, newStatus) => {
        // Handle status update
        alert(`Order ${orderId} status updated to ${newStatus}`);
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
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
                                Items
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
                            <th className="text-left py-3 text-slate-400 font-medium">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr
                                key={order.id}
                                className="border-b border-slate-700/50"
                            >
                                <td className="py-3 text-white font-medium">
                                    {order.id}
                                </td>
                                <td className="py-3">
                                    <div>
                                        <p className="text-white">
                                            {order.customer}
                                        </p>
                                        <p className="text-slate-400 text-sm">
                                            {order.email}
                                        </p>
                                    </div>
                                </td>
                                <td className="py-3 text-slate-300">
                                    {order.items}
                                </td>
                                <td className="py-3 text-white font-medium">
                                    Tk {order.total.toFixed(2)}
                                </td>
                                <td className="py-3">
                                    <select
                                        value={order.status}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                order.id,
                                                e.target.value
                                            )
                                        }
                                        className={`px-2 py-1 rounded text-xs font-medium border-0 ${
                                            statusColors[order.status]
                                        }`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">
                                            Processing
                                        </option>
                                        <option value="delivered">
                                            Delivered
                                        </option>
                                        <option value="cancelled">
                                            Cancelled
                                        </option>
                                    </select>
                                </td>
                                <td className="py-3 text-slate-400">
                                    {new Date(order.date).toLocaleDateString()}
                                </td>
                                <td className="py-3">
                                    <GamingButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            (window.location.href = `/admin/orders/${order.id}`)
                                        }
                                    >
                                        View Details
                                    </GamingButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
