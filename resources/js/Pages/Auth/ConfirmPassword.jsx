import { useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import { GamingButton } from "@/Components/ui/GamingButton";
import GuestLayout from "@/Layouts/GuestLayout";

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: "",
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("password.confirm"));
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <div className="mb-8 text-center">
                <h1 className="font-[family-name:var(--font-heading)] font-bold text-3xl mb-2 text-foreground">
                    Confirm Your Password
                </h1>
                <p className="text-muted-foreground">
                    Please enter your password to continue
                </p>
            </div>

            <div className="space-y-6">
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                    <p className="text-sm text-accent">
                        🔒 For your security, please confirm your password
                        before proceeding with sensitive actions.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">
                            Current Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-foreground ${
                                errors.password
                                    ? "border-destructive"
                                    : "border-border"
                            }`}
                            placeholder="Enter your current password"
                            autoFocus
                            autoComplete="current-password"
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
                            {processing ? "Verifying..." : "Confirm Password"}
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
                        href="/forgot-password"
                        className="text-accent hover:text-accent/80 font-medium"
                    >
                        Reset it here
                    </a>
                </p>
            </div>
        </GuestLayout>
    );
}
