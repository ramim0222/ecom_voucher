import { useState, useEffect } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Header } from "@/Components/Layout/Header";
import { DashboardLayout } from "@/Components/Dashboard/DashboardLayout";
import { GamingButton } from "@/Components/ui/GamingButton";

export default function ProfilePage({ user, status }) {
    const { props } = usePage();
    const [activeTab, setActiveTab] = useState("profile");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");

    // Profile form
    const {
        data: profileData,
        setData: setProfileData,
        patch: updateProfile,
        processing: profileProcessing,
        errors: profileErrors,
        reset: resetProfile,
    } = useForm({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        email: user?.email || "",
        phone_number: user?.phone_number || "",
        date_of_birth: user?.date_of_birth || "",
        street_address: user?.street_address || "",
        city: user?.city || "",
        state: user?.state || "",
        zip: user?.zip || "",
        country: user?.country || "Bangladesh",
    });

    // Password form
    const {
        data: passwordData,
        setData: setPasswordData,
        put: updatePassword,
        processing: passwordProcessing,
        errors: passwordErrors,
        reset: resetPassword,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    // Preferences form
    const {
        data: preferences,
        setData: setPreferences,
        put: updatePreferences,
        processing: preferencesProcessing,
        errors: preferencesErrors,
    } = useForm({
        promotional_emails: user?.promotional_emails || false,
        other_updates: user?.other_updates || false,
    });

    // Delete account form
    const { delete: deleteAccount, processing: deleteProcessing } = useForm();

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        updateProfile(route("profile.update"));
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        updatePassword(route("profile.password"), {
            onSuccess: () => resetPassword(),
        });
    };

    const handlePreferencesSubmit = (e) => {
        e.preventDefault();
        updatePreferences(route("profile.preferences"));
    };

    const handleDeleteAccount = (e) => {
        e.preventDefault();
        deleteAccount(route("profile.destroy"), {
            data: { password: deletePassword },
            onSuccess: () => {
                setShowDeleteModal(false);
                setDeletePassword("");
            },
        });
    };

    // Show success messages
    useEffect(() => {
        if (status === "profile-updated") {
            alert("Profile updated successfully!");
        } else if (status === "password-updated") {
            alert("Password changed successfully!");
        } else if (status === "preferences-updated") {
            alert("Preferences updated successfully!");
        }
    }, [status]);

    const tabs = [
        { id: "profile", label: "Profile Information" },
        { id: "password", label: "Change Password" },
        { id: "preferences", label: "Preferences" },
        { id: "delete", label: "Delete Account" },
    ];

    return (
        <div className="min-h-screen">
            <Head title="Profile Settings" />
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
                                            value={profileData.first_name}
                                            onChange={(e) =>
                                                setProfileData(
                                                    "first_name",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                        {profileErrors.first_name && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {profileErrors.first_name}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.last_name}
                                            onChange={(e) =>
                                                setProfileData(
                                                    "last_name",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                        {profileErrors.last_name && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {profileErrors.last_name}
                                            </p>
                                        )}
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
                                            setProfileData(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                        className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    {profileErrors.email && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {profileErrors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={profileData.phone_number}
                                            onChange={(e) =>
                                                setProfileData(
                                                    "phone_number",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                        {profileErrors.phone_number && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {profileErrors.phone_number}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Date of Birth
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={
                                                    profileData.date_of_birth
                                                        ? "date"
                                                        : "text"
                                                }
                                                value={
                                                    profileData.date_of_birth ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    setProfileData(
                                                        "date_of_birth",
                                                        e.target.value
                                                    )
                                                }
                                                onFocus={(e) => {
                                                    e.target.type = "date";
                                                }}
                                                onBlur={(e) => {
                                                    if (!e.target.value) {
                                                        e.target.type = "text";
                                                    }
                                                }}
                                                placeholder="Select your date of birth"
                                                className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100 text-foreground"
                                                style={{
                                                    colorScheme: "dark light",
                                                }}
                                            />
                                        </div>
                                        {profileErrors.date_of_birth && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {profileErrors.date_of_birth}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Street Address
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.street_address}
                                        onChange={(e) =>
                                            setProfileData(
                                                "street_address",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter your street address"
                                        className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    {profileErrors.street_address && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {profileErrors.street_address}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.city}
                                            onChange={(e) =>
                                                setProfileData(
                                                    "city",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter your city"
                                            className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                        {profileErrors.city && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {profileErrors.city}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            State/Province
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.state}
                                            onChange={(e) =>
                                                setProfileData(
                                                    "state",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter your state/province"
                                            className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                        {profileErrors.state && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {profileErrors.state}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            ZIP/Postal Code
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.zip}
                                            onChange={(e) =>
                                                setProfileData(
                                                    "zip",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter your ZIP/postal code"
                                            className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                        {profileErrors.zip && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {profileErrors.zip}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Country
                                    </label>
                                    <select
                                        value={profileData.country}
                                        onChange={(e) =>
                                            setProfileData(
                                                "country",
                                                e.target.value
                                            )
                                        }
                                        className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="Bangladesh">
                                            Bangladesh
                                        </option>
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
                                    {profileErrors.country && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {profileErrors.country}
                                        </p>
                                    )}
                                </div>

                                <GamingButton
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    disabled={profileProcessing}
                                >
                                    {profileProcessing
                                        ? "Saving..."
                                        : "Save Changes"}
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
                                        value={passwordData.current_password}
                                        onChange={(e) =>
                                            setPasswordData(
                                                "current_password",
                                                e.target.value
                                            )
                                        }
                                        className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Enter current password"
                                    />
                                    {passwordErrors.current_password && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {passwordErrors.current_password}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.password}
                                        onChange={(e) =>
                                            setPasswordData(
                                                "password",
                                                e.target.value
                                            )
                                        }
                                        className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Enter new password"
                                    />
                                    {passwordErrors.password && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {passwordErrors.password}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={
                                            passwordData.password_confirmation
                                        }
                                        onChange={(e) =>
                                            setPasswordData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Confirm new password"
                                    />
                                    {passwordErrors.password_confirmation && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {
                                                passwordErrors.password_confirmation
                                            }
                                        </p>
                                    )}
                                </div>

                                <GamingButton
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    disabled={passwordProcessing}
                                >
                                    {passwordProcessing
                                        ? "Changing..."
                                        : "Change Password"}
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
                                                    preferences.promotional_emails
                                                }
                                                onChange={(e) =>
                                                    setPreferences(
                                                        "promotional_emails",
                                                        e.target.checked
                                                    )
                                                }
                                                className="rounded border-border"
                                            />
                                            <div>
                                                <span className="font-medium">
                                                    Promotional Emails
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
                                                    preferences.other_updates
                                                }
                                                onChange={(e) =>
                                                    setPreferences(
                                                        "other_updates",
                                                        e.target.checked
                                                    )
                                                }
                                                className="rounded border-border"
                                            />
                                            <div>
                                                <span className="font-medium">
                                                    Other Updates
                                                </span>
                                                <p className="text-sm text-muted-foreground">
                                                    Receive updates about your
                                                    orders and account
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <GamingButton
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    disabled={preferencesProcessing}
                                >
                                    {preferencesProcessing
                                        ? "Saving..."
                                        : "Save Preferences"}
                                </GamingButton>
                            </form>
                        )}

                        {/* Delete Account Tab */}
                        {activeTab === "delete" && (
                            <div className="space-y-6">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <h3 className="font-heading font-semibold text-lg text-red-800 mb-2">
                                        Delete Account
                                    </h3>
                                    <p className="text-red-700 mb-4">
                                        Once your account is deleted, all of its
                                        resources and data will be permanently
                                        deleted. Before deleting your account,
                                        please download any data or information
                                        that you wish to retain.
                                    </p>
                                    <GamingButton
                                        type="button"
                                        variant="ghost"
                                        size="lg"
                                        className="bg-red-600 hover:bg-red-700 text-white border border-red-600 hover:border-red-700"
                                        onClick={() => setShowDeleteModal(true)}
                                    >
                                        Delete Account
                                    </GamingButton>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DashboardLayout>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-slate-800/90 backdrop-blur-xl rounded-xl border border-slate-700 w-full max-w-md">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                                    <span className="text-red-400 text-xl">
                                        ⚠️
                                    </span>
                                </div>
                                <h2 className="font-heading font-bold text-xl text-white">
                                    Delete Account
                                </h2>
                            </div>

                            <p className="text-slate-300 mb-6 leading-relaxed">
                                Once your account is deleted, all of its
                                resources and data will be permanently deleted.
                                Please enter your password to confirm you would
                                like to permanently delete your account.
                            </p>

                            <form
                                onSubmit={handleDeleteAccount}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-slate-300">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={deletePassword}
                                        onChange={(e) =>
                                            setDeletePassword(e.target.value)
                                        }
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-slate-400"
                                        placeholder="Enter your password"
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <GamingButton
                                        type="button"
                                        variant="ghost"
                                        onClick={() =>
                                            setShowDeleteModal(false)
                                        }
                                        className="flex-1 text-slate-300 border border-slate-600 hover:bg-slate-700"
                                    >
                                        Cancel
                                    </GamingButton>
                                    <GamingButton
                                        type="submit"
                                        variant="ghost"
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white border border-red-600 hover:border-red-700"
                                        disabled={deleteProcessing}
                                    >
                                        {deleteProcessing
                                            ? "Deleting..."
                                            : "Delete Account"}
                                    </GamingButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
