"use client";

import { useState } from "react";
import { Header } from "@/Components/Layout/Header";
import { GamingButton } from "@/Components/ui/GamingButton";
import { AuthLayout } from "@/Components/Auth/AuthLayout";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError("Email is required");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setIsSubmitted(true);
        } catch (error) {
            setError("Failed to send reset email. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen">
                <Header />
                <AuthLayout
                    title="Check Your Email"
                    subtitle="We've sent password reset instructions"
                    backgroundImage="/gaming-email-sent.png"
                >
                    <div className="text-center space-y-6">
                        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-2xl">📧</span>
                        </div>
                        <div>
                            <p className="text-muted-foreground mb-4">
                                We've sent a password reset link to{" "}
                                <strong className="text-foreground">
                                    {email}
                                </strong>
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Didn't receive the email? Check your spam folder
                                or try again.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <GamingButton
                                variant="accent"
                                size="lg"
                                className="w-full"
                                onClick={() => setIsSubmitted(false)}
                            >
                                Try Different Email
                            </GamingButton>
                            <GamingButton
                                variant="ghost"
                                size="lg"
                                className="w-full"
                                onClick={() =>
                                    (window.location.href = "/auth/login")
                                }
                            >
                                Back to Sign In
                            </GamingButton>
                        </div>
                    </div>
                </AuthLayout>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Header />
            <AuthLayout
                title="Reset Password"
                subtitle="Enter your email to receive reset instructions"
                backgroundImage="/gaming-password-reset.png"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-destructive text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError("");
                            }}
                            className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                                error ? "border-destructive" : "border-border"
                            }`}
                            placeholder="Enter your email address"
                        />
                    </div>

                    <GamingButton
                        type="submit"
                        variant="accent"
                        size="lg"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? "Sending..." : "Send Reset Instructions"}
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
