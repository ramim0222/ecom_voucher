import { useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { GamingButton } from "@/Components/ui/GamingButton";
import GuestLayout from "@/Layouts/GuestLayout";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <GuestLayout>
            <Head title="Sign In" />

            <div className="mb-8 text-center">
                <h1 className="font-[family-name:var(--font-heading)] font-bold text-3xl mb-2 text-foreground">
                    Welcome Back
                </h1>
                <p className="text-muted-foreground">
                    Sign in to your GameVault account
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
                        placeholder="your@email.com"
                        autoComplete="username"
                    />
                    {errors.email && (
                        <p className="text-destructive text-sm mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-foreground ${
                            errors.password
                                ? "border-destructive"
                                : "border-border"
                        }`}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                    />
                    {errors.password && (
                        <p className="text-destructive text-sm mt-1">
                            {errors.password}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                            className="rounded border-border bg-input text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-foreground">
                            Remember me
                        </span>
                    </label>
                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="text-sm text-accent hover:text-accent/80"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <GamingButton
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="w-full"
                    disabled={processing}
                >
                    {processing ? "Signing In..." : "Sign In"}
                </GamingButton>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-card px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <GamingButton variant="ghost" size="lg" className="w-full">
                        Google
                    </GamingButton>
                    <GamingButton variant="ghost" size="lg" className="w-full">
                        Discord
                    </GamingButton>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                        href={route("register")}
                        className="text-accent hover:text-accent/80 font-medium"
                    >
                        Sign up
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
