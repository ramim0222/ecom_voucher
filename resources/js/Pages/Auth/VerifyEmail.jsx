"use client";

import { useState } from "react";
import { Header } from "@/Components/Layout/Header";
import { GamingButton } from "@/Components/ui/GamingButton";
import { AuthLayout } from "@/Components/Auth/AuthLayout";

export default function VerifyEmailPage() {
    const [isResending, setIsResending] = useState(false);
    const [resendCount, setResendCount] = useState(0);
    const [lastResendTime, setLastResendTime] = useState(null);

    // Get email from URL params or use placeholder
    const email =
        new URLSearchParams(window.location.search).get("email") ||
        "your@email.com";

    const handleResendEmail = async () => {
        if (resendCount >= 3) {
            alert(
                "Maximum resend attempts reached. Please contact support if you continue having issues."
            );
            return;
        }

        setIsResending(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setResendCount(resendCount + 1);
            setLastResendTime(new Date());
            alert("Verification email sent successfully!");
        } catch (error) {
            alert("Failed to resend email. Please try again.");
        } finally {
            setIsResending(false);
        }
    };

    const canResend =
        resendCount < 3 &&
        (!lastResendTime || Date.now() - lastResendTime > 60000); // 1 minute cooldown

    return (
        <div className="min-h-screen">
            <Header />
            <AuthLayout
                title="Verify Your Email"
                subtitle="Check your inbox to complete registration"
                backgroundImage="/glowing-gaming-envelope.png"
            >
                <div className="text-center space-y-6">
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
                        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                            <p className="text-sm">
                                We've sent a verification link to{" "}
                                <span className="font-medium text-accent">
                                    {email}
                                </span>
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
                            disabled={isResending || !canResend}
                        >
                            {isResending
                                ? "Sending..."
                                : "Resend Verification Email"}
                        </GamingButton>

                        {resendCount > 0 && (
                            <p className="text-xs text-muted-foreground">
                                Resent {resendCount}/3 times
                                {!canResend &&
                                    resendCount < 3 &&
                                    " • Wait 1 minute before resending"}
                            </p>
                        )}

                        <div className="flex gap-3">
                            <GamingButton
                                variant="ghost"
                                size="lg"
                                className="flex-1"
                                onClick={() =>
                                    (window.location.href = "/auth/login")
                                }
                            >
                                Sign In
                            </GamingButton>
                            <GamingButton
                                variant="ghost"
                                size="lg"
                                className="flex-1"
                                onClick={() =>
                                    (window.location.href = "/auth/signup")
                                }
                            >
                                Try Different Email
                            </GamingButton>
                        </div>
                    </div>

                    <div className="border-t border-border pt-4">
                        <p className="text-xs text-muted-foreground">
                            Still having trouble?{" "}
                            <a
                                href="/support"
                                className="text-accent hover:text-accent/80 font-medium"
                            >
                                Contact Support
                            </a>
                        </p>
                    </div>
                </div>
            </AuthLayout>
        </div>
    );
}
