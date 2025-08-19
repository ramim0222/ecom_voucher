import { useState } from "react";
import { router } from "@inertiajs/react";
import { AdminLayout } from "@/Components/Admin/AdminLayout";
import { GamingButton } from "@/Components/ui/GamingButton";

export default function AdminOrders({ orders, filters = {} }) {
    const [currentFilters, setCurrentFilters] = useState({
        status: filters.status || "",
        payment_status: filters.payment_status || "",
        search: filters.search || "",
    });

    const [loading, setLoading] = useState(false);

    const filterOptions = [
        { value: "", label: "All Orders" },
        { value: "pending", label: "Pending" },
        { value: "processing", label: "Processing" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
        { value: "refunded", label: "Refunded" },
    ];

    const paymentFilterOptions = [
        { value: "", label: "All Payments" },
        { value: "pending", label: "Pending" },
        { value: "paid", label: "Paid" },
        { value: "failed", label: "Failed" },
        { value: "refunded", label: "Refunded" },
    ];

    const handleFilterChange = (filterName, value) => {
        setLoading(true);
        const newFilters = { ...currentFilters, [filterName]: value };
        setCurrentFilters(newFilters);

        router.get(route("admin.orders.index"), newFilters, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        router.get(route("admin.orders.index"), currentFilters, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "text-green-400 bg-green-400/20";
            case "processing":
                return "text-yellow-400 bg-yellow-400/20";
            case "pending":
                return "text-blue-400 bg-blue-400/20";
            case "cancelled":
                return "text-red-400 bg-red-400/20";
            case "refunded":
                return "text-purple-400 bg-purple-400/20";
            default:
                return "text-slate-400 bg-slate-400/20";
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case "paid":
                return "text-green-400 bg-green-400/20";
            case "pending":
                return "text-yellow-400 bg-yellow-400/20";
            case "failed":
                return "text-red-400 bg-red-400/20";
            case "refunded":
                return "text-purple-400 bg-purple-400/20";
            default:
                return "text-slate-400 bg-slate-400/20";
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="font-heading font-bold text-3xl mb-2 text-white">
                            Orders Management
                        </h1>
                        <p className="text-slate-400">
                            Monitor and manage customer orders
                        </p>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
                    {loading && (
                        <div className="text-center py-4">
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-orange-500 border-t-transparent"></div>
                            <span className="ml-2 text-slate-400">
                                Loading...
                            </span>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="text-left py-3 text-slate-400 font-medium">
                                        Order ID
                                    </th>
                                    <th className="text-left py-3 text-slate-400 font-medium">
                                        Customer
                                    </th>
                                    <th className="text-left py-3 text-slate-400 font-medium">
                                        Items
                                    </th>
                                    <th className="text-left py-3 text-slate-400 font-medium">
                                        Total
                                    </th>
                                    <th className="text-left py-3 text-slate-400 font-medium">
                                        Status
                                    </th>
                                    <th className="text-left py-3 text-slate-400 font-medium">
                                        Payment
                                    </th>
                                    <th className="text-left py-3 text-slate-400 font-medium">
                                        Date
                                    </th>
                                    <th className="text-left py-3 text-slate-400 font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.data && orders.data.length > 0 ? (
                                    orders.data.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                                        >
                                            <td className="py-3 text-white font-medium">
                                                {order.order_number}
                                            </td>
                                            <td className="py-3">
                                                <div>
                                                    <p className="text-white">
                                                        {order.user.first_name}{" "}
                                                        {order.user.last_name}
                                                    </p>
                                                    <p className="text-slate-400 text-sm">
                                                        {order.user.email}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-3 text-slate-300">
                                                {order.order_items?.length || 0}
                                            </td>
                                            <td className="py-3 text-white font-medium">
                                                $
                                                {parseFloat(
                                                    order.total_amount || 0
                                                ).toFixed(2)}
                                            </td>
                                            <td className="py-3">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                        order.status
                                                    )}`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                                                        order.payment_status
                                                    )}`}
                                                >
                                                    {order.payment_status}
                                                </span>
                                            </td>
                                            <td className="py-3 text-slate-400">
                                                {new Date(
                                                    order.created_at
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="py-3">
                                                <GamingButton
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        router.visit(
                                                            route(
                                                                "admin.orders.show",
                                                                order.id
                                                            )
                                                        )
                                                    }
                                                >
                                                    View Details
                                                </GamingButton>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="py-8 text-center text-slate-400"
                                        >
                                            No orders found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {orders.links && orders.links.length > 1 && (
                        <div className="mt-6 flex items-center justify-center gap-2">
                            {/* Previous Page */}
                            {orders.prev_page_url && (
                                <button
                                    onClick={() => {
                                        router.visit(orders.prev_page_url, {
                                            preserveState: true,
                                            preserveScroll: true,
                                        });
                                    }}
                                    className="px-3 py-2 rounded text-sm bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
                                >
                                    ← Previous
                                </button>
                            )}

                            {/* Page Numbers */}
                            {orders.links.map((link, index) => {
                                // Skip the "Previous" and "Next" links, only show page numbers
                                if (
                                    link.label === "&laquo; Previous" ||
                                    link.label === "Next &raquo;"
                                ) {
                                    return null;
                                }

                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (link.url) {
                                                router.visit(link.url, {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                });
                                            }
                                        }}
                                        disabled={!link.url}
                                        className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                                            link.active
                                                ? "bg-orange-500 text-white"
                                                : link.url
                                                ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                                : "bg-slate-800 text-slate-500 cursor-not-allowed"
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                );
                            })}

                            {/* Next Page */}
                            {orders.next_page_url && (
                                <button
                                    onClick={() => {
                                        router.visit(orders.next_page_url, {
                                            preserveState: true,
                                            preserveScroll: true,
                                        });
                                    }}
                                    className="px-3 py-2 rounded text-sm bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
                                >
                                    Next →
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
