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
                                        src={item.image || "/placeholder.svg"}
                                        alt={item.name}
                                        className="w-12 h-12 rounded-lg object-cover bg-slate-700"
                                    />
                                    <div>
                                        <div className="font-medium text-white">
                                            {item.name}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                <code className="bg-slate-700/50 px-2 py-1 rounded text-sm text-slate-300">
                                    {item.sku}
                                </code>
                            </td>
                            <td className="py-4 px-4 text-white">
                                ${item.price.toFixed(2)}
                            </td>
                            <td className="py-4 px-4 text-slate-300">
                                {item.quantity}
                            </td>
                            <td className="py-4 px-4 text-white font-medium">
                                ${item.subtotal.toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
