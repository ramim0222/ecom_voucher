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
                <h2 className="text-base sm:text-lg md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form
                onSubmit={submit}
                className="mt-4 sm:mt-5 md:mt-6 lg:mt-6 xl:mt-8 2xl:mt-10 space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-6 xl:space-y-8 2xl:space-y-10"
            >
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10">
                    <div>
                        <InputLabel
                            htmlFor="first_name"
                            value="First Name"
                            className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                        />

                        <TextInput
                            id="first_name"
                            className="mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4 block w-full text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                            value={data.first_name}
                            onChange={(e) =>
                                setData("first_name", e.target.value)
                            }
                            required
                            isFocused
                            autoComplete="given-name"
                        />

                        <InputError
                            className="mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                            message={errors.first_name}
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="last_name"
                            value="Last Name"
                            className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                        />

                        <TextInput
                            id="last_name"
                            className="mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4 block w-full text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                            value={data.last_name}
                            onChange={(e) =>
                                setData("last_name", e.target.value)
                            }
                            required
                            autoComplete="family-name"
                        />

                        <InputError
                            className="mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                            message={errors.last_name}
                        />
                    </div>
                </div>

                {/* Email Field */}
                <div>
                    <InputLabel
                        htmlFor="email"
                        value="Email"
                        className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                    />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4 block w-full text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError
                        className="mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                        message={errors.email}
                    />
                </div>

                {/* Phone Number Field */}
                <div>
                    <InputLabel
                        htmlFor="phone_number"
                        value="Phone Number"
                        className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                    />

                    <TextInput
                        id="phone_number"
                        type="tel"
                        className="mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4 block w-full text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                        value={data.phone_number}
                        onChange={(e) =>
                            setData("phone_number", e.target.value)
                        }
                        autoComplete="tel"
                        placeholder="+880 123 456 7890"
                    />

                    <InputError
                        className="mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                        message={errors.phone_number}
                    />
                </div>

                {/* Street Address Field */}
                <div>
                    <InputLabel
                        htmlFor="street_address"
                        value="Street Address"
                        className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                    />

                    <TextInput
                        id="street_address"
                        className="mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4 block w-full text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                        value={data.street_address}
                        onChange={(e) =>
                            setData("street_address", e.target.value)
                        }
                        autoComplete="street-address"
                        placeholder="123 Main Street"
                    />

                    <InputError
                        className="mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                        message={errors.street_address}
                    />
                </div>

                {/* City and State Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10">
                    <div>
                        <InputLabel
                            htmlFor="city"
                            value="City"
                            className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                        />

                        <TextInput
                            id="city"
                            className="mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4 block w-full text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                            value={data.city}
                            onChange={(e) => setData("city", e.target.value)}
                            autoComplete="address-level2"
                            placeholder="Dhaka"
                        />

                        <InputError
                            className="mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                            message={errors.city}
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="state"
                            value="State/Division"
                            className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                        />

                        <TextInput
                            id="state"
                            className="mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4 block w-full text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                            value={data.state}
                            onChange={(e) => setData("state", e.target.value)}
                            autoComplete="address-level1"
                            placeholder="Dhaka Division"
                        />

                        <InputError
                            className="mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                            message={errors.state}
                        />
                    </div>
                </div>

                {/* ZIP and Country Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10">
                    <div>
                        <InputLabel
                            htmlFor="zip"
                            value="ZIP/Postal Code"
                            className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                        />

                        <TextInput
                            id="zip"
                            className="mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4 block w-full text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                            value={data.zip}
                            onChange={(e) => setData("zip", e.target.value)}
                            autoComplete="postal-code"
                            placeholder="1000"
                        />

                        <InputError
                            className="mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                            message={errors.zip}
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="country"
                            value="Country"
                            className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                        />

                        <select
                            id="country"
                            className="mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
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

                        <InputError
                            className="mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                            message={errors.country}
                        />
                    </div>
                </div>

                {/* Date of Birth Field */}
                <div>
                    <InputLabel
                        htmlFor="date_of_birth"
                        value="Date of Birth"
                        className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                    />

                    <TextInput
                        id="date_of_birth"
                        type="date"
                        className="mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4 block w-full text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                        value={data.date_of_birth}
                        onChange={(e) =>
                            setData("date_of_birth", e.target.value)
                        }
                        autoComplete="bday"
                    />

                    <InputError
                        className="mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-3 2xl:mt-4 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                        message={errors.date_of_birth}
                    />
                </div>

                {/* Email Preferences */}
                <div className="space-y-2 sm:space-y-3 md:space-y-3 lg:space-y-4 xl:space-y-5 2xl:space-y-6">
                    <div className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base font-medium text-gray-700">
                        Email Preferences
                    </div>

                    <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                        <input
                            id="promotional_emails"
                            type="checkbox"
                            className="mt-1 sm:mt-0 rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6"
                            checked={data.promotional_emails}
                            onChange={(e) =>
                                setData("promotional_emails", e.target.checked)
                            }
                        />
                        <label
                            htmlFor="promotional_emails"
                            className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base text-gray-600 leading-relaxed"
                        >
                            Receive promotional emails about new gaming vouchers
                            and special offers
                        </label>
                    </div>

                    <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                        <input
                            id="other_updates"
                            type="checkbox"
                            className="mt-1 sm:mt-0 rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6"
                            checked={data.other_updates}
                            onChange={(e) =>
                                setData("other_updates", e.target.checked)
                            }
                        />
                        <label
                            htmlFor="other_updates"
                            className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base text-gray-600 leading-relaxed"
                        >
                            Receive updates about orders and account information
                        </label>
                    </div>
                </div>

                {/* Email Verification */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="rounded-md text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === "verification-link-sent" && (
                            <div className="mt-2 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                {/* Submit Button and Success Message */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10">
                    <PrimaryButton
                        disabled={processing}
                        className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base px-3 sm:px-4 md:px-4 lg:px-6 xl:px-8 2xl:px-10 py-2 sm:py-2.5 md:py-3 lg:py-3 xl:py-4 2xl:py-5"
                    >
                        Save
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base text-gray-600">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
