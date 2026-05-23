"use client";

import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { SiteLayout } from "@/Components/Layout/SiteLayout";
import { GamingButton } from "@/Components/ui/GamingButton";
import { AuthLayout } from "@/Components/Auth/AuthLayout";

export default function SignupPage() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
        terms_accepted: false,
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData(name, type === "checkbox" ? checked : value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("register"));
    };

    return (
        <SiteLayout>
            <AuthLayout
                title="Join GameVault"
                subtitle="Create your account and start gaming"
                backgroundImage="/gaming-signup-background.png"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                value={data.first_name}
                                onChange={handleInputChange}
                                className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                                    errors.first_name
                                        ? "border-destructive"
                                        : "border-border"
                                }`}
                                placeholder="John"
                            />
                            {errors.first_name && (
                                <p className="text-destructive text-sm mt-1">
                                    {errors.first_name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                value={data.last_name}
                                onChange={handleInputChange}
                                className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                                    errors.last_name
                                        ? "border-destructive"
                                        : "border-border"
                                }`}
                                placeholder="Doe"
                            />
                            {errors.last_name && (
                                <p className="text-destructive text-sm mt-1">
                                    {errors.last_name}
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
                            value={data.email}
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
                            value={data.password}
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
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={handleInputChange}
                            className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                                errors.password_confirmation
                                    ? "border-destructive"
                                    : "border-border"
                            }`}
                            placeholder="Confirm your password"
                        />
                        {errors.password_confirmation && (
                            <p className="text-destructive text-sm mt-1">
                                {errors.password_confirmation}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="flex items-start gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="terms_accepted"
                                checked={data.terms_accepted}
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
                        {errors.terms_accepted && (
                            <p className="text-destructive text-sm mt-1">
                                {errors.terms_accepted}
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
                        {processing ? "Creating Account..." : "Create Account"}
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
                            href="/login"
                            className="text-accent hover:text-accent/80 font-medium"
                        >
                            Sign in
                        </a>
                    </p>
                </form>
            </AuthLayout>
        </SiteLayout>
    );
}
