"use client";

import { GamingButton } from "../ui/GamingButton";

export function CategoriesTable({ categories, onEdit, onDelete }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 font-medium text-slate-300">
                            ID
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-300">
                            Name
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-300">
                            Description
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-300">
                            Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-300">
                            Logo
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-300">
                            Created
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-300">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr
                            key={category.id}
                            className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                        >
                            <td className="py-4 px-4 text-slate-300">
                                #{category.id}
                            </td>
                            <td className="py-4 px-4">
                                <div className="font-medium text-white">
                                    {category.name}
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                <div className="text-slate-300 text-sm max-w-xs truncate">
                                    {category.description || "No description"}
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                <span
                                    className={`px-2 py-1 rounded-full text-sm ${
                                        category.status === "active"
                                            ? "bg-green-500/20 text-green-300"
                                            : "bg-gray-500/20 text-gray-300"
                                    }`}
                                >
                                    {category.status}
                                </span>
                            </td>
                            <td className="py-4 px-4 text-slate-300">
                                {category.logo ? (
                                    <img
                                        src={`/storage/${category.logo}`}
                                        alt={category.name}
                                        className="w-10 h-10 rounded-lg object-cover border border-slate-600"
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center border border-slate-600">
                                        <span className="text-slate-400 text-xs">
                                            No logo
                                        </span>
                                    </div>
                                )}
                            </td>
                            <td className="py-4 px-4 text-slate-400 text-sm">
                                {new Date(
                                    category.created_at
                                ).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                    <GamingButton
                                        onClick={() => onEdit(category)}
                                        className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                                        variant="ghost"
                                        title="Edit category"
                                    >
                                        ✏️
                                    </GamingButton>
                                    <GamingButton
                                        onClick={() => onDelete(category)}
                                        className="text-red-400 hover:text-red-300 transition-colors p-1"
                                        title="Delete category"
                                        variant="ghost"
                                    >
                                        🗑️
                                    </GamingButton>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {categories.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-slate-400 text-lg mb-2">
                        No categories found
                    </div>
                    <p className="text-slate-500 text-sm">
                        Try adjusting your search criteria
                    </p>
                </div>
            )}
        </div>
    );
}
