"use client";

import { useState } from "react";
import { AdminLayout } from "@/Components/Admin/AdminLayout";
import { ReviewsTable } from "@/Components/Admin/ReviewsTable";
import { GamingButton } from "@/Components/ui/GamingButton";
import { DeleteConfirmModal } from "@/Components/Admin/DeleteConfirmModal";
import { router, usePage } from "@inertiajs/react";

export default function AdminReviewsPage({
    reviews = { data: [] },
    filters = {},
}) {
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "all");
    const [deleteTarget, setDeleteTarget] = useState(null);

    const applyFilters = (newFilters) => {
        router.get(route("admin.reviews"), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        applyFilters({ search: value, status: statusFilter });
    };

    const handleStatusChange = (value) => {
        setStatusFilter(value);
        applyFilters({ search: searchTerm, status: value });
    };

    const handleResetFilters = () => {
        setSearchTerm("");
        setStatusFilter("all");
        applyFilters({ search: "", status: "all" });
    };

    const handleApprove = (review) => {
        router.patch(
            route("admin.reviews.update-status", review.id),
            { status: "approved" },
            { preserveScroll: true }
        );
    };

    const handleReject = (review) => {
        router.patch(
            route("admin.reviews.update-status", review.id),
            { status: "rejected" },
            { preserveScroll: true }
        );
    };

    const handleDelete = (review) => setDeleteTarget(review);

    const handleConfirmDelete = () => {
        if (!deleteTarget) return;

        router.delete(route("admin.reviews.destroy", deleteTarget.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {flash?.success && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
                        {flash.error}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="font-heading font-bold text-2xl text-white">
                            Reviews Management
                        </h1>
                        <p className="text-slate-400 mt-1">
                            Approve, reject, or delete customer reviews
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <GamingButton
                            variant="ghost"
                            className="text-slate-300"
                            onClick={handleResetFilters}
                        >
                            Reset Filters
                        </GamingButton>
                    </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div className="relative flex-1 max-w-xl">
                            <input
                                type="text"
                                placeholder="Search by product, user, email, comment, SKU..."
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
                        <div className="flex items-center gap-3">
                            <label className="text-slate-300 text-sm">
                                Status
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    handleStatusChange(e.target.value)
                                }
                                className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="all">All</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="text-slate-400 text-sm">
                            {reviews.total ?? 0} reviews
                        </div>
                    </div>

                    <ReviewsTable
                        reviews={reviews.data ?? []}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onDelete={handleDelete}
                    />

                    {reviews.links && reviews.links.length > 1 && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-6 border-t border-slate-700">
                            <div className="text-slate-400 text-sm">
                                {reviews.from &&
                                reviews.to &&
                                reviews.total ? (
                                    <>
                                        Showing {reviews.from} to {reviews.to}{" "}
                                        of {reviews.total} reviews
                                    </>
                                ) : null}
                            </div>
                            <div className="flex items-center justify-center gap-2 flex-wrap">
                                {reviews.prev_page_url && (
                                    <GamingButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            router.visit(
                                                reviews.prev_page_url,
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

                                {reviews.links.map((link, index) => {
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

                                {reviews.next_page_url && (
                                    <GamingButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            router.visit(
                                                reviews.next_page_url,
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

            <DeleteConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Review"
                message={`Are you sure you want to delete the review from "${deleteTarget?.user}" for "${deleteTarget?.product}"? This cannot be undone.`}
            />
        </AdminLayout>
    );
}
