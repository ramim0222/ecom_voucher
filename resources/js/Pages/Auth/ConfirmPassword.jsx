"use client";

import { useState } from "react";
import { useForm, Link, router } from "@inertiajs/react";
import { Header } from "@/Components/Layout/Header";
import { GamingButton } from "@/Components/ui/GamingButton";
import { AuthLayout } from "@/Components/Auth/AuthLayout";

export default function ConfirmPasswordPage() {
    const { data, setData, post, processing, errors } = useForm({
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        post("/confirm-password", {
            onSuccess: () => {
                // The controller will redirect to the intended destination
                // No need to handle success here as the redirect happens automatically
            },
            onError: (errors) => {
                // Errors are automatically handled by Inertia
                console.log("Password confirmation errors:", errors);
            },
        });
    };

    return (
        <div className="min-h-screen">
            <Header />
            <AuthLayout
                title="Confirm Your Password"
                subtitle="Please enter your password to continue"
                backgroundImage="/gaming-security-shield.png"
            >
                <div className="space-y-6">
                    <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                        <p className="text-sm text-accent">
                            🔒 For your security, please confirm your password
                            before proceeding with sensitive actions.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                                    errors.password
                                        ? "border-destructive"
                                        : "border-border"
                                }`}
                                placeholder="Enter your current password"
                                autoFocus
                            />
                            {errors.password && (
                                <p className="text-destructive text-sm mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <GamingButton
                                type="submit"
                                variant="accent"
                                size="lg"
                                className="w-full"
                                disabled={processing}
                            >
                                {processing
                                    ? "Verifying..."
                                    : "Confirm Password"}
                            </GamingButton>

                            <GamingButton
                                type="button"
                                variant="ghost"
                                size="lg"
                                className="w-full"
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </GamingButton>
                        </div>
                    </form>

                    <p className="text-center text-sm text-muted-foreground">
                        Forgot your password?{" "}
                        <Link
                            href={route("password.request")}
                            className="text-accent hover:text-accent/80 font-medium"
                        >
                            Reset it here
                        </Link>
                    </p>
                </div>
            </AuthLayout>
        </div>
    );
}
