"use client";

import { useState } from "react";
import { Header } from "@/Components/Layout/Header";
import { DashboardLayout } from "@/Components/Dashboard/DashboardLayout";
import { GamingButton } from "@/Components/ui/GamingButton";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [profileData, setProfileData] = useState({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        dateOfBirth: "1990-01-01",
        country: "United States",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: true,
        orderUpdates: true,
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        // Handle profile update
        alert("Profile updated successfully!");
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        // Handle password change
        alert("Password changed successfully!");
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    };

    const handlePreferencesSubmit = (e) => {
        e.preventDefault();
        // Handle preferences update
        alert("Preferences updated successfully!");
    };

    const tabs = [
        { id: "profile", label: "Profile Information" },
        { id: "password", label: "Change Password" },
        { id: "preferences", label: "Preferences" },
    ];

    return (
        <div className="min-h-screen">
            <Header />
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2">
                            Account Settings
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your account information and preferences
                        </p>
                    </div>

                    <div className="glass-card rounded-xl p-6">
                        {/* Tab Navigation */}
                        <div className="flex border-b border-border mb-6">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 font-medium transition-colors ${
                                        activeTab === tab.id
                                            ? "border-b-2 border-accent text-accent"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Profile Information Tab */}
                        {activeTab === "profile" && (
                            <form
                                onSubmit={handleProfileSubmit}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.firstName}
                                            onChange={(e) =>
                                                setProfileData({
                                                    ...profileData,
                                                    firstName: e.target.value,
                                                })
                                            }
                                            className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.lastName}
                                            onChange={(e) =>
                                                setProfileData({
                                                    ...profileData,
                                                    lastName: e.target.value,
                                                })
                                            }
                                            className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) =>
                                            setProfileData({
                                                ...profileData,
                                                email: e.target.value,
                                            })
                                        }
                                        className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) =>
                                                setProfileData({
                                                    ...profileData,
                                                    phone: e.target.value,
                                                })
                                            }
                                            className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            value={profileData.dateOfBirth}
                                            onChange={(e) =>
                                                setProfileData({
                                                    ...profileData,
                                                    dateOfBirth: e.target.value,
                                                })
                                            }
                                            className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Country
                                    </label>
                                    <select
                                        value={profileData.country}
                                        onChange={(e) =>
                                            setProfileData({
                                                ...profileData,
                                                country: e.target.value,
                                            })
                                        }
                                        className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="United States">
                                            United States
                                        </option>
                                        <option value="Canada">Canada</option>
                                        <option value="United Kingdom">
                                            United Kingdom
                                        </option>
                                        <option value="Australia">
                                            Australia
                                        </option>
                                    </select>
                                </div>

                                <GamingButton
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                >
                                    Save Changes
                                </GamingButton>
                            </form>
                        )}

                        {/* Change Password Tab */}
                        {activeTab === "password" && (
                            <form
                                onSubmit={handlePasswordSubmit}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                currentPassword: e.target.value,
                                            })
                                        }
                                        className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Enter current password"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                newPassword: e.target.value,
                                            })
                                        }
                                        className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Enter new password"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                confirmPassword: e.target.value,
                                            })
                                        }
                                        className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Confirm new password"
                                    />
                                </div>

                                <GamingButton
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                >
                                    Change Password
                                </GamingButton>
                            </form>
                        )}

                        {/* Preferences Tab */}
                        {activeTab === "preferences" && (
                            <form
                                onSubmit={handlePreferencesSubmit}
                                className="space-y-6"
                            >
                                <div>
                                    <h3 className="font-heading font-semibold text-lg mb-4">
                                        Notification Preferences
                                    </h3>
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    preferences.emailNotifications
                                                }
                                                onChange={(e) =>
                                                    setPreferences({
                                                        ...preferences,
                                                        emailNotifications:
                                                            e.target.checked,
                                                    })
                                                }
                                                className="rounded border-border"
                                            />
                                            <div>
                                                <span className="font-medium">
                                                    Email Notifications
                                                </span>
                                                <p className="text-sm text-muted-foreground">
                                                    Receive general
                                                    notifications via email
                                                </p>
                                            </div>
                                        </label>

                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    preferences.smsNotifications
                                                }
                                                onChange={(e) =>
                                                    setPreferences({
                                                        ...preferences,
                                                        smsNotifications:
                                                            e.target.checked,
                                                    })
                                                }
                                                className="rounded border-border"
                                            />
                                            <div>
                                                <span className="font-medium">
                                                    SMS Notifications
                                                </span>
                                                <p className="text-sm text-muted-foreground">
                                                    Receive important updates
                                                    via SMS
                                                </p>
                                            </div>
                                        </label>

                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    preferences.marketingEmails
                                                }
                                                onChange={(e) =>
                                                    setPreferences({
                                                        ...preferences,
                                                        marketingEmails:
                                                            e.target.checked,
                                                    })
                                                }
                                                className="rounded border-border"
                                            />
                                            <div>
                                                <span className="font-medium">
                                                    Marketing Emails
                                                </span>
                                                <p className="text-sm text-muted-foreground">
                                                    Receive promotional offers
                                                    and deals
                                                </p>
                                            </div>
                                        </label>

                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    preferences.orderUpdates
                                                }
                                                onChange={(e) =>
                                                    setPreferences({
                                                        ...preferences,
                                                        orderUpdates:
                                                            e.target.checked,
                                                    })
                                                }
                                                className="rounded border-border"
                                            />
                                            <div>
                                                <span className="font-medium">
                                                    Order Updates
                                                </span>
                                                <p className="text-sm text-muted-foreground">
                                                    Receive updates about your
                                                    orders
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <GamingButton
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                >
                                    Save Preferences
                                </GamingButton>
                            </form>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        </div>
    );
}
