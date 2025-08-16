import { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { GamingButton } from "@/Components/ui/GamingButton";
import GuestLayout from "@/Layouts/GuestLayout";

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const [resendCount, setResendCount] = useState(0);
    const [lastResendTime, setLastResendTime] = useState(null);

    const submit = (e) => {
        e.preventDefault();

        if (resendCount >= 3) {
            alert(
                "Maximum resend attempts reached. Please contact support if you continue having issues."
            );
            return;
        }

        post(route("verification.send"), {
            onSuccess: () => {
                setResendCount(resendCount + 1);
                setLastResendTime(new Date());
            },
        });
    };

    const canResend =
        resendCount < 3 &&
        (!lastResendTime || Date.now() - lastResendTime > 60000); // 1 minute cooldown

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="mb-8 text-center">
                <h1 className="font-[family-name:var(--font-heading)] font-bold text-3xl mb-2 text-foreground">
                    Verify Your Email
                </h1>
                <p className="text-muted-foreground">
                    Check your inbox to complete registration
                </p>
            </div>
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
                            <p className="text-sm text-foreground">
                                Thanks for signing up! Before getting started,
                                could you verify your email address by clicking
                                on the link we just emailed to you? If you
                                didn't receive the email, we will gladly send
                                you another.
                            </p>
                        </div>

                        {status === "verification-link-sent" && (
                            <div className="mb-4 font-medium text-sm text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}

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
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <form onSubmit={submit}>
                        <GamingButton
                            type="submit"
                            variant="accent"
                            size="lg"
                            disabled={processing || !canResend}
                        >
                            {processing
                                ? "Sending..."
                                : "Resend Verification Email"}
                        </GamingButton>
                    </form>

                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Log Out
                    </Link>
                </div>

                {resendCount > 0 && (
                    <p className="text-xs text-muted-foreground text-center">
                        Resent {resendCount}/3 times
                        {!canResend &&
                            resendCount < 3 &&
                            " • Wait 1 minute before resending"}
                    </p>
                )}
            </div>
        </GuestLayout>
    );
}
