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

export default function Tiktok({ tiktokSettings }) {
    const { addToast } = useToast();
    const [tiktokForm, setTiktokForm] = useState({
        pixel_script: tiktokSettings?.pixel_script || "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleTiktokChange = (event) => {
        const { name, value } = event.target;
        setTiktokForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmitTiktok = () => {
        setIsSubmitting(true);
        router.put(route("admin.settings.marketing.tiktok.update"), tiktokForm, {
            onSuccess: () => setIsSubmitting(false),
            onError: (errors) => {
                addToast(formatValidationErrors(errors), "error");
                setIsSubmitting(false);
            },
        });
    };

    return (
        <AdminLayout>
            <PageHead title="TikTok Integration" />

            <div className="space-y-6 max-w-4xl">
                <div>
                    <Link
                        href={route("admin.settings")}
                        className="text-sm text-slate-400 hover:text-orange-400 transition-colors"
                    >
                        ← Back to Settings
                    </Link>
                    <h1 className="font-heading font-bold text-3xl text-white mt-2 mb-2">
                        TikTok Pixel
                    </h1>
                    <p className="text-slate-400">
                        Configure your TikTok Pixel script for conversion tracking
                        and audience building.
                    </p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6 space-y-4">
                    <div>
                        <label htmlFor="pixel_script" className={labelClassName}>
                            TikTok Pixel Script
                        </label>
                        <textarea
                            id="pixel_script"
                            name="pixel_script"
                            value={tiktokForm.pixel_script}
                            onChange={handleTiktokChange}
                            rows={10}
                            placeholder="Paste your TikTok Pixel script here"
                            className={inputClassName}
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            Include the complete script tag provided by TikTok
                            Business Center
                        </p>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-300 mb-2">
                            Script Format
                        </h3>
                        <p className="text-sm text-blue-200/80">
                            Paste your TikTok Pixel tracking code starting with
                            the comment and including the full script tag. You
                            can get this from your TikTok Ads Manager &gt; Events
                            &gt; Pixel &gt; Track Conversions.
                        </p>
                    </div>

                    <div className="border-t border-slate-700 pt-6 flex justify-end">
                        <GamingButton
                            variant="primary"
                            onClick={handleSubmitTiktok}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save TikTok Settings"}
                        </GamingButton>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
