"use client";

import { useState, useEffect } from "react";
import { useForm, Link, router } from "@inertiajs/react";
import { SiteLayout } from "@/Components/Layout/SiteLayout";
import { GamingButton } from "@/Components/ui/GamingButton";
import { AuthLayout } from "@/Components/Auth/AuthLayout";

export default function VerifyEmailPage({ status }) {
    const [resendCount, setResendCount] = useState(0);
    const [lastResendTime, setLastResendTime] = useState(null);

    const { post, processing, errors } = useForm();

    // Check if we have a status message (success from controller)
    useEffect(() => {
        if (status === "verification-link-sent") {
            // Reset resend count and update last resend time when email is sent successfully
            setResendCount((prev) => prev + 1);
            setLastResendTime(new Date());
        }
    }, [status]);

    const handleResendEmail = async () => {
        if (resendCount >= 6) {
            alert(
                "Maximum resend attempts reached. Please wait before trying again."
            );
            return;
        }

        post(route("verification.send"), {
            onSuccess: () => {
                // The controller will redirect back with a status message
                // We'll handle this in the useEffect above
            },
            onError: (errors) => {
                // Errors are automatically handled by Inertia
                console.log("Verification email errors:", errors);
            },
        });
    };

    const canResend =
        resendCount < 6 &&
        (!lastResendTime || Date.now() - lastResendTime > 60000); // 1 minute cooldown

    return (
        <SiteLayout variant="auth">
            <AuthLayout
                title="Verify Your Email"
                subtitle="Check your inbox to complete registration"
            >
                <div className="text-center space-y-4 sm:space-y-6">
                    {/* Email Icon with Glow Effect */}
                    <div className="relative mx-auto w-20 h-20">
                        <div className="absolute inset-0 bg-accent/20 rounded-full animate-pulse"></div>
                        <div className="relative w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center border border-accent/30">
                            <svg
                                className="w-8 h-8 text-accent"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {status === "verification-link-sent" && (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                                <p className="text-sm text-green-600">
                                    A new verification link has been sent to
                                    your email address.
                                </p>
                            </div>
                        )}

                        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                            <p className="text-sm">
                                We've sent a verification link to your email
                                address.
                            </p>
                        </div>

                        <div className="text-left space-y-2">
                            <p className="text-sm text-muted-foreground">
                                <strong>Next steps:</strong>
                            </p>
                            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                <li>
                                    Check your email inbox (and spam folder)
                                </li>
                                <li>
                                    Click the verification link in the email
                                </li>
                                <li>Return here to sign in to your account</li>
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <GamingButton
                            variant="accent"
                            size="lg"
                            className="w-full"
                            onClick={handleResendEmail}
                            disabled={processing || !canResend}
                        >
                            {processing
                                ? "Sending..."
                                : "Resend Verification Email"}
                        </GamingButton>

                        {resendCount > 0 && (
                            <p className="text-xs text-muted-foreground">
                                Resent {resendCount}/6 times
                                {!canResend &&
                                    resendCount < 6 &&
                                    " • Wait 1 minute before resending"}
                            </p>
                        )}

                        <div className="flex gap-3">
                            <GamingButton
                                variant="ghost"
                                size="lg"
                                className="flex-1"
                                onClick={() => router.visit(route("login"))}
                            >
                                Sign In
                            </GamingButton>
                            <GamingButton
                                variant="ghost"
                                size="lg"
                                className="flex-1"
                                onClick={() => router.visit(route("register"))}
                            >
                                Try Different Email
                            </GamingButton>
                        </div>
                    </div>

                    <div className="border-t border-border pt-4">
                        <p className="text-xs text-muted-foreground">
                            Still having trouble?{" "}
                            <Link
                                href={route("contact")}
                                className="text-accent hover:text-accent/80 font-medium"
                            >
                                Contact Support
                            </Link>
                        </p>
                    </div>
                </div>
            </AuthLayout>
        </SiteLayout>
    );
}
