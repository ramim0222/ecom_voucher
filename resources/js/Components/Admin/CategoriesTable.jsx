"use client";

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
                            Slug
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-300">
                            Products
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-300">
                            Date Created
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
                                <code className="bg-slate-700/50 px-2 py-1 rounded text-sm text-slate-300">
                                    {category.slug}
                                </code>
                            </td>
                            <td className="py-4 px-4">
                                <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full text-sm">
                                    {category.productCount} items
                                </span>
                            </td>
                            <td className="py-4 px-4 text-slate-300">
                                {new Date(
                                    category.dateCreated
                                ).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onEdit(category)}
                                        className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                                        title="Edit category"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => onDelete(category)}
                                        className="text-red-400 hover:text-red-300 transition-colors p-1"
                                        title="Delete category"
                                    >
                                        🗑️
                                    </button>
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
