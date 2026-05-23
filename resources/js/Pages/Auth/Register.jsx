import { useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { GamingButton } from "@/Components/ui/GamingButton";
import { AuthForm } from "@/Components/Auth/AuthForm";
import GuestLayout from "@/Layouts/GuestLayout";

export default function Register({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone_number: "",
        street_address: "",
        city: "",
        state: "",
        zip: "",
        country: "Bangladesh",
        date_of_birth: "",
        promotional_emails: true,
        other_updates: true,
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("register"));
    };

    return (
        <GuestLayout
            title="Create Account"
            subtitle="Join GameVault and unlock exclusive gaming vouchers"
        >
            <Head title="Register" />

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}

            <AuthForm
                onSubmit={submit}
                errors={errors}
                className="space-y-4 sm:space-y-6"
            >
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">
                            First Name
                        </label>
                        <input
                            id="first_name"
                            type="text"
                            name="first_name"
                            value={data.first_name}
                            onChange={(e) =>
                                setData("first_name", e.target.value)
                            }
                            className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-foreground ${
                                errors.first_name
                                    ? "border-destructive"
                                    : "border-border"
                            }`}
                            placeholder="John"
                            autoComplete="given-name"
                            required
                        />
                        {errors.first_name && (
                            <p className="text-destructive text-sm mt-1">
                                {errors.first_name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">
                            Last Name
                        </label>
                        <input
                            id="last_name"
                            type="text"
                            name="last_name"
                            value={data.last_name}
                            onChange={(e) =>
                                setData("last_name", e.target.value)
                            }
                            className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-foreground ${
                                errors.last_name
                                    ? "border-destructive"
                                    : "border-border"
                            }`}
                            placeholder="Doe"
                            autoComplete="family-name"
                            required
                        />
                        {errors.last_name && (
                            <p className="text-destructive text-sm mt-1">
                                {errors.last_name}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-foreground ${
                            errors.email
                                ? "border-destructive"
                                : "border-border"
                        }`}
                        placeholder="your@email.com"
                        autoComplete="email"
                        required
                    />
                    {errors.email && (
                        <p className="text-destructive text-sm mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                        Phone Number
                    </label>
                    <input
                        id="phone_number"
                        type="tel"
                        name="phone_number"
                        value={data.phone_number}
                        onChange={(e) =>
                            setData("phone_number", e.target.value)
                        }
                        className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-foreground ${
                            errors.phone_number
                                ? "border-destructive"
                                : "border-border"
                        }`}
                        placeholder="+880 123 456 7890"
                        autoComplete="tel"
                    />
                    {errors.phone_number && (
                        <p className="text-destructive text-sm mt-1">
                            {errors.phone_number}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-foreground ${
                            errors.password
                                ? "border-destructive"
                                : "border-border"
                        }`}
                        placeholder="Enter your password"
                        autoComplete="new-password"
                        required
                    />
                    {errors.password && (
                        <p className="text-destructive text-sm mt-1">
                            {errors.password}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                        Confirm Password
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-foreground ${
                            errors.password_confirmation
                                ? "border-destructive"
                                : "border-border"
                        }`}
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        required
                    />
                    {errors.password_confirmation && (
                        <p className="text-destructive text-sm mt-1">
                            {errors.password_confirmation}
                        </p>
                    )}
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground">
                        Address Information (Optional)
                    </h3>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">
                            Street Address
                        </label>
                        <input
                            id="street_address"
                            type="text"
                            name="street_address"
                            value={data.street_address}
                            onChange={(e) =>
                                setData("street_address", e.target.value)
                            }
                            className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-foreground ${
                                errors.street_address
                                    ? "border-destructive"
                                    : "border-border"
                            }`}
                            placeholder="123 Main Street"
                            autoComplete="street-address"
                        />
                        {errors.street_address && (
                            <p className="text-destructive text-sm mt-1">
                                {errors.street_address}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-foreground">
                                City
                            </label>
                            <input
                                id="city"
                                type="text"
                                name="city"
                                value={data.city}
                                onChange={(e) =>
                                    setData("city", e.target.value)
                                }
                                className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-foreground ${
                                    errors.city
                                        ? "border-destructive"
                                        : "border-border"
                                }`}
                                placeholder="Dhaka"
                                autoComplete="address-level2"
                            />
                            {errors.city && (
                                <p className="text-destructive text-sm mt-1">
                                    {errors.city}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-foreground">
                                State/Division
                            </label>
                            <input
                                id="state"
                                type="text"
                                name="state"
                                value={data.state}
                                onChange={(e) =>
                                    setData("state", e.target.value)
                                }
                                className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-foreground ${
                                    errors.state
                                        ? "border-destructive"
                                        : "border-border"
                                }`}
                                placeholder="Dhaka Division"
                                autoComplete="address-level1"
                            />
                            {errors.state && (
                                <p className="text-destructive text-sm mt-1">
                                    {errors.state}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-foreground">
                                ZIP/Postal Code
                            </label>
                            <input
                                id="zip"
                                type="text"
                                name="zip"
                                value={data.zip}
                                onChange={(e) => setData("zip", e.target.value)}
                                className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-foreground ${
                                    errors.zip
                                        ? "border-destructive"
                                        : "border-border"
                                }`}
                                placeholder="1000"
                                autoComplete="postal-code"
                            />
                            {errors.zip && (
                                <p className="text-destructive text-sm mt-1">
                                    {errors.zip}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-foreground">
                                Country
                            </label>
                            <select
                                id="country"
                                name="country"
                                value={data.country}
                                onChange={(e) =>
                                    setData("country", e.target.value)
                                }
                                className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-foreground ${
                                    errors.country
                                        ? "border-destructive"
                                        : "border-border"
                                }`}
                                autoComplete="country-name"
                            >
                                <option value="Bangladesh">Bangladesh</option>
                                <option value="India">India</option>
                                <option value="Pakistan">Pakistan</option>
                                <option value="United States">
                                    United States
                                </option>
                                <option value="United Kingdom">
                                    United Kingdom
                                </option>
                                <option value="Canada">Canada</option>
                                <option value="Australia">Australia</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.country && (
                                <p className="text-destructive text-sm mt-1">
                                    {errors.country}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">
                            Date of Birth (Optional)
                        </label>
                        <input
                            id="date_of_birth"
                            type="date"
                            name="date_of_birth"
                            value={data.date_of_birth}
                            onChange={(e) =>
                                setData("date_of_birth", e.target.value)
                            }
                            className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-foreground ${
                                errors.date_of_birth
                                    ? "border-destructive"
                                    : "border-border"
                            }`}
                            autoComplete="bday"
                        />
                        {errors.date_of_birth && (
                            <p className="text-destructive text-sm mt-1">
                                {errors.date_of_birth}
                            </p>
                        )}
                    </div>

                    {/* Email Preferences */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-foreground">
                            Email Preferences
                        </h4>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="promotional_emails"
                                checked={data.promotional_emails}
                                onChange={(e) =>
                                    setData(
                                        "promotional_emails",
                                        e.target.checked
                                    )
                                }
                                className="rounded border-border bg-input text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-foreground">
                                I want to receive promotional emails about new
                                gaming vouchers and special offers
                            </span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="other_updates"
                                checked={data.other_updates}
                                onChange={(e) =>
                                    setData("other_updates", e.target.checked)
                                }
                                className="rounded border-border bg-input text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-foreground">
                                I want to receive updates about my orders and
                                account
                            </span>
                        </label>
                    </div>
                </div>

                <GamingButton
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="w-full"
                    disabled={processing}
                >
                    {processing ? "Creating Account..." : "Create Account"}
                </GamingButton>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-card px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <GamingButton variant="ghost" size="lg" className="w-full">
                        Google
                    </GamingButton>
                    <GamingButton variant="ghost" size="lg" className="w-full">
                        Discord
                    </GamingButton>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        href={route("login")}
                        className="text-accent hover:text-accent/80 font-medium"
                    >
                        Sign in
                    </Link>
                </p>
            </AuthForm>
        </GuestLayout>
    );
}
