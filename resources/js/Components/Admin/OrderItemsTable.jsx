"use client";

export function OrderItemsTable({ items }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 font-medium text-slate-300">
                            Product
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-300">
                            SKU
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-300">
                            Price
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-300">
                            Quantity
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-300">
                            Subtotal
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr
                            key={item.id}
                            className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                        >
                            <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={
                                            item.product_image ||
                                            "/placeholder.svg"
                                        }
                                        alt={item.product_title}
                                        className="w-12 h-12 rounded-lg object-cover bg-slate-700"
                                    />
                                    <div>
                                        <div className="font-medium text-white">
                                            {item.product_title}
                                        </div>
                                        {item.category && (
                                            <div className="text-xs text-slate-400">
                                                {item.category}
                                            </div>
                                        )}
                                        {item.assigned_codes &&
                                            item.assigned_codes.length > 0 && (
                                                <div className="mt-2">
                                                    <div className="text-xs text-green-400 mb-1">
                                                        ✓{" "}
                                                        {
                                                            item.assigned_codes
                                                                .length
                                                        }{" "}
                                                        codes assigned
                                                    </div>
                                                    <div className="space-y-1">
                                                        {item.assigned_codes.map(
                                                            (
                                                                code,
                                                                codeIndex
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        codeIndex
                                                                    }
                                                                    className="bg-green-900/20 border border-green-700 rounded px-2 py-1 text-xs font-mono text-green-300 flex items-center justify-between"
                                                                >
                                                                    <span className="select-all">
                                                                        {code}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => {
                                                                            navigator.clipboard.writeText(
                                                                                code
                                                                            );
                                                                        }}
                                                                        className="ml-2 px-1 py-0.5 text-xs bg-green-600 hover:bg-green-500 text-white rounded transition-colors flex items-center gap-1"
                                                                        title="Copy code"
                                                                    >
                                                                        <svg
                                                                            className="w-2.5 h-2.5"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={
                                                                                    2
                                                                                }
                                                                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                                            />
                                                                        </svg>
                                                                        Copy
                                                                    </button>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                <code className="bg-slate-700/50 px-2 py-1 rounded text-sm text-slate-300">
                                    {item.sku}
                                </code>
                            </td>
                            <td className="py-4 px-4 text-white">
                                ${parseFloat(item.unit_price || 0).toFixed(2)}
                            </td>
                            <td className="py-4 px-4 text-slate-300">
                                {item.quantity || 0}
                            </td>
                            <td className="py-4 px-4 text-white font-medium">
                                ${parseFloat(item.total_price || 0).toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
