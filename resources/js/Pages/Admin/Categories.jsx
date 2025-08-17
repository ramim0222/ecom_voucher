"use client";

import { useState } from "react";
import { AdminLayout } from "@/Components/Admin/AdminLayout";
import { GamingButton } from "@/Components/ui/GamingButton";
import { CategoriesTable } from "@/Components/Admin/CategoriesTable";
import { CategoryModal } from "@/Components/Admin/CategoryModal";
import { DeleteConfirmModal } from "@/Components/Admin/DeleteConfirmModal";
import { router } from "@inertiajs/react";

export default function AdminCategoriesPage({ categories }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter categories based on search
    const filteredCategories = categories.filter(
        (category) =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (category.description &&
                category.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()))
    );

    // Pagination
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCategories = filteredCategories.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handleAddCategory = () => {
        setSelectedCategory(null);
        setIsModalOpen(true);
    };

    const handleEditCategory = (category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const handleDeleteCategory = (category) => {
        setSelectedCategory(category);
        setIsDeleteModalOpen(true);
    };

    const handleSaveCategory = (categoryData) => {
        const formData = new FormData();
        formData.append("name", categoryData.name);
        formData.append("description", categoryData.description || "");
        formData.append("status", categoryData.status || "active");

        if (categoryData.logo) {
            formData.append("logo", categoryData.logo);
        }

        if (selectedCategory) {
            // Edit existing category
            formData.append("_method", "PUT");
            router.post(
                route("admin.categories.update", selectedCategory.id),
                formData,
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        setSelectedCategory(null);
                    },
                    onError: (errors) => {
                        console.error("Update failed:", errors);
                    },
                }
            );
        } else {
            // Add new category
            router.post(route("admin.categories.store"), formData, {
                onSuccess: () => {
                    setIsModalOpen(false);
                },
                onError: (errors) => {
                    console.error("Creation failed:", errors);
                },
            });
        }
    };

    const handleConfirmDelete = () => {
        router.delete(route("admin.categories.destroy", selectedCategory.id), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedCategory(null);
            },
            onError: (errors) => {
                console.error("Deletion failed:", errors);
            },
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="font-heading font-bold text-2xl text-white">
                            Categories Management
                        </h1>
                        <p className="text-slate-400 mt-1">
                            Manage product categories and organization
                        </p>
                    </div>
                    <GamingButton variant="accent" onClick={handleAddCategory}>
                        <span className="mr-2">+</span>
                        Add New Category
                    </GamingButton>
                </div>

                {/* Search and Stats */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="relative flex-1 max-w-md">
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 pl-10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <span className="absolute left-3 top-2.5 text-slate-400">
                                🔍
                            </span>
                        </div>
                        <div className="text-slate-400 text-sm">
                            {filteredCategories.length} of {categories.length}{" "}
                            categories
                        </div>
                    </div>

                    {/* Categories Table */}
                    <CategoriesTable
                        categories={paginatedCategories}
                        onEdit={handleEditCategory}
                        onDelete={handleDeleteCategory}
                    />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-700">
                            <div className="text-slate-400 text-sm">
                                Showing {startIndex + 1} to{" "}
                                {Math.min(
                                    startIndex + itemsPerPage,
                                    filteredCategories.length
                                )}{" "}
                                of {filteredCategories.length} results
                            </div>
                            <div className="flex items-center gap-2">
                                <GamingButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        setCurrentPage(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                    className="text-slate-300"
                                >
                                    Previous
                                </GamingButton>
                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1
                                ).map((page) => (
                                    <GamingButton
                                        key={page}
                                        variant={
                                            currentPage === page
                                                ? "accent"
                                                : "ghost"
                                        }
                                        size="sm"
                                        onClick={() => setCurrentPage(page)}
                                        className={
                                            currentPage === page
                                                ? ""
                                                : "text-slate-300"
                                        }
                                    >
                                        {page}
                                    </GamingButton>
                                ))}
                                <GamingButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        setCurrentPage(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                    className="text-slate-300"
                                >
                                    Next
                                </GamingButton>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Category Modal */}
            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveCategory}
                category={selectedCategory}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Category"
                message={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone and may affect ${selectedCategory?.productCount} products.`}
            />
        </AdminLayout>
    );
}
