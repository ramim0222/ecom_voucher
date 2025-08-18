"use client";

import { GamingButton } from "@/Components/ui/GamingButton";

export function ReviewsTable({ reviews, onApprove, onReject, onDelete }) {
    const renderStars = (rating) => {
        const max = 5;
        return (
            <div className="flex items-center gap-0.5">
                {Array.from({ length: max }, (_, i) => (
                    <span
                        key={i}
                        className={
                            i < rating ? "text-yellow-400" : "text-slate-600"
                        }
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <>
            {/* Desktop/Tablet view */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-700">
                            <th className="text-left py-3 px-4 font-medium text-slate-300">
                                ID
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-slate-300">
                                Product
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-slate-300">
                                User
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-slate-300">
                                Rating
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-slate-300">
                                Comment
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-slate-300">
                                Status
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-slate-300">
                                Date
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-slate-300">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map((review) => (
                            <tr
                                key={review.id}
                                className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                            >
                                <td className="py-4 px-4 text-slate-300 whitespace-nowrap">
                                    #{review.id}
                                </td>
                                <td className="py-4 px-4">
                                    <div className="font-medium text-white break-words">
                                        {review.product}
                                    </div>
                                    <div className="text-slate-400 text-xs">
                                        SKU: {review.sku}
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="font-medium text-white break-words">
                                        {review.user}
                                    </div>
                                    <div className="text-slate-400 text-xs break-all">
                                        {review.email}
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    {renderStars(review.rating)}
                                </td>
                                <td className="py-4 px-4">
                                    <div
                                        className="text-slate-300 text-sm max-w-xs truncate"
                                        title={review.comment}
                                    >
                                        {review.comment}
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            review.status === "approved"
                                                ? "bg-green-500/20 text-green-300"
                                                : review.status === "pending"
                                                ? "bg-yellow-500/20 text-yellow-300"
                                                : "bg-red-500/20 text-red-300"
                                        }`}
                                    >
                                        {review.status === "approved"
                                            ? "Approved"
                                            : review.status === "pending"
                                            ? "Pending"
                                            : "Rejected"}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-slate-400 text-sm whitespace-nowrap">
                                    {new Date(
                                        review.created_at
                                    ).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-1">
                                        {review.status === "pending" && (
                                            <>
                                                <GamingButton
                                                    onClick={() =>
                                                        onApprove(review)
                                                    }
                                                    className="text-green-400 hover:text-green-300 transition-colors p-1"
                                                    variant="ghost"
                                                    title="Approve review"
                                                >
                                                    ✓
                                                </GamingButton>
                                                <GamingButton
                                                    onClick={() =>
                                                        onReject(review)
                                                    }
                                                    className="text-red-400 hover:text-red-300 transition-colors p-1"
                                                    variant="ghost"
                                                    title="Reject review"
                                                >
                                                    ✗
                                                </GamingButton>
                                            </>
                                        )}
                                        {review.status === "approved" && (
                                            <GamingButton
                                                onClick={() => onReject(review)}
                                                className="text-red-400 hover:text-red-300 transition-colors p-1"
                                                variant="ghost"
                                                title="Reject review"
                                            >
                                                ✗
                                            </GamingButton>
                                        )}
                                        {review.status === "rejected" && (
                                            <GamingButton
                                                onClick={() =>
                                                    onApprove(review)
                                                }
                                                className="text-green-400 hover:text-green-300 transition-colors p-1"
                                                variant="ghost"
                                                title="Approve review"
                                            >
                                                ✓
                                            </GamingButton>
                                        )}
                                        <GamingButton
                                            onClick={() => onDelete(review)}
                                            className="text-red-600 hover:text-red-500 transition-colors p-1"
                                            variant="ghost"
                                            title="Delete review"
                                        >
                                            🗑️
                                        </GamingButton>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile view - cards */}
            <div className="md:hidden space-y-3">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="border border-slate-700 rounded-lg p-4 bg-slate-800/40"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="text-slate-400 text-xs">
                                    #{review.id}
                                </div>
                                <div className="text-white font-medium leading-snug">
                                    {review.product}
                                </div>
                                <div className="text-slate-400 text-xs">
                                    SKU: {review.sku}
                                </div>
                            </div>
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    review.status === "approved"
                                        ? "bg-green-500/20 text-green-300"
                                        : review.status === "pending"
                                        ? "bg-yellow-500/20 text-yellow-300"
                                        : "bg-red-500/20 text-red-300"
                                }`}
                            >
                                {review.status === "approved"
                                    ? "Approved"
                                    : review.status === "pending"
                                    ? "Pending"
                                    : "Rejected"}
                            </span>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                            <div>
                                <div className="text-white text-sm">
                                    {review.user}
                                </div>
                                <div className="text-slate-400 text-xs break-all">
                                    {review.email}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center justify-end">
                                    {renderStars(review.rating)}
                                </div>
                                <div className="text-slate-400 text-xs mt-1 whitespace-nowrap">
                                    {new Date(
                                        review.created_at
                                    ).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        <p className="text-slate-300 text-sm mt-3">
                            {review.comment}
                        </p>

                        <div className="mt-3 flex items-center justify-end gap-1">
                            {review.status === "pending" && (
                                <>
                                    <GamingButton
                                        onClick={() => onApprove(review)}
                                        className="text-green-400 hover:text-green-300 transition-colors p-1"
                                        variant="ghost"
                                        title="Approve review"
                                    >
                                        ✓
                                    </GamingButton>
                                    <GamingButton
                                        onClick={() => onReject(review)}
                                        className="text-red-400 hover:text-red-300 transition-colors p-1"
                                        variant="ghost"
                                        title="Reject review"
                                    >
                                        ✗
                                    </GamingButton>
                                </>
                            )}
                            {review.status === "approved" && (
                                <GamingButton
                                    onClick={() => onReject(review)}
                                    className="text-red-400 hover:text-red-300 transition-colors p-1"
                                    variant="ghost"
                                    title="Reject review"
                                >
                                    ✗
                                </GamingButton>
                            )}
                            {review.status === "rejected" && (
                                <GamingButton
                                    onClick={() => onApprove(review)}
                                    className="text-green-400 hover:text-green-300 transition-colors p-1"
                                    variant="ghost"
                                    title="Approve review"
                                >
                                    ✓
                                </GamingButton>
                            )}
                            <GamingButton
                                variant="ghost"
                                className="text-red-600 hover:text-red-500 transition-colors p-1"
                                onClick={() => onDelete(review)}
                                title="Delete review"
                            >
                                🗑️
                            </GamingButton>
                        </div>
                    </div>
                ))}
                {reviews.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                        No reviews found
                    </div>
                )}
            </div>
        </>
    );
}
