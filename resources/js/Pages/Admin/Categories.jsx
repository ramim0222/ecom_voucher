"use client";

import { useState } from "react";
import { AdminLayout } from "@/Components/Admin/AdminLayout";
import { GamingButton } from "@/Components/ui/GamingButton";
import { CategoriesTable } from "@/Components/Admin/CategoriesTable";
import { CategoryModal } from "@/Components/Admin/CategoryModal";
import { DeleteConfirmModal } from "@/Components/Admin/DeleteConfirmModal";
import { router } from "@inertiajs/react";
import {
    formatValidationErrors,
    useToast,
} from "@/Components/Admin/ToastProvider";

export default function AdminCategoriesPage({
    categories = { data: [] },
    filters = {},
}) {
    const { addToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || "");

    const handleSearchChange = (value) => {
        setSearchTerm(value);

        router.get(
            route("admin.categories.index"),
            { search: value },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

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
                        addToast(formatValidationErrors(errors), "error");
                    },
                }
            );
        } else {
            router.post(route("admin.categories.store"), formData, {
                onSuccess: () => {
                    setIsModalOpen(false);
                },
                onError: (errors) => {
                    addToast(formatValidationErrors(errors), "error");
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
                addToast(formatValidationErrors(errors), "error");
            },
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
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

                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="relative flex-1 max-w-md">
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) =>
                                    handleSearchChange(e.target.value)
                                }
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 pl-10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <span className="absolute left-3 top-2.5 text-slate-400">
                                🔍
                            </span>
                        </div>
                        <div className="text-slate-400 text-sm">
                            {categories.total ?? 0} categories
                        </div>
                    </div>

                    <CategoriesTable
                        categories={categories.data ?? []}
                        onEdit={handleEditCategory}
                        onDelete={handleDeleteCategory}
                    />

                    {categories.links && categories.links.length > 1 && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-6 border-t border-slate-700">
                            <div className="text-slate-400 text-sm">
                                {categories.from &&
                                categories.to &&
                                categories.total ? (
                                    <>
                                        Showing {categories.from} to{" "}
                                        {categories.to} of {categories.total}{" "}
                                        results
                                    </>
                                ) : null}
                            </div>
                            <div className="flex items-center justify-center gap-2 flex-wrap">
                                {categories.prev_page_url && (
                                    <GamingButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            router.visit(
                                                categories.prev_page_url,
                                                {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                }
                                            )
                                        }
                                        className="text-slate-300"
                                    >
                                        Previous
                                    </GamingButton>
                                )}

                                {categories.links.map((link, index) => {
                                    if (
                                        link.label === "&laquo; Previous" ||
                                        link.label === "Next &raquo;"
                                    ) {
                                        return null;
                                    }

                                    return (
                                        <GamingButton
                                            key={index}
                                            variant={
                                                link.active ? "accent" : "ghost"
                                            }
                                            size="sm"
                                            onClick={() => {
                                                if (link.url) {
                                                    router.visit(link.url, {
                                                        preserveState: true,
                                                        preserveScroll: true,
                                                    });
                                                }
                                            }}
                                            disabled={!link.url}
                                            className={
                                                link.active
                                                    ? ""
                                                    : "text-slate-300"
                                            }
                                        >
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        </GamingButton>
                                    );
                                })}

                                {categories.next_page_url && (
                                    <GamingButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            router.visit(
                                                categories.next_page_url,
                                                {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                }
                                            )
                                        }
                                        className="text-slate-300"
                                    >
                                        Next
                                    </GamingButton>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveCategory}
                category={selectedCategory}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Category"
                message={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone and may affect ${selectedCategory?.products_count ?? 0} products.`}
            />
        </AdminLayout>
    );
}
