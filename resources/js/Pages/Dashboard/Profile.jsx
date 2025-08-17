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
                                                type="date"
                                                value={
                                                    profileData.date_of_birth
                                                        ? (() => {
                                                              // Handle different date formats
                                                              const dateStr =
                                                                  profileData.date_of_birth;
                                                              if (
                                                                  dateStr.includes(
                                                                      "T"
                                                                  )
                                                              ) {
                                                                  // ISO datetime format
                                                                  return dateStr.split(
                                                                      "T"
                                                                  )[0];
                                                              } else if (
                                                                  dateStr.match(
                                                                      /^\d{4}-\d{2}-\d{2}$/
                                                                  )
                                                              ) {
                                                                  // Already in YYYY-MM-DD format
                                                                  return dateStr;
                                                              } else {
                                                                  // Try to parse and format
                                                                  const date =
                                                                      new Date(
                                                                          dateStr
                                                                      );
                                                                  if (
                                                                      !isNaN(
                                                                          date.getTime()
                                                                      )
                                                                  ) {
                                                                      return date
                                                                          .toISOString()
                                                                          .split(
                                                                              "T"
                                                                          )[0];
                                                                  }
                                                                  return "";
                                                              }
                                                          })()
                                                        : ""
                                                }
                                                onChange={(e) => {
                                                    setProfileData(
                                                        "date_of_birth",
                                                        e.target.value
                                                    );
                                                }}
                                                className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-foreground pr-12"
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const input = e.target
                                                        .closest(".relative")
                                                        .querySelector(
                                                            "input[type='date']"
                                                        );
                                                    if (input) {
                                                        input.focus();
                                                        if (input.showPicker) {
                                                            input.showPicker();
                                                        }
                                                    }
                                                }}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground hover:text-primary transition-colors"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </button>
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
                    </div>
                </div>
            </DashboardLayout>
        </div>
    );
}
