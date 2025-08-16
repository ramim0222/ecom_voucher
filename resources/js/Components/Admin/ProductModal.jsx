"use client";

import { useState, useEffect } from "react";
import { GamingButton } from "@/Components/ui/GamingButton";

export function ProductModal({ isOpen, onClose, product }) {
    const [formData, setFormData] = useState({
        title: "",
        platform: "",
        price: "",
        originalPrice: "",
        stock: "",
        description: "",
        status: "active",
        image: "",
    });

    useEffect(() => {
        if (product) {
            setFormData({
                title: product.title || "",
                platform: product.platform || "",
                price: product.price?.toString() || "",
                originalPrice: product.originalPrice?.toString() || "",
                stock: product.stock?.toString() || "",
                description: product.description || "",
                status: product.status || "active",
            });
        } else {
            setFormData({
                title: "",
                platform: "",
                price: "",
                originalPrice: "",
                stock: "",
                description: "",
                status: "active",
            });
        }
    }, [product]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        alert(product ? "Product updated!" : "Product created!");
        onClose();
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
                            value={formData.image}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    image: e.target.value,
                                })
                            }
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-300">
                                Platform
                            </label>
                            <select
                                value={formData.platform}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        platform: e.target.value,
                                    })
                                }
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            >
                                <option value="">Select Platform</option>
                                <option value="Steam">Steam</option>
                                <option value="PlayStation">PlayStation</option>
                                <option value="Xbox">Xbox</option>
                                <option value="Nintendo">Nintendo</option>
                                <option value="Epic Games">Epic Games</option>
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
                                value={formData.originalPrice}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        originalPrice: e.target.value,
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
                                value={formData.buyingPrice}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        buyingPrice: e.target.value,
                                    })
                                }
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        </div>
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
