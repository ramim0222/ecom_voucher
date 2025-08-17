"use client";

export function UserAccountInfo({ user }) {
    return (
        <div className="space-y-6">
            {/* Personal Information */}
            <div>
                <h3 className="font-heading font-semibold text-lg text-white mb-4">
                    Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                            First Name
                        </label>
                        <div className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white">
                            {user.first_name}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                            Last Name
                        </label>
                        <div className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white">
                            {user.last_name}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                            Email Address
                        </label>
                        <div className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white flex items-center justify-between">
                            {user.email}
                            {user.email_verified_at ? (
                                <span className="text-green-400 text-sm">
                                    ✓ Verified
                                </span>
                            ) : (
                                <span className="text-red-400 text-sm">
                                    ✗ Unverified
                                </span>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                            Phone Number
                        </label>
                        <div className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white">
                            {user.phone_number || "Not provided"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Address Information */}
            <div>
                <h3 className="font-heading font-semibold text-lg text-white mb-4">
                    Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                            Street Address
                        </label>
                        <div className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white">
                            {user.street_address || "Not provided"}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                            City
                        </label>
                        <div className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white">
                            {user.city || "Not provided"}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                            State
                        </label>
                        <div className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white">
                            {user.state || "Not provided"}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                            ZIP Code
                        </label>
                        <div className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white">
                            {user.zip || "Not provided"}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                            Country
                        </label>
                        <div className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white">
                            {user.country || "Not provided"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Details */}
            <div>
                <h3 className="font-heading font-semibold text-lg text-white mb-4">
                    Account Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                            Registration Date
                        </label>
                        <div className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white">
                            {new Date(user.created_at).toLocaleString()}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                            Account Status
                        </label>
                        <div className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3">
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    user.status === "active"
                                        ? "text-green-400 bg-green-400/20"
                                        : "text-red-400 bg-red-400/20"
                                }`}
                            >
                                {user.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preferences */}
            <div>
                <h3 className="font-heading font-semibold text-lg text-white mb-4">
                    Email Preferences
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3">
                        <span className="text-white">Promotional Emails</span>
                        <span
                            className={`text-sm ${
                                user.promotional_emails
                                    ? "text-green-400"
                                    : "text-red-400"
                            }`}
                        >
                            {user.promotional_emails ? "Enabled" : "Disabled"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3">
                        <span className="text-white">Other Updates</span>
                        <span
                            className={`text-sm ${
                                user.other_updates
                                    ? "text-green-400"
                                    : "text-red-400"
                            }`}
                        >
                            {user.other_updates ? "Enabled" : "Disabled"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
