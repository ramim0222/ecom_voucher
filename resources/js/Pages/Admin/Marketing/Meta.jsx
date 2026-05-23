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

export default function Meta({ metaSettings }) {
    const { addToast } = useToast();
    const [metaForm, setMetaForm] = useState({
        dataset_id: metaSettings?.dataset_id || "",
        pixel_id: metaSettings?.pixel_id || "",
        access_token: metaSettings?.access_token || "",
        catalog: metaSettings?.catalog || "",
        test_event_code: metaSettings?.test_event_code || "",
        browser_tracking_enabled: !!metaSettings?.browser_tracking_enabled,
        server_tracking_enabled: !!metaSettings?.server_tracking_enabled,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleMetaChange = (event) => {
        const { name, value, type, checked } = event.target;
        setMetaForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmitMeta = () => {
        setIsSubmitting(true);
        router.put(route("admin.settings.marketing.meta.update"), metaForm, {
            onSuccess: () => setIsSubmitting(false),
            onError: (errors) => {
                addToast(formatValidationErrors(errors), "error");
                setIsSubmitting(false);
            },
        });
    };

    return (
        <AdminLayout>
            <PageHead title="Meta Integration" />

            <div className="space-y-6 max-w-4xl">
                <div>
                    <Link
                        href={route("admin.settings")}
                        className="text-sm text-slate-400 hover:text-orange-400 transition-colors"
                    >
                        ← Back to Settings
                    </Link>
                    <h1 className="font-heading font-bold text-3xl text-white mt-2 mb-2">
                        Meta (Facebook) Conversion API
                    </h1>
                    <p className="text-slate-400">
                        Configure your Facebook Conversion API settings for
                        server-side tracking.
                    </p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="dataset_id" className={labelClassName}>
                                Dataset ID (Pixel ID)
                            </label>
                            <input
                                id="dataset_id"
                                type="text"
                                name="dataset_id"
                                value={metaForm.dataset_id}
                                onChange={handleMetaChange}
                                placeholder="Enter your Meta Pixel ID"
                                className={inputClassName}
                            />
                        </div>
                        <div>
                            <label htmlFor="pixel_id" className={labelClassName}>
                                Pixel ID (optional)
                            </label>
                            <input
                                id="pixel_id"
                                type="text"
                                name="pixel_id"
                                value={metaForm.pixel_id}
                                onChange={handleMetaChange}
                                placeholder="Additional pixel ID if needed"
                                className={inputClassName}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="access_token" className={labelClassName}>
                            Access Token
                        </label>
                        <textarea
                            id="access_token"
                            name="access_token"
                            value={metaForm.access_token}
                            onChange={handleMetaChange}
                            rows={3}
                            placeholder="Paste your Facebook access token here"
                            className={inputClassName}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="catalog" className={labelClassName}>
                                Catalog
                            </label>
                            <input
                                id="catalog"
                                type="text"
                                name="catalog"
                                value={metaForm.catalog}
                                onChange={handleMetaChange}
                                placeholder="Your product catalog ID"
                                className={inputClassName}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="test_event_code"
                                className={labelClassName}
                            >
                                Test Event Code
                            </label>
                            <input
                                id="test_event_code"
                                type="text"
                                name="test_event_code"
                                value={metaForm.test_event_code}
                                onChange={handleMetaChange}
                                placeholder="Test event code for debugging"
                                className={inputClassName}
                            />
                        </div>
                    </div>

                    <div className="border-t border-slate-700 pt-6">
                        <h2 className="text-lg font-semibold text-white mb-4">
                            Tracking Options
                        </h2>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="browser_tracking_enabled"
                                        checked={metaForm.browser_tracking_enabled}
                                        onChange={handleMetaChange}
                                        className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-orange-500 focus:ring-orange-500"
                                    />
                                    <span className="text-sm text-slate-300">
                                        Browser Side Tracking
                                    </span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="server_tracking_enabled"
                                        checked={metaForm.server_tracking_enabled}
                                        onChange={handleMetaChange}
                                        className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-orange-500 focus:ring-orange-500"
                                    />
                                    <span className="text-sm text-slate-300">
                                        Server Side Tracking
                                    </span>
                                </label>
                            </div>
                            <GamingButton
                                variant="primary"
                                onClick={handleSubmitMeta}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Saving..." : "Save Meta Settings"}
                            </GamingButton>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
