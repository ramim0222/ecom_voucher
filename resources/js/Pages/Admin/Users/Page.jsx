"use client";

import { useState } from "react";
import { router } from "@inertiajs/react";
import { AdminLayout } from "@/Components/Admin/AdminLayout";
import { GamingButton } from "@/Components/ui/GamingButton";
import { UserAccountInfo } from "@/Components/Admin/UserAccountInfo";
import { UserOrderHistory } from "@/Components/Admin/UserOrderHistory";
import { AdminActionModal } from "@/Components/Admin/AdminActionModal";

export default function AdminUserProfilePage({ user }) {
    const [activeTab, setActiveTab] = useState("account");
    const [actionModal, setActionModal] = useState({
        isOpen: false,
        type: "",
        title: "",
        message: "",
    });

    const handleAdminAction = (actionType) => {
        const actions = {
            deactivate: {
                title: "Deactivate Account",
                message: `Are you sure you want to deactivate ${user.firstName} ${user.lastName}'s account? They will no longer be able to access their account or make purchases.`,
            },
        };

        setActionModal({
            isOpen: true,
            type: actionType,
            ...actions[actionType],
        });
    };

    const handleConfirmAction = async (actionType, data) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        switch (actionType) {
            case "deactivate":
                alert("Account deactivated successfully");
                break;
            case "sendEmail":
                alert(`Email sent to ${user.email}`);
                break;
            case "resetPassword":
                alert("Password reset link sent");
                break;
        }

        setActionModal({ isOpen: false, type: "", title: "", message: "" });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <GamingButton
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                            router.visit(route("admin.users.index"))
                        }
                        className="text-slate-300"
                    >
                        ← Back to Users
                    </GamingButton>
                    <div>
                        <h1 className="font-heading font-bold text-2xl text-white">
                            User Profile
                        </h1>
                        <p className="text-slate-400">
                            Manage user account and view activity
                        </p>
                    </div>
                </div>

                {/* User Overview Card */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div>
                                <h2 className="font-heading font-bold text-xl text-white">
                                    {user.first_name} {user.last_name}
                                </h2>
                                <p className="text-slate-400">{user.email}</p>
                                <div className="flex items-center gap-4 mt-2">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            user.status === "active"
                                                ? "text-green-400 bg-green-400/20"
                                                : "text-red-400 bg-red-400/20"
                                        }`}
                                    >
                                        {user.status}
                                    </span>
                                    {user.email_verified_at && (
                                        <span className="text-blue-400 text-xs flex items-center gap-1">
                                            ✓ Email Verified
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">
                                    User Order Count
                                </div>
                                <div className="text-slate-400 text-sm">
                                    Total Orders
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">
                                    User Total Spent
                                </div>
                                <div className="text-slate-400 text-sm">
                                    Total Spent
                                </div>
                            </div>
                            <div className="text-center col-span-2 lg:col-span-1">
                                <div className="text-sm text-white">
                                    {new Date(
                                        user.created_at
                                    ).toLocaleDateString()}
                                </div>
                                <div className="text-slate-400 text-sm">
                                    Member Since
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-700">
                        <GamingButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAdminAction("deactivate")}
                            className="text-red-400 hover:text-red-300"
                        >
                            🚫 Ban Account
                        </GamingButton>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700">
                    <div className="border-b border-slate-700">
                        <nav className="flex">
                            <button
                                onClick={() => setActiveTab("account")}
                                className={`px-6 py-4 font-medium transition-colors ${
                                    activeTab === "account"
                                        ? "text-orange-400 border-b-2 border-orange-400"
                                        : "text-slate-400 hover:text-white"
                                }`}
                            >
                                Account Info
                            </button>
                            <button
                                onClick={() => setActiveTab("orders")}
                                className={`px-6 py-4 font-medium transition-colors ${
                                    activeTab === "orders"
                                        ? "text-orange-400 border-b-2 border-orange-400"
                                        : "text-slate-400 hover:text-white"
                                }`}
                            >
                                Order History
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === "account" && (
                            <UserAccountInfo user={user} />
                        )}
                        {activeTab === "orders" && (
                            <UserOrderHistory userId={user.id} />
                        )}
                    </div>
                </div>
            </div>

            {/* Admin Action Modal */}
            <AdminActionModal
                isOpen={actionModal.isOpen}
                onClose={() =>
                    setActionModal({
                        isOpen: false,
                        type: "",
                        title: "",
                        message: "",
                    })
                }
                onConfirm={handleConfirmAction}
                type={actionModal.type}
                title={actionModal.title}
                message={actionModal.message}
                user={user}
            />
        </AdminLayout>
    );
}
