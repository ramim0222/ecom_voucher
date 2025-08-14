"use client";

import { useState, useEffect } from "react";
import { GamingButton } from "@/Components/ui/GamingButton";

export function CategoryModal({ isOpen, onClose, onSave, category }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || "",
                description: category.description || "",
            });
        } else {
            setFormData({
                name: "",
                description: "",
            });
        }
        setErrors({});
    }, [category, isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Category name is required";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Category name must be at least 2 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        onSave(formData);
        setFormData({ name: "", description: "" });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800/90 backdrop-blur-xl rounded-xl border border-slate-700 w-full max-w-md">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-heading font-bold text-xl text-white">
                            {category ? "Edit Category" : "Add New Category"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white transition-colors text-xl"
                        >
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Category Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full bg-slate-700/50 border rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                                    errors.name
                                        ? "border-red-500"
                                        : "border-slate-600"
                                }`}
                                placeholder="Enter category name"
                            />
                            {errors.name && (
                                <p className="text-red-400 text-sm mt-1">
                                    {errors.name}
                                </p>
                            )}
                            {formData.name && (
                                <p className="text-slate-400 text-sm mt-1">
                                    Slug:{" "}
                                    <code className="text-slate-300">
                                        {formData.name
                                            .toLowerCase()
                                            .replace(/\s+/g, "-")}
                                    </code>
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Description (Optional)
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors resize-none"
                                placeholder="Enter category description"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <GamingButton
                                type="button"
                                variant="ghost"
                                onClick={onClose}
                                className="flex-1 text-slate-300"
                            >
                                Cancel
                            </GamingButton>
                            <GamingButton
                                type="submit"
                                variant="accent"
                                className="flex-1"
                            >
                                {category
                                    ? "Update Category"
                                    : "Create Category"}
                            </GamingButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
