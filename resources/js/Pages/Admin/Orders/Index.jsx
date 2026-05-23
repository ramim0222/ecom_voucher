import { useState } from "react";
import { router } from "@inertiajs/react";
import { AdminLayout } from "@/Components/Admin/AdminLayout";
import { PageHead } from "@/Components/PageHead";
import { GamingButton } from "@/Components/ui/GamingButton";

export default function AdminOrders({ orders = { data: [] }, filters = {} }) {
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

    const applyFilters = (newFilters) => {
        setLoading(true);
        setCurrentFilters(newFilters);

        router.get(route("admin.orders.index"), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onFinish: () => setLoading(false),
        });
    };

    const handleFilterChange = (filterName, value) => {
        applyFilters({ ...currentFilters, [filterName]: value });
    };

    const handleSearchChange = (value) => {
        applyFilters({ ...currentFilters, search: value });
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

    const getCustomerDisplay = (order) => {
        if (order.user) {
            return {
                name: `${order.user.first_name} ${order.user.last_name}`.trim(),
                email: order.user.email,
                isGuest: false,
            };
        }

        const billing = order.billing_address || {};
        const name =
            `${billing.first_name || ""} ${billing.last_name || ""}`.trim();

        return {
            name: name || "Guest",
            email: billing.email || "—",
            isGuest: true,
        };
    };

    return (
        <AdminLayout>
            <PageHead title="Orders Management" />
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

                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
                        <div className="relative flex-1 max-w-md">
                            <input
                                type="text"
                                placeholder="Search by order ID, name, or email..."
                                value={currentFilters.search}
                                onChange={(e) =>
                                    handleSearchChange(e.target.value)
                                }
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 pl-10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <span className="absolute left-3 top-2.5 text-slate-400">
                                🔍
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <select
                                value={currentFilters.status}
                                onChange={(e) =>
                                    handleFilterChange("status", e.target.value)
                                }
                                className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                {filterOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={currentFilters.payment_status}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "payment_status",
                                        e.target.value
                                    )
                                }
                                className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                {paymentFilterOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="text-slate-400 text-sm whitespace-nowrap">
                            {orders.total ?? 0} orders
                        </div>
                    </div>

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
                                    orders.data.map((order) => {
                                        const customer =
                                            getCustomerDisplay(order);

                                        return (
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
                                                        {customer.name}
                                                        {customer.isGuest && (
                                                            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium text-slate-300 bg-slate-600/50">
                                                                Guest
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="text-slate-400 text-sm">
                                                        {customer.email}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-3 text-slate-300">
                                                {order.order_items?.length || 0}
                                            </td>
                                            <td className="py-3 text-white font-medium">
                                                Tk{" "}
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
                                        );
                                    })
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

                    {orders.links && orders.links.length > 1 && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-6 border-t border-slate-700">
                            <div className="text-slate-400 text-sm">
                                {orders.from && orders.to && orders.total ? (
                                    <>
                                        Showing {orders.from} to {orders.to} of{" "}
                                        {orders.total} orders
                                    </>
                                ) : null}
                            </div>
                            <div className="flex items-center justify-center gap-2 flex-wrap">
                                {orders.prev_page_url && (
                                    <GamingButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            router.visit(orders.prev_page_url, {
                                                preserveState: true,
                                                preserveScroll: true,
                                            })
                                        }
                                        className="text-slate-300"
                                    >
                                        Previous
                                    </GamingButton>
                                )}

                                {orders.links.map((link, index) => {
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
                                                link.active ? "primary" : "ghost"
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

                                {orders.next_page_url && (
                                    <GamingButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            router.visit(orders.next_page_url, {
                                                preserveState: true,
                                                preserveScroll: true,
                                            })
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
        </AdminLayout>
    );
}
