"use client";

import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { PageHead } from "@/Components/PageHead";
import { Plus, Trash2 } from "lucide-react";
import { AdminLayout } from "@/Components/Admin/AdminLayout";
import { GamingButton } from "@/Components/ui/GamingButton";
import {
    formatValidationErrors,
    useToast,
} from "@/Components/Admin/ToastProvider";

const inputClassName =
    "w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500";

const labelClassName = "block text-sm font-medium text-slate-300 mb-2";

export default function AdminFaqPage({ pageSettings = {} }) {
    const { addToast } = useToast();
    const [form, setForm] = useState({
        title: pageSettings.title || "Frequently Asked Questions",
        subtitle: pageSettings.subtitle || "",
        items: pageSettings.items?.length
            ? pageSettings.items
            : [{ question: "", answer: "" }],
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const updateItem = (index, field, value) => {
        setForm((prev) => {
            const items = [...prev.items];
            items[index] = { ...items[index], [field]: value };
            return { ...prev, items };
        });
    };

    const addItem = () => {
        setForm((prev) => ({
            ...prev,
            items: [...prev.items, { question: "", answer: "" }],
        }));
    };

    const removeItem = (index) => {
        setForm((prev) => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        setErrors({});

        router.put(route("admin.settings.content.faq.update"), form, {
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
            <PageHead title="FAQ Settings" />

            <div className="space-y-6 max-w-4xl">
                <div>
                    <Link
                        href={route("admin.settings")}
                        className="text-sm text-slate-400 hover:text-orange-400 transition-colors"
                    >
                        ← Back to Settings
                    </Link>
                    <h1 className="font-heading font-bold text-3xl text-white mt-2 mb-2">
                        FAQ Page
                    </h1>
                    <p className="text-slate-400">
                        Manage the questions and answers shown on the public FAQ
                        page.
                    </p>
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

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">
                                Questions & Answers
                            </h3>
                            <button
                                type="button"
                                onClick={addItem}
                                className="inline-flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Question
                            </button>
                        </div>

                        {form.items.map((item, index) => (
                            <div
                                key={index}
                                className="rounded-lg border border-slate-700 bg-slate-900/30 p-4 space-y-3"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-slate-300">
                                        Item {index + 1}
                                    </p>
                                    {form.items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="text-red-400 hover:text-red-300 transition-colors"
                                            aria-label={`Remove item ${index + 1}`}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <div>
                                    <label className={labelClassName}>
                                        Question
                                    </label>
                                    <input
                                        type="text"
                                        value={item.question}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                "question",
                                                e.target.value
                                            )
                                        }
                                        className={inputClassName}
                                    />
                                    {errors[`items.${index}.question`] && (
                                        <p className="text-xs text-red-400 mt-1">
                                            {errors[`items.${index}.question`]}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className={labelClassName}>
                                        Answer
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={item.answer}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                "answer",
                                                e.target.value
                                            )
                                        }
                                        className={inputClassName}
                                    />
                                    {errors[`items.${index}.answer`] && (
                                        <p className="text-xs text-red-400 mt-1">
                                            {errors[`items.${index}.answer`]}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end pt-2">
                        <GamingButton
                            variant="primary"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save FAQ Page"}
                        </GamingButton>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
