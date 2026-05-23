"use client";

import { useState, useEffect } from "react";
import { useForm, Link, router } from "@inertiajs/react";
import { SiteLayout } from "@/Components/Layout/SiteLayout";
import { GamingButton } from "@/Components/ui/GamingButton";
import { AuthLayout } from "@/Components/Auth/AuthLayout";

export default function ForgotPasswordPage({ status }) {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
    });

    // Check if we have a status message (success from controller)
    useEffect(() => {
        if (status) {
            setIsSubmitted(true);
        }
    }, [status]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        post(route("password.email"), {
            onSuccess: () => {
                // The controller will redirect back with a status message
                // We'll handle this in the useEffect above
            },
            onError: (errors) => {
                // Errors are automatically handled by Inertia
                console.log("Password reset errors:", errors);
            },
        });
    };

    if (isSubmitted) {
        return (
            <SiteLayout variant="auth">
                <AuthLayout
                    title="Check Your Email"
                    subtitle="We've sent password reset instructions"
                >
                    <div className="text-center space-y-4 sm:space-y-6">
                        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-2xl">📧</span>
                        </div>
                        <div>
                            <p className="text-muted-foreground mb-4">
                                We've sent a password reset link to{" "}
                                <strong className="text-foreground">
                                    {data.email}
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
                                onClick={() => {
                                    setIsSubmitted(false);
                                    reset();
                                }}
                            >
                                Try Different Email
                            </GamingButton>
                            <GamingButton
                                variant="ghost"
                                size="lg"
                                className="w-full"
                                onClick={() => router.visit(route("login"))}
                            >
                                Back to Sign In
                            </GamingButton>
                        </div>
                    </div>
                </AuthLayout>
            </SiteLayout>
        );
    }

    return (
        <SiteLayout variant="auth">
            <AuthLayout
                title="Reset Password"
                subtitle="Enter your email to receive reset instructions"
            >
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                                errors.email
                                    ? "border-destructive"
                                    : "border-border"
                            }`}
                            placeholder="Enter your email address"
                        />
                        {errors.email && (
                            <p className="text-destructive text-sm mt-1">
                                {errors.email}
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
                        {processing ? "Sending..." : "Send Reset Instructions"}
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
        </SiteLayout>
    );
}
