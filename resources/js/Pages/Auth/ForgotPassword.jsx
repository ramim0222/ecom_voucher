import { Head, useForm } from "@inertiajs/react";
import { GamingButton } from "@/Components/ui/GamingButton";
import GuestLayout from "@/Layouts/GuestLayout";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-8 text-center">
                <h1 className="font-[family-name:var(--font-heading)] font-bold text-3xl mb-2 text-foreground">
                    Reset Password
                </h1>
                <p className="text-muted-foreground">
                    Enter your email to receive reset instructions
                </p>
            </div>

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-foreground ${
                            errors.email
                                ? "border-destructive"
                                : "border-border"
                        }`}
                        placeholder="Enter your email address"
                        autoFocus
                        autoComplete="email"
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
                    <a
                        href="/login"
                        className="text-accent hover:text-accent/80 font-medium"
                    >
                        Sign in
                    </a>
                </p>
            </form>
        </GuestLayout>
    );
}
