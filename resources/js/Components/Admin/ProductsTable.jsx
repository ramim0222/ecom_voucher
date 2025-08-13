"use client";

import { useState } from "react";
import { GamingButton } from "@/Components/ui/GamingButton";

export function ProductsTable({ onEdit }) {
    const [products] = useState([
        {
            id: 1,
            title: "Steam Wallet $50",
            platform: "Steam",
            price: 45.99,
            originalPrice: 50.0,
            stock: 100,
            status: "active",
        },
        {
            id: 2,
            title: "PlayStation Store $25",
            platform: "PlayStation",
            price: 22.99,
            originalPrice: 25.0,
            stock: 75,
            status: "active",
        },
        {
            id: 3,
            title: "Xbox Game Pass 3 Months",
            platform: "Xbox",
            price: 29.99,
            originalPrice: 35.99,
            stock: 50,
            status: "active",
        },
        {
            id: 4,
            title: "Nintendo eShop $20",
            platform: "Nintendo",
            price: 18.99,
            originalPrice: 20.0,
            stock: 0,
            status: "inactive",
        },
    ]);

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this product?")) {
            // Handle delete
            alert("Product deleted!");
        }
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-700">
                            <th className="text-left py-3 text-slate-400 font-medium">
                                Product
                            </th>
                            <th className="text-left py-3 text-slate-400 font-medium">
                                Platform
                            </th>
                            <th className="text-left py-3 text-slate-400 font-medium">
                                Price
                            </th>
                            <th className="text-left py-3 text-slate-400 font-medium">
                                Stock
                            </th>
                            <th className="text-left py-3 text-slate-400 font-medium">
                                Status
                            </th>
                            <th className="text-left py-3 text-slate-400 font-medium">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr
                                key={product.id}
                                className="border-b border-slate-700/50"
                            >
                                <td className="py-3">
                                    <div>
                                        <p className="text-white font-medium">
                                            {product.title}
                                        </p>
                                    </div>
                                </td>
                                <td className="py-3 text-slate-300">
                                    {product.platform}
                                </td>
                                <td className="py-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-medium">
                                            ${product.price}
                                        </span>
                                        {product.originalPrice >
                                            product.price && (
                                            <span className="text-slate-400 line-through text-sm">
                                                ${product.originalPrice}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3">
                                    <span
                                        className={
                                            product.stock > 0
                                                ? "text-white"
                                                : "text-red-400"
                                        }
                                    >
                                        {product.stock}
                                    </span>
                                </td>
                                <td className="py-3">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            product.status === "active"
                                                ? "text-green-400 bg-green-400/20"
                                                : "text-red-400 bg-red-400/20"
                                        }`}
                                    >
                                        {product.status}
                                    </span>
                                </td>
                                <td className="py-3">
                                    <div className="flex gap-2">
                                        <GamingButton
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(product)}
                                        >
                                            Edit
                                        </GamingButton>
                                        <GamingButton
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                handleDelete(product.id)
                                            }
                                        >
                                            Delete
                                        </GamingButton>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
