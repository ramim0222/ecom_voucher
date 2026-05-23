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

const pageMeta = {
    refund: {
        heading: "Refund & Cancellation Policy",
        description:
            "Edit the refund and cancellation policy shown on the storefront.",
        updateRoute: "admin.settings.content.refund.update",
    },
    privacy: {
        heading: "Privacy Policy",
        description:
            "Edit the privacy policy shown on the storefront.",
        updateRoute: "admin.settings.content.privacy.update",
    },
    terms: {
        heading: "Terms & Conditions",
        description:
            "Edit the terms and conditions shown on the storefront.",
        updateRoute: "admin.settings.content.terms.update",
    },
};

export default function AdminPolicyPage({ pageKey, pageSettings = {} }) {
    const meta = pageMeta[pageKey] || pageMeta.refund;
    const { addToast } = useToast();
    const [form, setForm] = useState({
        title: pageSettings.title || meta.heading,
        subtitle: pageSettings.subtitle || "",
        content: pageSettings.content || "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        setErrors({});

        router.put(route(meta.updateRoute), form, {
            onSuccess: () => setIsSubmitting(false),
            onError: (validationErrors) => {
                setErrors(validationErrors || {});
                addToast(formatValidationErrors(validationErrors), "error");
                setIsSubmitting(false);
            },
        });
    };

    return (
        <AdminLayout>
            <PageHead title={`${meta.heading} Settings`} />

            <div className="space-y-6 max-w-4xl">
                <div>
                    <Link
                        href={route("admin.settings")}
                        className="text-sm text-slate-400 hover:text-orange-400 transition-colors"
                    >
                        ← Back to Settings
                    </Link>
                    <h1 className="font-heading font-bold text-3xl text-white mt-2 mb-2">
                        {meta.heading}
                    </h1>
                    <p className="text-slate-400">{meta.description}</p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6 space-y-6">
                    <div>
                        <label htmlFor="title" className={labelClassName}>
                            Page Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={form.title}
                            onChange={(e) => updateField("title", e.target.value)}
                            className={inputClassName}
                        />
                        {errors.title && (
                            <p className="text-xs text-red-400 mt-1">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="subtitle" className={labelClassName}>
                            Page Subtitle
                        </label>
                        <textarea
                            id="subtitle"
                            rows={2}
                            value={form.subtitle}
                            onChange={(e) =>
                                updateField("subtitle", e.target.value)
                            }
                            className={inputClassName}
                        />
                        {errors.subtitle && (
                            <p className="text-xs text-red-400 mt-1">
                                {errors.subtitle}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="content" className={labelClassName}>
                            Page Content
                        </label>
                        <p className="text-xs text-slate-500 mb-2">
                            Use blank lines between paragraphs. Short single-line
                            blocks are rendered as section headings.
                        </p>
                        <textarea
                            id="content"
                            rows={16}
                            value={form.content}
                            onChange={(e) =>
                                updateField("content", e.target.value)
                            }
                            className={inputClassName}
                        />
                        {errors.content && (
                            <p className="text-xs text-red-400 mt-1">
                                {errors.content}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end pt-2">
                        <GamingButton
                            variant="primary"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save Page"}
                        </GamingButton>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
