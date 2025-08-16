import { useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Header } from "@/Components/Layout/Header";
import { GamingButton } from "@/Components/ui/GamingButton";
import { AuthLayout } from "@/Components/Auth/AuthLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Checkbox from "@/Components/Checkbox";

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
        <div className="min-h-screen">
            <Head title="Log in" />
            <Header />
            <AuthLayout
                title="Welcome Back"
                subtitle="Sign in to your GameVault account"
                backgroundImage="/placeholder-j7n3w.png"
            >
                <form onSubmit={submit} className="space-y-6">
                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <div>
                        <InputLabel
                            htmlFor="email"
                            value="Email Address"
                            className="block text-sm font-medium mb-2"
                        />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                                errors.email
                                    ? "border-destructive"
                                    : "border-border"
                            }`}
                            autoComplete="username"
                            isFocused={true}
                            placeholder="your@email.com"
                            onChange={(e) => setData("email", e.target.value)}
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="block text-sm font-medium mb-2"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className={`w-full bg-input border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                                errors.password
                                    ? "border-destructive"
                                    : "border-border"
                            }`}
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData("remember", e.target.checked)
                                }
                                className="rounded border-border"
                            />
                            <span className="text-sm">Remember me</span>
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
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <GamingButton
                            variant="ghost"
                            size="lg"
                            className="w-full"
                            type="button"
                        >
                            Google
                        </GamingButton>
                        <GamingButton
                            variant="ghost"
                            size="lg"
                            className="w-full"
                            type="button"
                        >
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
            </AuthLayout>
        </div>
    );
}
