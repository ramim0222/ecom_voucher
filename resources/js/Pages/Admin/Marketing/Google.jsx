"use client";

import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { AdminLayout } from "@/Components/Admin/AdminLayout";
import { GamingButton } from "@/Components/ui/GamingButton";
import {
    formatValidationErrors,
    useToast,
} from "@/Components/Admin/ToastProvider";

const inputClassName =
    "w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500";

const labelClassName = "block text-sm font-medium text-slate-300 mb-2";

export default function Google({ googleSettings }) {
    const { addToast } = useToast();
    const [googleForm, setGoogleForm] = useState({
        analytics_script: googleSettings?.analytics_script || "",
        tag_manager_head_script: googleSettings?.tag_manager_head_script || "",
        tag_manager_body_script: googleSettings?.tag_manager_body_script || "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleGoogleChange = (event) => {
        const { name, value } = event.target;
        setGoogleForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmitGoogle = () => {
        setIsSubmitting(true);
        router.put(route("admin.settings.marketing.google.update"), googleForm, {
            onSuccess: () => setIsSubmitting(false),
            onError: (errors) => {
                addToast(formatValidationErrors(errors), "error");
                setIsSubmitting(false);
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Google Integration" />

            <div className="space-y-6 max-w-4xl">
                <div>
                    <Link
                        href={route("admin.settings")}
                        className="text-sm text-slate-400 hover:text-orange-400 transition-colors"
                    >
                        ← Back to Settings
                    </Link>
                    <h1 className="font-heading font-bold text-3xl text-white mt-2 mb-2">
                        Google Analytics & Tag Manager
                    </h1>
                    <p className="text-slate-400">
                        Configure your Google Analytics and Google Tag Manager
                        scripts for tracking.
                    </p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6 space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-white mb-4">
                            Google Analytics
                        </h2>
                        <label htmlFor="analytics_script" className={labelClassName}>
                            Google Analytics Integration
                        </label>
                        <textarea
                            id="analytics_script"
                            name="analytics_script"
                            value={googleForm.analytics_script}
                            onChange={handleGoogleChange}
                            rows={6}
                            placeholder="Paste your Google Analytics script here"
                            className={inputClassName}
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            Include the full script tag for Google Analytics 4
                        </p>
                    </div>

                    <div className="border-t border-slate-700 pt-6">
                        <h2 className="text-lg font-semibold text-white mb-4">
                            Google Tag Manager
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="tag_manager_head_script"
                                    className={labelClassName}
                                >
                                    GTM Head Script
                                </label>
                                <textarea
                                    id="tag_manager_head_script"
                                    name="tag_manager_head_script"
                                    value={googleForm.tag_manager_head_script}
                                    onChange={handleGoogleChange}
                                    rows={4}
                                    placeholder="Paste the GTM script for the <head> section"
                                    className={inputClassName}
                                />
                                <p className="text-xs text-slate-500 mt-2">
                                    This script goes in the &lt;head&gt; section
                                </p>
                            </div>
                            <div>
                                <label
                                    htmlFor="tag_manager_body_script"
                                    className={labelClassName}
                                >
                                    GTM Body Script
                                </label>
                                <textarea
                                    id="tag_manager_body_script"
                                    name="tag_manager_body_script"
                                    value={googleForm.tag_manager_body_script}
                                    onChange={handleGoogleChange}
                                    rows={4}
                                    placeholder="Paste the GTM noscript for after <body> tag"
                                    className={inputClassName}
                                />
                                <p className="text-xs text-slate-500 mt-2">
                                    This script goes immediately after the opening
                                    &lt;body&gt; tag
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-700 pt-6 flex justify-end">
                        <GamingButton
                            variant="primary"
                            onClick={handleSubmitGoogle}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save Google Settings"}
                        </GamingButton>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
