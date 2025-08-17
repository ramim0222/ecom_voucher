import { Head, useForm, usePage } from "@inertiajs/react";
import { AdminLayout } from "@/Components/Admin/AdminLayout";
import { GamingButton } from "@/Components/ui/GamingButton";
import { useState } from "react";
import { Transition } from "@headlessui/react";

export default function AdminProfile() {
    const user = usePage().props.auth.user;
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            email: user.email,
            phone_number: user.phone_number || "",
            street_address: user.street_address || "",
            city: user.city || "",
            state: user.state || "",
            zip: user.zip || "",
            country: user.country || "Bangladesh",
            date_of_birth: user.date_of_birth
                ? user.date_of_birth.split("T")[0]
                : "",
            promotional_emails: user.promotional_emails || false,
            other_updates: user.other_updates || false,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route("admin.profile.update"), {
            onSuccess: () => setIsEditing(false),
        });
    };

    return (
        <AdminLayout>
            <Head title="Admin Profile" />
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        👤 Admin Profile
                    </h1>
                    <p className="text-slate-300">
                        Manage your personal information
                    </p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">
                                    {user.first_name?.[0]?.toUpperCase() || "A"}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {user.first_name} {user.last_name}
                                </h2>
                                <p className="text-slate-400">{user.email}</p>
                                <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full mt-2">
                                    {user.role}
                                </span>
                            </div>
                        </div>

                        {!isEditing && (
                            <GamingButton
                                onClick={() => setIsEditing(true)}
                                variant="outline"
                                size="sm"
                                className="hidden sm:flex"
                            >
                                ✏️ Edit Profile
                            </GamingButton>
                        )}
                    </div>

                    {!isEditing && (
                        <GamingButton
                            onClick={() => setIsEditing(true)}
                            variant="outline"
                            size="sm"
                            className="w-full sm:hidden mb-4"
                        >
                            ✏️ Edit Profile
                        </GamingButton>
                    )}

                    {isEditing ? (
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.first_name}
                                        onChange={(e) =>
                                            setData(
                                                "first_name",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        required
                                    />
                                    {errors.first_name && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.first_name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.last_name}
                                        onChange={(e) =>
                                            setData("last_name", e.target.value)
                                        }
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        required
                                    />
                                    {errors.last_name && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.last_name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-400">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={data.phone_number}
                                    onChange={(e) =>
                                        setData("phone_number", e.target.value)
                                    }
                                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="+880 123 456 7890"
                                />
                                {errors.phone_number && (
                                    <p className="mt-1 text-sm text-red-400">
                                        {errors.phone_number}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Street Address
                                </label>
                                <input
                                    type="text"
                                    value={data.street_address}
                                    onChange={(e) =>
                                        setData(
                                            "street_address",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="123 Main Street"
                                />
                                {errors.street_address && (
                                    <p className="mt-1 text-sm text-red-400">
                                        {errors.street_address}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        value={data.city}
                                        onChange={(e) =>
                                            setData("city", e.target.value)
                                        }
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="Dhaka"
                                    />
                                    {errors.city && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.city}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        State/Division
                                    </label>
                                    <input
                                        type="text"
                                        value={data.state}
                                        onChange={(e) =>
                                            setData("state", e.target.value)
                                        }
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="Dhaka Division"
                                    />
                                    {errors.state && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.state}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        ZIP/Postal Code
                                    </label>
                                    <input
                                        type="text"
                                        value={data.zip}
                                        onChange={(e) =>
                                            setData("zip", e.target.value)
                                        }
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="1000"
                                    />
                                    {errors.zip && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.zip}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Country
                                    </label>
                                    <select
                                        value={data.country}
                                        onChange={(e) =>
                                            setData("country", e.target.value)
                                        }
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="Bangladesh">
                                            Bangladesh
                                        </option>
                                        <option value="India">India</option>
                                        <option value="Pakistan">
                                            Pakistan
                                        </option>
                                        <option value="United States">
                                            United States
                                        </option>
                                        <option value="United Kingdom">
                                            United Kingdom
                                        </option>
                                        <option value="Canada">Canada</option>
                                        <option value="Australia">
                                            Australia
                                        </option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.country && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.country}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        value={
                                            data.date_of_birth
                                                ? data.date_of_birth.split(
                                                      "T"
                                                  )[0]
                                                : ""
                                        }
                                        onChange={(e) =>
                                            setData(
                                                "date_of_birth",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                    {errors.date_of_birth && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.date_of_birth}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <GamingButton
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1"
                                >
                                    {processing
                                        ? "🔄 Saving..."
                                        : "💾 Save Changes"}
                                </GamingButton>

                                <GamingButton
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1"
                                >
                                    ❌ Cancel
                                </GamingButton>
                            </div>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition ease-in-out duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-center">
                                    ✅ Profile updated successfully!
                                </div>
                            </Transition>
                        </form>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-slate-400">
                                        First Name
                                    </h3>
                                    <p className="text-white">
                                        {user.first_name || "Not set"}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-400">
                                        Last Name
                                    </h3>
                                    <p className="text-white">
                                        {user.last_name || "Not set"}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-400">
                                        Email
                                    </h3>
                                    <p className="text-white">{user.email}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-400">
                                        Phone Number
                                    </h3>
                                    <p className="text-white">
                                        {user.phone_number || "Not set"}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-400">
                                        Date of Birth
                                    </h3>
                                    <p className="text-white">
                                        {user.date_of_birth
                                            ? new Date(
                                                  user.date_of_birth
                                              ).toLocaleDateString()
                                            : "Not set"}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-slate-400">
                                        Street Address
                                    </h3>
                                    <p className="text-white">
                                        {user.street_address || "Not set"}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-400">
                                        City
                                    </h3>
                                    <p className="text-white">
                                        {user.city || "Not set"}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-400">
                                        State/Division
                                    </h3>
                                    <p className="text-white">
                                        {user.state || "Not set"}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-400">
                                        ZIP/Postal Code
                                    </h3>
                                    <p className="text-white">
                                        {user.zip || "Not set"}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-400">
                                        Country
                                    </h3>
                                    <p className="text-white">
                                        {user.country || "Not set"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-white mb-4">
                        Account Status
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                            <div className="text-2xl mb-2">👑</div>
                            <div className="text-sm text-slate-400">Role</div>
                            <div className="text-white font-medium capitalize">
                                {user.role}
                            </div>
                        </div>
                        <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                            <div className="text-2xl mb-2">✅</div>
                            <div className="text-sm text-slate-400">Status</div>
                            <div className="text-white font-medium capitalize">
                                {user.status}
                            </div>
                        </div>
                        <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                            <div className="text-2xl mb-2">📧</div>
                            <div className="text-sm text-slate-400">
                                Email Verified
                            </div>
                            <div className="text-white font-medium">
                                {user.email_verified_at ? "Yes" : "No"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
