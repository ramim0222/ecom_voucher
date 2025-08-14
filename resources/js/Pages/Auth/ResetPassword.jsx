"use client";

import { useState } from "react";
import { Header } from "@/Components/Layout/Header";
import { GamingButton } from "@/Components/ui/GamingButton";
import { AuthLayout } from "@/Components/Auth/AuthLayout";

export default function ResetPasswordPage() {
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "newPassword") {
            setPasswordStrength(calculatePasswordStrength(value));
        }

        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.newPassword) {
            newErrors.newPassword = "New password is required";
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Show success toast and redirect
            alert("Password reset successfully!");
            window.location.href = "/auth/login";
        } catch (error) {
            setErrors({
                submit: "Failed to reset password. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

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
                    {errors.submit && (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-destructive text-sm">
                            {errors.submit}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                                errors.newPassword
                                    ? "border-destructive"
                                    : "border-border"
                            }`}
                            placeholder="Enter your new password"
                        />
                        {errors.newPassword && (
                            <p className="text-destructive text-sm mt-1">
                                {errors.newPassword}
                            </p>
                        )}

                        {/* Password Strength Indicator */}
                        {formData.newPassword && (
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
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                                errors.confirmPassword
                                    ? "border-destructive"
                                    : "border-border"
                            }`}
                            placeholder="Confirm your new password"
                        />
                        {errors.confirmPassword && (
                            <p className="text-destructive text-sm mt-1">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    <GamingButton
                        type="submit"
                        variant="accent"
                        size="lg"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? "Resetting Password..." : "Reset Password"}
                    </GamingButton>

                    <p className="text-center text-sm text-muted-foreground">
                        Remember your password?{" "}
                        <a
                            href="/auth/login"
                            className="text-accent hover:text-accent/80 font-medium"
                        >
                            Sign in
                        </a>
                    </p>
                </form>
            </AuthLayout>
        </div>
    );
}
