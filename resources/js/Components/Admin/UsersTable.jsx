"use client";

import { useState } from "react";
import { GamingButton } from "@/Components/ui/GamingButton";

export function UsersTable() {
    const [users] = useState([
        {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            orders: 12,
            totalSpent: 456.78,
            status: "active",
            joinDate: "2023-06-15",
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            orders: 8,
            totalSpent: 234.56,
            status: "active",
            joinDate: "2023-08-22",
        },
        {
            id: 3,
            name: "Mike Johnson",
            email: "mike@example.com",
            orders: 3,
            totalSpent: 89.97,
            status: "banned",
            joinDate: "2023-12-01",
        },
    ]);

    const handleStatusChange = (userId, newStatus) => {
        // Handle status update
        alert(`User ${userId} status updated to ${newStatus}`);
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-700">
                            <th className="text-left py-3 text-slate-400 font-medium">
                                User
                            </th>
                            <th className="text-left py-3 text-slate-400 font-medium">
                                Orders
                            </th>
                            <th className="text-left py-3 text-slate-400 font-medium">
                                Total Spent
                            </th>
                            <th className="text-left py-3 text-slate-400 font-medium">
                                Status
                            </th>
                            <th className="text-left py-3 text-slate-400 font-medium">
                                Join Date
                            </th>
                            <th className="text-left py-3 text-slate-400 font-medium">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b border-slate-700/50"
                            >
                                <td className="py-3">
                                    <div>
                                        <p className="text-white font-medium">
                                            {user.name}
                                        </p>
                                        <p className="text-slate-400 text-sm">
                                            {user.email}
                                        </p>
                                    </div>
                                </td>
                                <td className="py-3 text-slate-300">
                                    {user.orders}
                                </td>
                                <td className="py-3 text-white font-medium">
                                    ${user.totalSpent.toFixed(2)}
                                </td>
                                <td className="py-3">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            user.status === "active"
                                                ? "text-green-400 bg-green-400/20"
                                                : "text-red-400 bg-red-400/20"
                                        }`}
                                    >
                                        {user.status}
                                    </span>
                                </td>
                                <td className="py-3 text-slate-400">
                                    {new Date(
                                        user.joinDate
                                    ).toLocaleDateString()}
                                </td>
                                <td className="py-3">
                                    <div className="flex gap-2">
                                        <GamingButton variant="ghost" size="sm">
                                            View Profile
                                        </GamingButton>
                                        <GamingButton
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                handleStatusChange(
                                                    user.id,
                                                    user.status === "active"
                                                        ? "banned"
                                                        : "active"
                                                )
                                            }
                                        >
                                            {user.status === "active"
                                                ? "Ban"
                                                : "Unban"}
                                        </GamingButton>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
