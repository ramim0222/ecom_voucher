import { useEffect, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { GamingButton } from "@/Components/ui/GamingButton";
import GuestLayout from "@/Layouts/GuestLayout";

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });
    const [passwordStrength, setPasswordStrength] = useState(0);

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/\d/.test(password)) strength += 1;
        if (/[^a-zA-Z\d]/.test(password)) strength += 1;
        return strength;
    };

    const getStrengthLabel = (strength) => {
        switch (strength) {
            case 0:
            case 1:
                return { label: "Weak", color: "text-destructive" };
            case 2:
            case 3:
                return { label: "Medium", color: "text-yellow-500" };
            case 4:
            case 5:
                return { label: "Strong", color: "text-green-500" };
            default:
                return { label: "Weak", color: "text-destructive" };
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("password.store"));
    };

    const strengthInfo = getStrengthLabel(passwordStrength);

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <div className="mb-8 text-center">
                <h1 className="font-[family-name:var(--font-heading)] font-bold text-3xl mb-2 text-foreground">
                    Reset Your Password
                </h1>
                <p className="text-muted-foreground">
                    Create a new secure password
                </p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                        New Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={(e) => {
                            setData("password", e.target.value);
                            setPasswordStrength(
                                calculatePasswordStrength(e.target.value)
                            );
                        }}
                        className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-foreground ${
                            errors.password
                                ? "border-destructive"
                                : "border-border"
                        }`}
                        placeholder="Enter your new password"
                        autoFocus
                        autoComplete="new-password"
                    />
                    {errors.password && (
                        <p className="text-destructive text-sm mt-1">
                            {errors.password}
                        </p>
                    )}

                    {/* Password Strength Indicator */}
                    {data.password && (
                        <div className="mt-2">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="flex-1 bg-muted rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            passwordStrength <= 1
                                                ? "bg-destructive w-1/5"
                                                : passwordStrength <= 3
                                                ? "bg-yellow-500 w-3/5"
                                                : "bg-green-500 w-full"
                                        }`}
                                    ></div>
                                </div>
                                <span
                                    className={`text-xs font-medium ${strengthInfo.color}`}
                                >
                                    {strengthInfo.label}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Use 8+ characters with uppercase, lowercase,
                                numbers, and symbols
                            </p>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                        Confirm New Password
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
                        placeholder="Confirm your new password"
                        autoComplete="new-password"
                    />
                    {errors.password_confirmation && (
                        <p className="text-destructive text-sm mt-1">
                            {errors.password_confirmation}
                        </p>
                    )}
                </div>

                <GamingButton
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="w-full"
                    disabled={processing}
                >
                    {processing ? "Resetting Password..." : "Reset Password"}
                </GamingButton>

                <p className="text-center text-sm text-muted-foreground">
                    Remember your password?{" "}
                    <a
                        href="/login"
                        className="text-accent hover:text-accent/80 font-medium"
                    >
                        Sign in
                    </a>
                </p>
            </form>
        </GuestLayout>
    );
}
