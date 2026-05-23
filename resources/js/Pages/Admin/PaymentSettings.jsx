"use client";

import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { PageHead } from "@/Components/PageHead";
import { AdminLayout } from "@/Components/Admin/AdminLayout";
import { GamingButton } from "@/Components/ui/GamingButton";
import {
    formatValidationErrors,
    useToast,
} from "@/Components/Admin/ToastProvider";

const inputClassName =
    "w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500";

const labelClassName = "block text-sm font-medium text-slate-300 mb-2";

function Toggle({ checked, onChange, label }) {
    return (
        <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
                onClick={onChange}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                    checked ? "bg-orange-500" : "bg-slate-600"
                }`}
            >
                <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        checked ? "translate-x-5" : "translate-x-0"
                    }`}
                />
            </div>
            <span className="text-sm text-slate-300">{label}</span>
        </label>
    );
}

function PasswordInput({ id, name, value, onChange, placeholder }) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative">
            <input
                id={id}
                type={show ? "text" : "password"}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={inputClassName + " pr-12"}
            />
            <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
            >
                {show ? "Hide" : "Show"}
            </button>
        </div>
    );
}

function MethodSection({ title, icon, color, children, enabled, onToggleEnabled }) {
    const [open, setOpen] = useState(true);

    return (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-700/30 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className={`text-2xl`}>{icon}</span>
                    <div>
                        <h3 className="font-semibold text-white">{title}</h3>
                        <p className={`text-xs mt-0.5 ${enabled ? "text-green-400" : "text-slate-500"}`}>
                            {enabled ? "Enabled" : "Disabled"}
                        </p>
                    </div>
                </div>
                <span className="text-slate-400 text-lg">{open ? "▲" : "▼"}</span>
            </button>

            {open && (
                <div className="px-6 pb-6 space-y-4 border-t border-slate-700">
                    <div className="pt-4">
                        <Toggle
                            checked={enabled}
                            onChange={onToggleEnabled}
                            label="Enable this payment method"
                        />
                    </div>
                    {children}
                </div>
            )}
        </div>
    );
}

export default function PaymentSettings({ paymentSettings }) {
    const { addToast } = useToast();

    const [form, setForm] = useState({
        bkash: {
            enabled: paymentSettings?.bkash?.enabled ?? false,
            sandbox_mode: paymentSettings?.bkash?.sandbox_mode ?? true,
            app_key: paymentSettings?.bkash?.app_key ?? "",
            app_secret: paymentSettings?.bkash?.app_secret ?? "",
            username: paymentSettings?.bkash?.username ?? "",
            password: paymentSettings?.bkash?.password ?? "",
        },
        nagad: {
            enabled: paymentSettings?.nagad?.enabled ?? false,
            sandbox_mode: paymentSettings?.nagad?.sandbox_mode ?? true,
            merchant_id: paymentSettings?.nagad?.merchant_id ?? "",
            merchant_key: paymentSettings?.nagad?.merchant_key ?? "",
        },
        rocket: {
            enabled: paymentSettings?.rocket?.enabled ?? false,
            sandbox_mode: paymentSettings?.rocket?.sandbox_mode ?? true,
            merchant_id: paymentSettings?.rocket?.merchant_id ?? "",
            merchant_key: paymentSettings?.rocket?.merchant_key ?? "",
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const update = (method, field, value) => {
        setForm((prev) => ({
            ...prev,
            [method]: { ...prev[method], [field]: value },
        }));
    };

    const handleChange = (method, field) => (e) => {
        update(method, field, e.target.value);
    };

    const handleToggle = (method, field) => () => {
        update(method, field, !form[method][field]);
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        router.put(route("admin.settings.payment.update"), form, {
            onSuccess: () => {
                addToast("Payment settings saved successfully.", "success");
                setIsSubmitting(false);
            },
            onError: (errors) => {
                addToast(formatValidationErrors(errors), "error");
                setIsSubmitting(false);
            },
        });
    };

    return (
        <AdminLayout>
            <PageHead title="Payment Settings" />

            <div className="space-y-6 max-w-3xl">
                <div>
                    <Link
                        href={route("admin.settings")}
                        className="text-sm text-slate-400 hover:text-orange-400 transition-colors"
                    >
                        ← Back to Settings
                    </Link>
                    <h1 className="font-heading font-bold text-3xl text-white mt-2 mb-1">
                        Payment Settings
                    </h1>
                    <p className="text-slate-400">
                        Configure bKash, Nagad, and Rocket gateway credentials.
                        Use sandbox mode for testing.
                    </p>
                </div>

                {/* bKash */}
                <MethodSection
                    title="bKash"
                    icon="💚"
                    enabled={form.bkash.enabled}
                    onToggleEnabled={handleToggle("bkash", "enabled")}
                >
                    <div className="pt-2">
                        <Toggle
                            checked={form.bkash.sandbox_mode}
                            onChange={handleToggle("bkash", "sandbox_mode")}
                            label="Sandbox / test mode"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="bkash_app_key" className={labelClassName}>
                                App Key
                            </label>
                            <input
                                id="bkash_app_key"
                                type="text"
                                value={form.bkash.app_key}
                                onChange={handleChange("bkash", "app_key")}
                                placeholder="bKash App Key"
                                className={inputClassName}
                            />
                        </div>
                        <div>
                            <label htmlFor="bkash_app_secret" className={labelClassName}>
                                App Secret
                            </label>
                            <PasswordInput
                                id="bkash_app_secret"
                                value={form.bkash.app_secret}
                                onChange={handleChange("bkash", "app_secret")}
                                placeholder="bKash App Secret"
                            />
                        </div>
                        <div>
                            <label htmlFor="bkash_username" className={labelClassName}>
                                Username
                            </label>
                            <input
                                id="bkash_username"
                                type="text"
                                value={form.bkash.username}
                                onChange={handleChange("bkash", "username")}
                                placeholder="bKash API Username"
                                className={inputClassName}
                            />
                        </div>
                        <div>
                            <label htmlFor="bkash_password" className={labelClassName}>
                                Password
                            </label>
                            <PasswordInput
                                id="bkash_password"
                                value={form.bkash.password}
                                onChange={handleChange("bkash", "password")}
                                placeholder="bKash API Password"
                            />
                        </div>
                    </div>

                    <p className="text-xs text-slate-500">
                        Obtain credentials from the{" "}
                        <a
                            href="https://developer.bka.sh/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-400 underline"
                        >
                            bKash Developer Portal
                        </a>
                        . The callback URL registered there must match:{" "}
                        <span className="font-mono text-slate-300">
                            {window.location.origin}/payment/callback/bkash
                        </span>
                    </p>
                </MethodSection>

                {/* Nagad */}
                <MethodSection
                    title="Nagad"
                    icon="🟠"
                    enabled={form.nagad.enabled}
                    onToggleEnabled={handleToggle("nagad", "enabled")}
                >
                    <div className="pt-2">
                        <Toggle
                            checked={form.nagad.sandbox_mode}
                            onChange={handleToggle("nagad", "sandbox_mode")}
                            label="Sandbox / test mode"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="nagad_merchant_id" className={labelClassName}>
                                Merchant ID
                            </label>
                            <input
                                id="nagad_merchant_id"
                                type="text"
                                value={form.nagad.merchant_id}
                                onChange={handleChange("nagad", "merchant_id")}
                                placeholder="Nagad Merchant ID"
                                className={inputClassName}
                            />
                        </div>
                        <div>
                            <label htmlFor="nagad_merchant_key" className={labelClassName}>
                                Merchant Key (Private Key)
                            </label>
                            <PasswordInput
                                id="nagad_merchant_key"
                                value={form.nagad.merchant_key}
                                onChange={handleChange("nagad", "merchant_key")}
                                placeholder="Base64-encoded private key"
                            />
                        </div>
                    </div>

                    <p className="text-xs text-slate-500">
                        Contact Nagad merchant support to get your credentials.
                        Callback URL:{" "}
                        <span className="font-mono text-slate-300">
                            {window.location.origin}/payment/callback/nagad
                        </span>
                    </p>
                </MethodSection>

                {/* Rocket */}
                <MethodSection
                    title="Rocket (DBBL Nexus Pay)"
                    icon="🚀"
                    enabled={form.rocket.enabled}
                    onToggleEnabled={handleToggle("rocket", "enabled")}
                >
                    <div className="pt-2">
                        <Toggle
                            checked={form.rocket.sandbox_mode}
                            onChange={handleToggle("rocket", "sandbox_mode")}
                            label="Sandbox / test mode"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="rocket_merchant_id" className={labelClassName}>
                                Merchant ID
                            </label>
                            <input
                                id="rocket_merchant_id"
                                type="text"
                                value={form.rocket.merchant_id}
                                onChange={handleChange("rocket", "merchant_id")}
                                placeholder="Rocket Merchant ID"
                                className={inputClassName}
                            />
                        </div>
                        <div>
                            <label htmlFor="rocket_merchant_key" className={labelClassName}>
                                Merchant Key (Secret)
                            </label>
                            <PasswordInput
                                id="rocket_merchant_key"
                                value={form.rocket.merchant_key}
                                onChange={handleChange("rocket", "merchant_key")}
                                placeholder="Rocket Merchant Secret"
                            />
                        </div>
                    </div>

                    <p className="text-xs text-slate-500">
                        Contact DBBL / Rocket merchant support for credentials.
                        Callback URL:{" "}
                        <span className="font-mono text-slate-300">
                            {window.location.origin}/payment/callback/rocket
                        </span>
                    </p>
                </MethodSection>

                <div className="flex justify-end">
                    <GamingButton
                        variant="primary"
                        size="lg"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : "Save Payment Settings"}
                    </GamingButton>
                </div>
            </div>
        </AdminLayout>
    );
}
