"use client";

import { useState, useEffect, useRef } from "react";
import { GamingButton } from "@/Components/ui/GamingButton";

export function CategoryModal({ isOpen, onClose, onSave, category }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "active",
        logo: null,
    });
    const [errors, setErrors] = useState({});
    const [logoPreview, setLogoPreview] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || "",
                description: category.description || "",
                status: category.status || "active",
                logo: null,
            });
            setLogoPreview(category.logo ? `/storage/${category.logo}` : null);
        } else {
            setFormData({
                name: "",
                description: "",
                status: "active",
                logo: null,
            });
            setLogoPreview(null);
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (2MB max)
            if (file.size > 2 * 1024 * 1024) {
                setErrors({
                    ...errors,
                    logo: "Logo file size must be less than 2MB",
                });
                return;
            }

            // Validate file type
            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/jpg",
                "image/gif",
                "image/svg+xml",
            ];
            if (!allowedTypes.includes(file.type)) {
                setErrors({
                    ...errors,
                    logo: "Logo must be a valid image file (JPEG, PNG, JPG, GIF, SVG)",
                });
                return;
            }

            setFormData({ ...formData, logo: file });

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target.result);
            };
            reader.readAsDataURL(file);

            // Clear any existing logo error
            if (errors.logo) {
                setErrors({ ...errors, logo: "" });
            }
        }
    };

    const handleRemoveLogo = () => {
        setFormData({ ...formData, logo: null });
        setLogoPreview(category?.logo ? `/storage/${category.logo}` : null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
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
        setFormData({
            name: "",
            description: "",
            status: "active",
            logo: null,
        });
        setLogoPreview(null);
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

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Logo (Optional)
                            </label>

                            {logoPreview && (
                                <div className="mb-3 relative inline-block">
                                    <img
                                        src={logoPreview}
                                        alt="Logo preview"
                                        className="w-20 h-20 object-cover rounded-lg border-2 border-slate-600"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveLogo}
                                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-500 file:text-white hover:file:bg-orange-600 transition-colors"
                            />
                            {errors.logo && (
                                <p className="text-red-400 text-sm mt-1">
                                    {errors.logo}
                                </p>
                            )}
                            <p className="text-slate-400 text-xs mt-2">
                                Supported formats: JPEG, PNG, JPG, GIF, SVG. Max
                                size: 2MB
                            </p>
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
