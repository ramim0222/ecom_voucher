"use client";

import { GamingButton } from "@/Components/ui/GamingButton";

export function ProductsTable({
    products = [],
    onEdit,
    onAddCode,
    onDelete,
    onViewCodes,
}) {
    return (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-700">
                            <th className="text-left py-3 text-slate-400 font-medium">
                                Image
                            </th>
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
                        {products.map((product) => {
                            const price = Number(product.price);
                            const originalPrice = Number(
                                product.original_price
                            );
                            const hasDiscount =
                                !Number.isNaN(originalPrice) &&
                                !Number.isNaN(price) &&
                                originalPrice > price;

                            return (
                            <tr
                                key={product.id}
                                className="border-b border-slate-700/50"
                            >
                                <td className="py-3">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-700">
                                        {product.product_image ? (
                                            <img
                                                src={`/storage/${product.product_image}`}
                                                alt={product.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <svg
                                                    className="w-6 h-6"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-white font-medium">
                                            {product.title}
                                        </p>
                                        {product.is_featured && (
                                            <span className="bg-accent/20 text-accent px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap">
                                                ⭐ Featured
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3 text-slate-300">
                                    {product.category?.name || "No Category"}
                                </td>
                                <td className="py-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-medium">
                                            Tk{" "}
                                            {Number.isNaN(price)
                                                ? product.price
                                                : price.toFixed(2)}
                                        </span>
                                        {hasDiscount && (
                                            <span className="text-slate-400 line-through text-sm">
                                                Tk {originalPrice.toFixed(2)}
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
                                    <div className="flex gap-2 flex-wrap">
                                        <GamingButton
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onAddCode(product)}
                                        >
                                            ➕
                                        </GamingButton>
                                        <GamingButton
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onViewCodes(product)}
                                        >
                                            🔍
                                        </GamingButton>
                                        <GamingButton
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(product)}
                                        >
                                            ✏️
                                        </GamingButton>
                                        <GamingButton
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDelete(product.id)}
                                        >
                                            🗑️
                                        </GamingButton>
                                    </div>
                                </td>
                            </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
