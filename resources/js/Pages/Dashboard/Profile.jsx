import { useState, useEffect } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { SiteLayout } from "@/Components/Layout/SiteLayout";
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
        <SiteLayout>
            <Head title="Profile Settings" />
            <DashboardLayout>
                <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-6 xl:space-y-8 2xl:space-y-10">
                    <div>
                        <h1 className="font-heading font-bold text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-4xl mb-2 sm:mb-3 md:mb-3 lg:mb-4 xl:mb-5 2xl:mb-6">
                            Account Settings
                        </h1>
                        <p className="text-muted-foreground text-sm sm:text-sm md:text-base lg:text-base xl:text-base 2xl:text-lg">
                            Manage your account information and preferences
                        </p>
                    </div>

                    <div className="glass-card rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 2xl:p-10">
                        {/* Tab Navigation */}
                        <div className="flex flex-col sm:flex-row border-b border-border mb-4 sm:mb-5 md:mb-6 lg:mb-6 xl:mb-8 2xl:mb-10">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-2 sm:px-3 md:px-4 lg:px-4 xl:px-6 2xl:px-8 py-2 sm:py-2.5 md:py-3 lg:py-3 xl:py-4 2xl:py-5 font-medium transition-colors text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base ${
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
                                className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-6 xl:space-y-8 2xl:space-y-10"
                            >
                                {/* Name Fields */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 2xl:gap-10">
                                    <div>
                                        <label className="block text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base font-medium mb-1 sm:mb-2 md:mb-2 lg:mb-2 xl:mb-3 2xl:mb-4">
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
                                            className="w-full bg-input border border-border rounded-lg px-2 sm:px-3 md:px-4 lg:px-4 xl:px-6 2xl:px-8 py-2 sm:py-2.5 md:py-3 lg:py-3 xl:py-4 2xl:py-5 focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                                        />
                                        {profileErrors.first_name && (
                                            <p className="text-red-500 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4">
                                                {profileErrors.first_name}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base font-medium mb-1 sm:mb-2 md:mb-2 lg:mb-2 xl:mb-3 2xl:mb-4">
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
                                            className="w-full bg-input border border-border rounded-lg px-2 sm:px-3 md:px-4 lg:px-4 xl:px-6 2xl:px-8 py-2 sm:py-2.5 md:py-3 lg:py-3 xl:py-4 2xl:py-5 focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                                        />
                                        {profileErrors.last_name && (
                                            <p className="text-red-500 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4">
                                                {profileErrors.last_name}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base font-medium mb-1 sm:mb-2 md:mb-2 lg:mb-2 xl:mb-3 2xl:mb-4">
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
                                        className="w-full bg-input border border-border rounded-lg px-2 sm:px-3 md:px-4 lg:px-4 xl:px-6 2xl:px-8 py-2 sm:py-2.5 md:py-3 lg:py-3 xl:py-4 2xl:py-5 focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                                    />
                                    {profileErrors.email && (
                                        <p className="text-red-500 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4">
                                            {profileErrors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Phone and Date of Birth */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 2xl:gap-10">
                                    <div>
                                        <label className="block text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base font-medium mb-1 sm:mb-2 md:mb-2 lg:mb-2 xl:mb-3 2xl:mb-4">
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
                                            className="w-full bg-input border border-border rounded-lg px-2 sm:px-3 md:px-4 lg:px-4 xl:px-6 2xl:px-8 py-2 sm:py-2.5 md:py-3 lg:py-3 xl:py-4 2xl:py-5 focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                                        />
                                        {profileErrors.phone_number && (
                                            <p className="text-red-500 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4">
                                                {profileErrors.phone_number}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base font-medium mb-1 sm:mb-2 md:mb-2 lg:mb-2 xl:mb-3 2xl:mb-4">
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
                                                className="w-full bg-input border border-border rounded-lg px-2 sm:px-3 md:px-4 lg:px-4 xl:px-6 2xl:px-8 py-2 sm:py-2.5 md:py-3 lg:py-3 xl:py-4 2xl:py-5 focus:outline-none focus:ring-2 focus:ring-primary text-foreground pr-8 sm:pr-10 md:pr-12 lg:pr-12 xl:pr-16 2xl:pr-20 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
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
                                                className="absolute right-2 sm:right-3 md:right-3 lg:right-3 xl:right-4 2xl:right-6 top-1/2 transform -translate-y-1/2 text-foreground hover:text-primary transition-colors"
                                            >
                                                <svg
                                                    className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7"
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
                                            <p className="text-red-500 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4">
                                                {profileErrors.date_of_birth}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Street Address */}
                                <div>
                                    <label className="block text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base font-medium mb-1 sm:mb-2 md:mb-2 lg:mb-2 xl:mb-3 2xl:mb-4">
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
                                        className="w-full bg-input border border-border rounded-lg px-2 sm:px-3 md:px-4 lg:px-4 xl:px-6 2xl:px-8 py-2 sm:py-2.5 md:py-3 lg:py-3 xl:py-4 2xl:py-5 focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                                    />
                                    {profileErrors.street_address && (
                                        <p className="text-red-500 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4">
                                            {profileErrors.street_address}
                                        </p>
                                    )}
                                </div>

                                {/* City, State, ZIP */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 2xl:gap-10">
                                    <div>
                                        <label className="block text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base font-medium mb-1 sm:mb-2 md:mb-2 lg:mb-2 xl:mb-3 2xl:mb-4">
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
                                            className="w-full bg-input border border-border rounded-lg px-2 sm:px-3 md:px-4 lg:px-4 xl:px-6 2xl:px-8 py-2 sm:py-2.5 md:py-3 lg:py-3 xl:py-4 2xl:py-5 focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                                        />
                                        {profileErrors.city && (
                                            <p className="text-red-500 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4">
                                                {profileErrors.city}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base font-medium mb-1 sm:mb-2 md:mb-2 lg:mb-2 xl:mb-3 2xl:mb-4">
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
                                            className="w-full bg-input border border-border rounded-lg px-2 sm:px-3 md:px-4 lg:px-4 xl:px-6 2xl:px-8 py-2 sm:py-2.5 md:py-3 lg:py-3 xl:py-4 2xl:py-5 focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                                        />
                                        {profileErrors.state && (
                                            <p className="text-red-500 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4">
                                                {profileErrors.state}
                                            </p>
                                        )}
                                    </div>
                                    <div className="sm:col-span-2 lg:col-span-1">
                                        <label className="block text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base font-medium mb-1 sm:mb-2 md:mb-2 lg:mb-2 xl:mb-3 2xl:mb-4">
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
                                            className="w-full bg-input border border-border rounded-lg px-2 sm:px-3 md:px-4 lg:px-4 xl:px-6 2xl:px-8 py-2 sm:py-2.5 md:py-3 lg:py-3 xl:py-4 2xl:py-5 focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                                        />
                                        {profileErrors.zip && (
                                            <p className="text-red-500 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4">
                                                {profileErrors.zip}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Country */}
                                <div>
                                    <label className="block text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base font-medium mb-1 sm:mb-2 md:mb-2 lg:mb-2 xl:mb-3 2xl:mb-4">
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
                                        className="w-full bg-input border border-border rounded-lg px-2 sm:px-3 md:px-4 lg:px-4 xl:px-6 2xl:px-8 py-2 sm:py-2.5 md:py-3 lg:py-3 xl:py-4 2xl:py-5 focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
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
                                        <p className="text-red-500 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4">
                                            {profileErrors.country}
                                        </p>
                                    )}
                                </div>

                                <GamingButton
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    disabled={profileProcessing}
                                    className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base px-3 sm:px-4 md:px-4 lg:px-6 xl:px-8 2xl:px-10 py-2 sm:py-2.5 md:py-3 lg:py-3 xl:py-4 2xl:py-5"
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
                                className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-6 xl:space-y-8 2xl:space-y-10"
                            >
                                <div>
                                    <label className="block text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base font-medium mb-1 sm:mb-2 md:mb-2 lg:mb-2 xl:mb-3 2xl:mb-4">
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
                                        className="w-full bg-input border border-border rounded-lg px-2 sm:px-3 md:px-4 lg:px-4 xl:px-6 2xl:px-8 py-2 sm:py-2.5 md:py-3 lg:py-3 xl:py-4 2xl:py-5 focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                                        placeholder="Enter current password"
                                    />
                                    {passwordErrors.current_password && (
                                        <p className="text-red-500 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4">
                                            {passwordErrors.current_password}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base font-medium mb-1 sm:mb-2 md:mb-2 lg:mb-2 xl:mb-3 2xl:mb-4">
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
                                        className="w-full bg-input border border-border rounded-lg px-2 sm:px-3 md:px-4 lg:px-4 xl:px-6 2xl:px-8 py-2 sm:py-2.5 md:py-3 lg:py-3 xl:py-4 2xl:py-5 focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                                        placeholder="Enter new password"
                                    />
                                    {passwordErrors.password && (
                                        <p className="text-red-500 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4">
                                            {passwordErrors.password}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base font-medium mb-1 sm:mb-2 md:mb-2 lg:mb-2 xl:mb-3 2xl:mb-4">
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
                                        className="w-full bg-input border border-border rounded-lg px-2 sm:px-3 md:px-4 lg:px-4 xl:px-6 2xl:px-8 py-2 sm:py-2.5 md:py-3 lg:py-3 xl:py-4 2xl:py-5 focus:outline-none focus:ring-2 focus:ring-primary text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                                        placeholder="Confirm new password"
                                    />
                                    {passwordErrors.password_confirmation && (
                                        <p className="text-red-500 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4">
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
                                    className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base px-3 sm:px-4 md:px-4 lg:px-6 xl:px-8 2xl:px-10 py-2 sm:py-2.5 md:py-3 lg:py-3 xl:py-4 2xl:py-5"
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
                                className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-6 xl:space-y-8 2xl:space-y-10"
                            >
                                <div>
                                    <h3 className="font-heading font-semibold text-base sm:text-lg md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl mb-3 sm:mb-4 md:mb-4 lg:mb-6 xl:mb-8 2xl:mb-10">
                                        Notification Preferences
                                    </h3>
                                    <div className="space-y-3 sm:space-y-4 md:space-y-4 lg:space-y-6 xl:space-y-8 2xl:space-y-10">
                                        <label className="flex items-start sm:items-center gap-2 sm:gap-3 cursor-pointer">
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
                                                className="mt-1 sm:mt-0 rounded border-border w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6"
                                            />
                                            <div>
                                                <span className="font-medium text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base">
                                                    Promotional Emails
                                                </span>
                                                <p className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base text-muted-foreground">
                                                    Receive promotional offers
                                                    and deals
                                                </p>
                                            </div>
                                        </label>

                                        <label className="flex items-start sm:items-center gap-2 sm:gap-3 cursor-pointer">
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
                                                className="mt-1 sm:mt-0 rounded border-border w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6"
                                            />
                                            <div>
                                                <span className="font-medium text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base">
                                                    Other Updates
                                                </span>
                                                <p className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base text-muted-foreground">
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
                                    className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base px-3 sm:px-4 md:px-4 lg:px-6 xl:px-8 2xl:px-10 py-2 sm:py-2.5 md:py-3 lg:py-3 xl:py-4 2xl:py-5"
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
        </SiteLayout>
    );
}
