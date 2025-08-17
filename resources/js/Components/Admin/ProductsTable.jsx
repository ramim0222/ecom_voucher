"use client";

import { useState } from "react";
import { GamingButton } from "@/Components/ui/GamingButton";

export function ProductsTable({ products = [], onEdit, onAddCode, onDelete }) {
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
                                Category
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
                                    {product.category?.name || "No Category"}
                                </td>
                                <td className="py-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-medium">
                                            ${product.price}
                                        </span>
                                        {product.original_price &&
                                            product.original_price >
                                                product.price && (
                                                <span className="text-slate-400 line-through text-sm">
                                                    ${product.original_price}
                                                </span>
                                            )}
                                    </div>
                                </td>
                                <td className="py-3">
                                    <span
                                        className={
                                            product.total_codes -
                                                product.sold_codes >
                                            0
                                                ? "text-white"
                                                : "text-red-400"
                                        }
                                    >
                                        {product.total_codes -
                                            product.sold_codes}{" "}
                                        / {product.total_codes}
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
                                            onClick={() => onAddCode(product)}
                                        >
                                            Add code
                                        </GamingButton>
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
                                            onClick={() => onDelete(product.id)}
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
