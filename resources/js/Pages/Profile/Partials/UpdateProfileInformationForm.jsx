import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;

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
            date_of_birth: user.date_of_birth || "",
            promotional_emails: user.promotional_emails || false,
            other_updates: user.other_updates || false,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route("profile.update"));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="first_name" value="First Name" />

                        <TextInput
                            id="first_name"
                            className="mt-1 block w-full"
                            value={data.first_name}
                            onChange={(e) =>
                                setData("first_name", e.target.value)
                            }
                            required
                            isFocused
                            autoComplete="given-name"
                        />

                        <InputError
                            className="mt-2"
                            message={errors.first_name}
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="last_name" value="Last Name" />

                        <TextInput
                            id="last_name"
                            className="mt-1 block w-full"
                            value={data.last_name}
                            onChange={(e) =>
                                setData("last_name", e.target.value)
                            }
                            required
                            autoComplete="family-name"
                        />

                        <InputError
                            className="mt-2"
                            message={errors.last_name}
                        />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="phone_number" value="Phone Number" />

                    <TextInput
                        id="phone_number"
                        type="tel"
                        className="mt-1 block w-full"
                        value={data.phone_number}
                        onChange={(e) =>
                            setData("phone_number", e.target.value)
                        }
                        autoComplete="tel"
                        placeholder="+880 123 456 7890"
                    />

                    <InputError
                        className="mt-2"
                        message={errors.phone_number}
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="street_address"
                        value="Street Address"
                    />

                    <TextInput
                        id="street_address"
                        className="mt-1 block w-full"
                        value={data.street_address}
                        onChange={(e) =>
                            setData("street_address", e.target.value)
                        }
                        autoComplete="street-address"
                        placeholder="123 Main Street"
                    />

                    <InputError
                        className="mt-2"
                        message={errors.street_address}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="city" value="City" />

                        <TextInput
                            id="city"
                            className="mt-1 block w-full"
                            value={data.city}
                            onChange={(e) => setData("city", e.target.value)}
                            autoComplete="address-level2"
                            placeholder="Dhaka"
                        />

                        <InputError className="mt-2" message={errors.city} />
                    </div>

                    <div>
                        <InputLabel htmlFor="state" value="State/Division" />

                        <TextInput
                            id="state"
                            className="mt-1 block w-full"
                            value={data.state}
                            onChange={(e) => setData("state", e.target.value)}
                            autoComplete="address-level1"
                            placeholder="Dhaka Division"
                        />

                        <InputError className="mt-2" message={errors.state} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="zip" value="ZIP/Postal Code" />

                        <TextInput
                            id="zip"
                            className="mt-1 block w-full"
                            value={data.zip}
                            onChange={(e) => setData("zip", e.target.value)}
                            autoComplete="postal-code"
                            placeholder="1000"
                        />

                        <InputError className="mt-2" message={errors.zip} />
                    </div>

                    <div>
                        <InputLabel htmlFor="country" value="Country" />

                        <select
                            id="country"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            value={data.country}
                            onChange={(e) => setData("country", e.target.value)}
                            autoComplete="country-name"
                        >
                            <option value="Bangladesh">Bangladesh</option>
                            <option value="India">India</option>
                            <option value="Pakistan">Pakistan</option>
                            <option value="United States">United States</option>
                            <option value="United Kingdom">
                                United Kingdom
                            </option>
                            <option value="Canada">Canada</option>
                            <option value="Australia">Australia</option>
                            <option value="Other">Other</option>
                        </select>

                        <InputError className="mt-2" message={errors.country} />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="date_of_birth" value="Date of Birth" />

                    <TextInput
                        id="date_of_birth"
                        type="date"
                        className="mt-1 block w-full"
                        value={data.date_of_birth}
                        onChange={(e) =>
                            setData("date_of_birth", e.target.value)
                        }
                        autoComplete="bday"
                    />

                    <InputError
                        className="mt-2"
                        message={errors.date_of_birth}
                    />
                </div>

                <div className="space-y-3">
                    <div className="text-sm font-medium text-gray-700">
                        Email Preferences
                    </div>

                    <div className="flex items-center">
                        <input
                            id="promotional_emails"
                            type="checkbox"
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                            checked={data.promotional_emails}
                            onChange={(e) =>
                                setData("promotional_emails", e.target.checked)
                            }
                        />
                        <label
                            htmlFor="promotional_emails"
                            className="ml-2 text-sm text-gray-600"
                        >
                            Receive promotional emails about new gaming vouchers
                            and special offers
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="other_updates"
                            type="checkbox"
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                            checked={data.other_updates}
                            onChange={(e) =>
                                setData("other_updates", e.target.checked)
                            }
                        />
                        <label
                            htmlFor="other_updates"
                            className="ml-2 text-sm text-gray-600"
                        >
                            Receive updates about orders and account information
                        </label>
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === "verification-link-sent" && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
