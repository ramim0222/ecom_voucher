"use client";

import { useState } from "react";
import { Header } from "@/Components/Layout/Header";
import { GamingButton } from "@/Components/ui/GamingButton";
import { AuthLayout } from "@/Components/Auth/AuthLayout";

export default function SignupPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required";
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        }

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password =
                "Password must contain uppercase, lowercase, and number";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms =
                "You must agree to the terms and conditions";
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
            await new Promise((resolve) => setTimeout(resolve, 2000));
            // Handle successful signup
            alert("Account created successfully!");
            window.location.href = "/auth/login";
        } catch (error) {
            setErrors({
                submit: "Failed to create account. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <Header />
            <AuthLayout
                title="Join GameVault"
                subtitle="Create your account and start gaming"
                backgroundImage="/gaming-signup-background.png"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {errors.submit && (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-destructive text-sm">
                            {errors.submit}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                                    errors.firstName
                                        ? "border-destructive"
                                        : "border-border"
                                }`}
                                placeholder="John"
                            />
                            {errors.firstName && (
                                <p className="text-destructive text-sm mt-1">
                                    {errors.firstName}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                                    errors.lastName
                                        ? "border-destructive"
                                        : "border-border"
                                }`}
                                placeholder="Doe"
                            />
                            {errors.lastName && (
                                <p className="text-destructive text-sm mt-1">
                                    {errors.lastName}
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
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                                errors.email
                                    ? "border-destructive"
                                    : "border-border"
                            }`}
                            placeholder="your@email.com"
                        />
                        {errors.email && (
                            <p className="text-destructive text-sm mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                                errors.password
                                    ? "border-destructive"
                                    : "border-border"
                            }`}
                            placeholder="Create a strong password"
                        />
                        {errors.password && (
                            <p className="text-destructive text-sm mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Confirm Password
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
                            placeholder="Confirm your password"
                        />
                        {errors.confirmPassword && (
                            <p className="text-destructive text-sm mt-1">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="flex items-start gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onChange={handleInputChange}
                                className="rounded border-border mt-0.5"
                            />
                            <span className="text-sm">
                                I agree to the{" "}
                                <a
                                    href="/terms"
                                    className="text-accent hover:text-accent/80"
                                >
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a
                                    href="/privacy"
                                    className="text-accent hover:text-accent/80"
                                >
                                    Privacy Policy
                                </a>
                            </span>
                        </label>
                        {errors.agreeToTerms && (
                            <p className="text-destructive text-sm mt-1">
                                {errors.agreeToTerms}
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
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </GamingButton>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or sign up with
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <GamingButton
                            variant="ghost"
                            size="lg"
                            className="w-full"
                        >
                            Google
                        </GamingButton>
                        <GamingButton
                            variant="ghost"
                            size="lg"
                            className="w-full"
                        >
                            Discord
                        </GamingButton>
                    </div>

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
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
