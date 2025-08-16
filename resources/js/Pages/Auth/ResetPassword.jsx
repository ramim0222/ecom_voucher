"use client";

import { useState } from "react";
import { useForm, Link, router } from "@inertiajs/react";
import { Header } from "@/Components/Layout/Header";
import { GamingButton } from "@/Components/ui/GamingButton";
import { AuthLayout } from "@/Components/Auth/AuthLayout";

export default function ResetPasswordPage({ token, email, status }) {
    const [passwordStrength, setPasswordStrength] = useState(0);

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

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

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setData("password", value);
        setPasswordStrength(calculatePasswordStrength(value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        post(route("password.store"), {
            onSuccess: () => {
                // The controller will redirect to login with a status message
                // No need to handle success here as the redirect happens automatically
            },
            onError: (errors) => {
                // Errors are automatically handled by Inertia
                console.log("Password reset errors:", errors);
            },
        });
    };

    // Remove the isSubmitted state and success screen since the controller handles the redirect
    const strengthInfo = getStrengthLabel(passwordStrength);

    return (
        <div className="min-h-screen">
            <Header />
            <AuthLayout
                title="Reset Your Password"
                subtitle="Create a new secure password"
                backgroundImage="/gaming-password-reset-digital-lock.png"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={handlePasswordChange}
                            className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                                errors.password
                                    ? "border-destructive"
                                    : "border-border"
                            }`}
                            placeholder="Enter your new password"
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
                        <label className="block text-sm font-medium mb-2">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                                errors.password_confirmation
                                    ? "border-destructive"
                                    : "border-border"
                            }`}
                            placeholder="Confirm your new password"
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
                        {processing
                            ? "Resetting Password..."
                            : "Reset Password"}
                    </GamingButton>

                    <p className="text-center text-sm text-muted-foreground">
                        Remember your password?{" "}
                        <Link
                            href={route("login")}
                            className="text-accent hover:text-accent/80 font-medium"
                        >
                            Sign in
                        </Link>
                    </p>
                </form>
            </AuthLayout>
        </div>
    );
}
