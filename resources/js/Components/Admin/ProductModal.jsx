"use client";

import { useState, useEffect } from "react";
import { GamingButton } from "@/Components/ui/GamingButton";

export function ProductModal({
    isOpen,
    onClose,
    product,
    categories = [],
    onSave,
}) {
    const [formData, setFormData] = useState({
        title: "",
        category_id: "",
        price: "",
        original_price: "",
        buying_price: "",
        description: "",
        features: "",
        status: "active",
        is_featured: false,
        sort_order: "",
        product_image: null,
    });

    useEffect(() => {
        if (product) {
            setFormData({
                title: product.title || "",
                category_id: product.category_id?.toString() || "",
                price: product.price?.toString() || "",
                original_price: product.original_price?.toString() || "",
                buying_price: product.buying_price?.toString() || "",
                description: product.description || "",
                features: Array.isArray(product.features)
                    ? product.features.join("\n")
                    : "",
                status: product.status || "active",
                is_featured: product.is_featured || false,
                sort_order: product.sort_order?.toString() || "",
                product_image: null,
            });
        } else {
            setFormData({
                title: "",
                category_id: "",
                price: "",
                original_price: "",
                buying_price: "",
                description: "",
                features: "",
                status: "active",
                is_featured: false,
                sort_order: "",
                product_image: null,
            });
        }
    }, [product]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Convert features string to array
        const featuresArray = formData.features
            .split("\n")
            .map((feature) => feature.trim())
            .filter((feature) => feature.length > 0);

        // Pass the processed form data to the parent component
        onSave({
            ...formData,
            features: featuresArray,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-700">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-heading font-bold text-xl text-white">
                        {product ? "Edit Product" : "Add New Product"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white text-xl"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-300">
                            Product Title
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                })
                            }
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-300">
                            Product Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    product_image: e.target.files[0],
                                })
                            }
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-300">
                                Category
                            </label>
                            <select
                                value={formData.category_id}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        category_id: e.target.value,
                                    })
                                }
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-300">
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        status: e.target.value,
                                    })
                                }
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-300">
                                Price
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        price: e.target.value,
                                    })
                                }
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-300">
                                Original Price
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.original_price}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        original_price: e.target.value,
                                    })
                                }
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-300">
                                Buying Price
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.buying_price}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        buying_price: e.target.value,
                                    })
                                }
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-300">
                            Sort Order
                        </label>
                        <input
                            type="number"
                            value={formData.sort_order}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    sort_order: e.target.value,
                                })
                            }
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-300">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            rows={4}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-300">
                            Features{" "}
                            <span className="text-slate-500">
                                (one per line)
                            </span>
                        </label>
                        <textarea
                            value={formData.features}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    features: e.target.value,
                                })
                            }
                            rows={4}
                            placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-slate-300">
                            <input
                                type="checkbox"
                                checked={formData.is_featured}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        is_featured: e.target.checked,
                                    })
                                }
                                className="rounded bg-slate-700 border-slate-600 text-orange-500 focus:ring-orange-500"
                            />
                            Featured Product
                        </label>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <GamingButton
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="flex-1"
                        >
                            {product ? "Update Product" : "Create Product"}
                        </GamingButton>
                        <GamingButton
                            type="button"
                            variant="ghost"
                            size="lg"
                            onClick={onClose}
                        >
                            Cancel
                        </GamingButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
