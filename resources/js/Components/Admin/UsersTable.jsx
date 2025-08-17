"use client";

import { useState } from "react";
import { GamingButton } from "@/Components/ui/GamingButton";
import { router } from "@inertiajs/react";

export function UsersTable({ users }) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionType, setActionType] = useState("");

    const handleStatusChange = (userId, newStatus) => {
        const user = users.find((u) => u.id === userId);
        setSelectedUser(user);
        setActionType(newStatus);
        setShowConfirmModal(true);
    };

    const confirmStatusChange = () => {
        if (selectedUser && actionType) {
            router.patch(
                `/admin/users/${selectedUser.id}/status`,
                {
                    status: actionType,
                },
                {
                    onSuccess: () => {
                        setShowConfirmModal(false);
                        setSelectedUser(null);
                        setActionType("");
                    },
                    onError: (errors) => {
                        console.error("Error updating user status:", errors);
                    },
                }
            );
        }
    };

    const closeModal = () => {
        setShowConfirmModal(false);
        setSelectedUser(null);
        setActionType("");
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
                                            {user.first_name} {user.last_name}
                                        </p>
                                        <p className="text-slate-400 text-sm">
                                            {user.email}
                                        </p>
                                    </div>
                                </td>
                                <td className="py-3 text-slate-300">
                                    User order count
                                </td>
                                <td className="py-3 text-white font-medium">
                                    User total spent
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
                                        user.created_at
                                    ).toLocaleDateString()}
                                </td>
                                <td className="py-3">
                                    <div className="flex gap-2">
                                        <GamingButton
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                (window.location.href = `/admin/users/${user.id}`)
                                            }
                                        >
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

            {/* Ban/Unban Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800/90 backdrop-blur-xl rounded-xl border border-slate-700 w-full max-w-md">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className={`w-10 h-10 ${
                                        actionType === "banned"
                                            ? "bg-red-500/20"
                                            : "bg-green-500/20"
                                    } rounded-full flex items-center justify-center`}
                                >
                                    <span
                                        className={`${
                                            actionType === "banned"
                                                ? "text-red-400"
                                                : "text-green-400"
                                        } text-xl`}
                                    >
                                        {actionType === "banned" ? "⚠️" : "✅"}
                                    </span>
                                </div>
                                <h2 className="font-heading font-bold text-xl text-white">
                                    {actionType === "banned" ? "Ban" : "Unban"}{" "}
                                    User
                                </h2>
                            </div>

                            <p className="text-slate-300 mb-6 leading-relaxed">
                                {selectedUser
                                    ? `Are you sure you want to ${
                                          actionType === "banned"
                                              ? "ban"
                                              : "unban"
                                      } ${selectedUser.first_name} ${
                                          selectedUser.last_name
                                      }? ${
                                          actionType === "banned"
                                              ? "They will no longer be able to access their account."
                                              : "They will regain access to their account."
                                      }`
                                    : ""}
                            </p>

                            <div className="flex gap-3">
                                <GamingButton
                                    type="button"
                                    variant="ghost"
                                    onClick={closeModal}
                                    className="flex-1 text-slate-300"
                                >
                                    Cancel
                                </GamingButton>
                                <GamingButton
                                    type="button"
                                    onClick={confirmStatusChange}
                                    className={`flex-1 ${
                                        actionType === "banned"
                                            ? "bg-red-600 hover:bg-red-700"
                                            : "bg-green-600 hover:bg-green-700"
                                    } text-white`}
                                >
                                    {actionType === "banned"
                                        ? "Ban User"
                                        : "Unban User"}
                                </GamingButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
