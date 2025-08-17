"use client";

import { useState, useEffect } from "react";
import { GamingButton } from "@/Components/ui/GamingButton";
import { router } from "@inertiajs/react";

export default function ViewCodesModal({ isOpen, onClose, product }) {
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [stats, setStats] = useState({
        total_codes: 0,
        available_codes: 0,
        sold_codes: 0,
    });
    const [filter, setFilter] = useState("all"); // all, available, sold
    const [selectedCodes, setSelectedCodes] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(20); // Codes per page

    useEffect(() => {
        if (isOpen && product) {
            fetchCodes();
        }
    }, [isOpen, product]);

    const fetchCodes = async () => {
        if (!product?.id) return;

        setLoading(true);
        try {
            const response = await fetch(`/admin/products/${product.id}/codes`);
            const data = await response.json();
            setCodes(data.codes || []);
            setStats({
                total_codes: data.total_codes || 0,
                available_codes: data.available_codes || 0,
                sold_codes: data.sold_codes || 0,
            });
        } catch (error) {
            console.error("Failed to fetch codes:", error);
            alert("Failed to load codes. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setCodes([]);
        setStats({ total_codes: 0, available_codes: 0, sold_codes: 0 });
        setFilter("all");
        setSelectedCodes(new Set());
        setCurrentPage(1);
        onClose();
    };

    const filteredCodes = codes.filter((code) => {
        if (filter === "all") return true;
        return code.status === filter;
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredCodes.length / perPage);
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedCodes = filteredCodes.slice(startIndex, endIndex);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Selection functions
    const handleSelectCode = (codeId) => {
        const newSelected = new Set(selectedCodes);
        if (newSelected.has(codeId)) {
            newSelected.delete(codeId);
        } else {
            newSelected.add(codeId);
        }
        setSelectedCodes(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedCodes.size === paginatedCodes.length) {
            // If all current page codes are selected, deselect all
            setSelectedCodes(new Set());
        } else {
            // Select all codes on current page
            const allIds = new Set(paginatedCodes.map((code) => code.id));
            setSelectedCodes(allIds);
        }
    };

    const handleSelectAllFiltered = () => {
        if (selectedCodes.size === filteredCodes.length) {
            // If all filtered codes are selected, deselect all
            setSelectedCodes(new Set());
        } else {
            // Select all filtered codes
            const allIds = new Set(filteredCodes.map((code) => code.id));
            setSelectedCodes(allIds);
        }
    };

    // Delete functions
    const handleDeleteSelected = () => {
        if (selectedCodes.size === 0) return;

        if (
            !confirm(
                `Are you sure you want to delete ${selectedCodes.size} selected codes? This action cannot be undone.`
            )
        ) {
            return;
        }

        setDeleting(true);

        const payload = {
            code_ids: Array.from(selectedCodes),
        };

        console.log("Sending delete request:", payload);
        console.log("URL:", `/admin/products/${product.id}/codes/bulk-delete`);

        router.post(
            `/admin/products/${product.id}/codes/bulk-delete`,
            payload,
            {
                onSuccess: (response) => {
                    console.log("Delete successful:", response);
                    // Refresh codes and reset selection
                    fetchCodes();
                    setSelectedCodes(new Set());
                    setCurrentPage(1);
                    setDeleting(false);
                },
                onError: (errors) => {
                    console.error("Failed to delete codes:", errors);
                    console.error(
                        "Error details:",
                        JSON.stringify(errors, null, 2)
                    );
                    alert(`Failed to delete codes: ${JSON.stringify(errors)}`);
                    setDeleting(false);
                },
                onFinish: () => {
                    setDeleting(false);
                },
            }
        );
    };

    const handleDeleteAll = () => {
        const codesToDelete = filteredCodes.length;
        if (codesToDelete === 0) return;

        if (
            !confirm(
                `Are you sure you want to delete ALL ${codesToDelete} ${
                    filter === "all" ? "" : filter
                } codes? This action cannot be undone.`
            )
        ) {
            return;
        }

        setDeleting(true);

        const payload = {
            code_ids: filteredCodes.map((code) => code.id),
        };

        console.log("Sending delete all request:", payload);
        console.log("URL:", `/admin/products/${product.id}/codes/bulk-delete`);

        router.post(
            `/admin/products/${product.id}/codes/bulk-delete`,
            payload,
            {
                onSuccess: (response) => {
                    console.log("Delete all successful:", response);
                    // Refresh codes and reset selection
                    fetchCodes();
                    setSelectedCodes(new Set());
                    setCurrentPage(1);
                    setDeleting(false);
                },
                onError: (errors) => {
                    console.error("Failed to delete codes:", errors);
                    console.error(
                        "Error details:",
                        JSON.stringify(errors, null, 2)
                    );
                    alert(`Failed to delete codes: ${JSON.stringify(errors)}`);
                    setDeleting(false);
                },
                onFinish: () => {
                    setDeleting(false);
                },
            }
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-700">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <span className="text-blue-400 text-xl">📋</span>
                        </div>
                        <div>
                            <h2 className="font-heading font-bold text-xl text-white">
                                Product Codes
                            </h2>
                            <p className="text-slate-400 text-sm">
                                {product?.title || "Unknown Product"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-slate-400 hover:text-white text-xl transition-colors"
                    >
                        ×
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                        <div className="text-slate-400 text-sm mb-1">
                            Total Codes
                        </div>
                        <div className="text-white text-2xl font-bold">
                            {stats.total_codes}
                        </div>
                    </div>
                    <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                        <div className="text-green-400 text-sm mb-1">
                            Available
                        </div>
                        <div className="text-green-300 text-2xl font-bold">
                            {stats.available_codes}
                        </div>
                    </div>
                    <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20">
                        <div className="text-orange-400 text-sm mb-1">Sold</div>
                        <div className="text-orange-300 text-2xl font-bold">
                            {stats.sold_codes}
                        </div>
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => {
                            setFilter("all");
                            setCurrentPage(1);
                            setSelectedCodes(new Set());
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filter === "all"
                                ? "bg-orange-500 text-white"
                                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        }`}
                    >
                        All ({stats.total_codes})
                    </button>
                    <button
                        onClick={() => {
                            setFilter("available");
                            setCurrentPage(1);
                            setSelectedCodes(new Set());
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filter === "available"
                                ? "bg-green-500 text-white"
                                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        }`}
                    >
                        Available ({stats.available_codes})
                    </button>
                    <button
                        onClick={() => {
                            setFilter("sold");
                            setCurrentPage(1);
                            setSelectedCodes(new Set());
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filter === "sold"
                                ? "bg-orange-500 text-white"
                                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        }`}
                    >
                        Sold ({stats.sold_codes})
                    </button>
                </div>

                {/* Selection and Bulk Actions */}
                {filteredCodes.length > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleSelectAll}
                                    className="px-3 py-1 text-sm bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                                >
                                    {selectedCodes.size ===
                                    paginatedCodes.length
                                        ? "Deselect Page"
                                        : "Select Page"}
                                </button>
                                <button
                                    onClick={handleSelectAllFiltered}
                                    className="px-3 py-1 text-sm bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                                >
                                    {selectedCodes.size === filteredCodes.length
                                        ? "Deselect All"
                                        : "Select All"}
                                </button>
                            </div>
                            {selectedCodes.size > 0 && (
                                <span className="text-sm text-slate-300">
                                    {selectedCodes.size} selected
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {selectedCodes.size > 0 && (
                                <GamingButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleDeleteSelected}
                                    disabled={deleting}
                                    className="text-red-400 hover:text-red-300"
                                >
                                    {deleting
                                        ? "Deleting..."
                                        : `Delete Selected (${selectedCodes.size})`}
                                </GamingButton>
                            )}
                            <GamingButton
                                variant="ghost"
                                size="sm"
                                onClick={handleDeleteAll}
                                disabled={deleting}
                                className="text-red-400 hover:text-red-300"
                            >
                                {deleting
                                    ? "Deleting..."
                                    : `Delete All ${
                                          filter === "all" ? "" : filter
                                      } (${filteredCodes.length})`}
                            </GamingButton>
                        </div>
                    </div>
                )}

                {/* Codes Table */}
                <div className="bg-slate-700/30 rounded-lg border border-slate-600 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                            <span className="ml-3 text-slate-300">
                                Loading codes...
                            </span>
                        </div>
                    ) : filteredCodes.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            {filter === "all"
                                ? "No codes found for this product"
                                : `No ${filter} codes found`}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-600">
                                        <th className="text-left py-3 px-4 text-slate-400 font-medium w-12">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    paginatedCodes.length > 0 &&
                                                    selectedCodes.size ===
                                                        paginatedCodes.length
                                                }
                                                onChange={handleSelectAll}
                                                className="rounded bg-slate-700 border-slate-600 text-orange-500 focus:ring-orange-500"
                                            />
                                        </th>
                                        <th className="text-left py-3 px-4 text-slate-400 font-medium">
                                            Code
                                        </th>
                                        <th className="text-left py-3 px-4 text-slate-400 font-medium">
                                            Status
                                        </th>
                                        <th className="text-left py-3 px-4 text-slate-400 font-medium">
                                            Created
                                        </th>
                                        <th className="text-left py-3 px-4 text-slate-400 font-medium">
                                            Updated
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedCodes.map((code) => (
                                        <tr
                                            key={code.id}
                                            className={`border-b border-slate-600/50 hover:bg-slate-700/30 ${
                                                selectedCodes.has(code.id)
                                                    ? "bg-orange-500/10"
                                                    : ""
                                            }`}
                                        >
                                            <td className="py-3 px-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCodes.has(
                                                        code.id
                                                    )}
                                                    onChange={() =>
                                                        handleSelectCode(
                                                            code.id
                                                        )
                                                    }
                                                    className="rounded bg-slate-700 border-slate-600 text-orange-500 focus:ring-orange-500"
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <code className="bg-slate-700 px-2 py-1 rounded text-sm font-mono text-slate-200">
                                                    {code.code}
                                                </code>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        code.status ===
                                                        "available"
                                                            ? "text-green-400 bg-green-400/20"
                                                            : "text-orange-400 bg-orange-400/20"
                                                    }`}
                                                >
                                                    {code.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-slate-300 text-sm">
                                                {formatDate(code.created_at)}
                                            </td>
                                            <td className="py-3 px-4 text-slate-300 text-sm">
                                                {formatDate(code.updated_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 px-4">
                        <div className="text-sm text-slate-400">
                            Showing {startIndex + 1}-
                            {Math.min(endIndex, filteredCodes.length)} of{" "}
                            {filteredCodes.length} codes
                        </div>
                        <div className="flex items-center gap-2">
                            <GamingButton
                                variant="ghost"
                                size="sm"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </GamingButton>
                            <div className="flex items-center gap-1">
                                {Array.from(
                                    { length: Math.min(5, totalPages) },
                                    (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (
                                            currentPage >=
                                            totalPages - 2
                                        ) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() =>
                                                    setCurrentPage(pageNum)
                                                }
                                                className={`px-3 py-1 text-sm rounded transition-colors ${
                                                    currentPage === pageNum
                                                        ? "bg-orange-500 text-white"
                                                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                            <GamingButton
                                variant="ghost"
                                size="sm"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </GamingButton>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 mt-6 border-t border-slate-700">
                    <GamingButton
                        variant="ghost"
                        onClick={handleClose}
                        className="flex-1 text-slate-300"
                    >
                        Close
                    </GamingButton>
                    <GamingButton
                        variant="secondary"
                        onClick={fetchCodes}
                        disabled={loading}
                        className="flex-1"
                    >
                        {loading ? "Refreshing..." : "Refresh"}
                    </GamingButton>
                </div>
            </div>
        </div>
    );
}
