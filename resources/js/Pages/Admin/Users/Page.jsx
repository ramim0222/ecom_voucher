"use client";

import { useState } from "react";
import { AdminLayout } from "@/Components/Admin/AdminLayout";
import { GamingButton } from "@/Components/ui/GamingButton";
import { UserAccountInfo } from "@/Components/Admin/UserAccountInfo";
import { UserOrderHistory } from "@/Components/Admin/UserOrderHistory";
import { AdminActionModal } from "@/Components/Admin/AdminActionModal";

export default function AdminUserProfilePage({ params }) {
    const userId = params?.id || "1";

    // Mock user data - in real app, this would be fetched based on userId
    const [user] = useState({
        id: Number.parseInt(userId),
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        avatar: "/diverse-user-avatars.png",
        phone: "+1 (555) 123-4567",
        registrationDate: "2023-06-15T10:30:00Z",
        lastLogin: "2024-01-20T14:22:00Z",
        totalOrders: 12,
        totalSpent: 1456.78,
        accountStatus: "active",
        emailVerified: true,
        address: {
            street: "123 Gaming Street",
            city: "San Francisco",
            state: "CA",
            zipCode: "94102",
            country: "United States",
        },
        preferences: {
            newsletter: true,
            promotions: false,
            orderUpdates: true,
        },
    });

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
            sendEmail: {
                title: "Send Email",
                message: `Send a custom email to ${user.firstName} ${user.lastName} (${user.email})`,
            },
            resetPassword: {
                title: "Reset Password",
                message: `Send a password reset link to ${user.firstName} ${user.lastName}? They will receive an email with instructions to create a new password.`,
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
                        onClick={() => (window.location.href = "/admin/users")}
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
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar || "/placeholder.svg"}
                                        alt={`${user.firstName} ${user.lastName}`}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-white font-bold text-xl">
                                        {user.firstName[0]}
                                        {user.lastName[0]}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h2 className="font-heading font-bold text-xl text-white">
                                    {user.firstName} {user.lastName}
                                </h2>
                                <p className="text-slate-400">{user.email}</p>
                                <div className="flex items-center gap-4 mt-2">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            user.accountStatus === "active"
                                                ? "text-green-400 bg-green-400/20"
                                                : "text-red-400 bg-red-400/20"
                                        }`}
                                    >
                                        {user.accountStatus}
                                    </span>
                                    {user.emailVerified && (
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
                                    {user.totalOrders}
                                </div>
                                <div className="text-slate-400 text-sm">
                                    Total Orders
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">
                                    ${user.totalSpent.toFixed(2)}
                                </div>
                                <div className="text-slate-400 text-sm">
                                    Total Spent
                                </div>
                            </div>
                            <div className="text-center col-span-2 lg:col-span-1">
                                <div className="text-sm text-white">
                                    {new Date(
                                        user.registrationDate
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
                            onClick={() => handleAdminAction("sendEmail")}
                            className="text-blue-400 hover:text-blue-300"
                        >
                            📧 Send Email
                        </GamingButton>
                        <GamingButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAdminAction("resetPassword")}
                            className="text-yellow-400 hover:text-yellow-300"
                        >
                            🔑 Reset Password
                        </GamingButton>
                        <GamingButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAdminAction("deactivate")}
                            className="text-red-400 hover:text-red-300"
                        >
                            🚫 Deactivate Account
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
