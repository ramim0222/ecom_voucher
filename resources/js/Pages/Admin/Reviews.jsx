"use client";

import { useMemo, useState } from "react";
import { AdminLayout } from "@/Components/Admin/AdminLayout";
import { ReviewsTable } from "@/Components/Admin/ReviewsTable";
import { GamingButton } from "@/Components/ui/GamingButton";
import { DeleteConfirmModal } from "@/Components/Admin/DeleteConfirmModal";
import { router, usePage } from "@inertiajs/react";

export default function AdminReviewsPage({ reviews: initialReviews }) {
    const [reviews, setReviews] = useState(initialReviews || []);
    const { flash } = usePage().props;

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const itemsPerPage = 10;

    const filtered = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return reviews
            .filter((r) => {
                const matchesTerm =
                    r.product.toLowerCase().includes(term) ||
                    r.user.toLowerCase().includes(term) ||
                    r.email.toLowerCase().includes(term) ||
                    r.comment.toLowerCase().includes(term) ||
                    r.sku.toLowerCase().includes(term);
                const matchesStatus =
                    statusFilter === "all" ? true : r.status === statusFilter;
                return matchesTerm && matchesStatus;
            })
            .sort((a, b) => {
                // Sort by status: pending first, then approved, then rejected
                const statusOrder = { pending: 1, approved: 2, rejected: 3 };
                const statusDiff =
                    (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4);
                if (statusDiff !== 0) return statusDiff;

                // If status is the same, sort by creation date (newest first)
                return new Date(b.created_at) - new Date(a.created_at);
            });
    }, [reviews, searchTerm, statusFilter]);

    const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

    const handleApprove = (review) => {
        router.patch(
            route("admin.reviews.update-status", review.id),
            {
                status: "approved",
            },
            {
                onSuccess: () => {
                    setReviews((prev) =>
                        prev.map((r) =>
                            r.id === review.id
                                ? { ...r, status: "approved" }
                                : r
                        )
                    );
                },
            }
        );
    };

    const handleReject = (review) => {
        router.patch(
            route("admin.reviews.update-status", review.id),
            {
                status: "rejected",
            },
            {
                onSuccess: () => {
                    setReviews((prev) =>
                        prev.map((r) =>
                            r.id === review.id
                                ? { ...r, status: "rejected" }
                                : r
                        )
                    );
                },
            }
        );
    };

    const handleDelete = (review) => setDeleteTarget(review);
    const handleConfirmDelete = () => {
        if (!deleteTarget) return;
        router.delete(route("admin.reviews.destroy", deleteTarget.id), {
            onSuccess: () => {
                setReviews((prev) =>
                    prev.filter((r) => r.id !== deleteTarget.id)
                );
                setDeleteTarget(null);
            },
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Flash Messages */}
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
                            onClick={() => {
                                setSearchTerm("");
                                setStatusFilter("all");
                            }}
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
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
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
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white"
                            >
                                <option value="all">All</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="text-slate-400 text-sm">
                            {filtered.length} of {reviews.length} reviews
                        </div>
                    </div>

                    <ReviewsTable
                        reviews={paginated}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onDelete={handleDelete}
                    />

                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-6 border-t border-slate-700">
                            <div className="text-slate-400 text-sm">
                                Showing {startIndex + 1} to{" "}
                                {Math.min(
                                    startIndex + itemsPerPage,
                                    filtered.length
                                )}{" "}
                                of {filtered.length} results
                            </div>
                            <div className="flex items-center gap-2">
                                <GamingButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.max(1, p - 1)
                                        )
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
                                        setCurrentPage((p) =>
                                            Math.min(totalPages, p + 1)
                                        )
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
