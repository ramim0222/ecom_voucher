"use client";

import { useState } from "react";
import { Header } from "@/Components/Layout/Header";
import { GamingButton } from "@/Components/ui/GamingButton";
import { AuthLayout } from "@/Components/Auth/AuthLayout";

export default function ConfirmPasswordPage() {
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password) {
            setError("Password is required");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // Simulate API call to verify password
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // Redirect to the intended action (e.g., account settings)
            window.location.href = "/dashboard/profile";
        } catch (error) {
            setError("Incorrect password. Please try again.");
        } finally {
            setIsLoading(false);
        }
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
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-destructive text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError("");
                                }}
                                className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                                    error
                                        ? "border-destructive"
                                        : "border-border"
                                }`}
                                placeholder="Enter your current password"
                                autoFocus
                            />
                        </div>

                        <div className="space-y-3">
                            <GamingButton
                                type="submit"
                                variant="accent"
                                size="lg"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading
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
                        <a
                            href="/auth/forgot-password"
                            className="text-accent hover:text-accent/80 font-medium"
                        >
                            Reset it here
                        </a>
                    </p>
                </div>
            </AuthLayout>
        </div>
    );
}
