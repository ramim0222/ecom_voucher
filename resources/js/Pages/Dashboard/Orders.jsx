"use client";

import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { Header } from "@/Components/Layout/Header";
import { DashboardLayout } from "@/Components/Dashboard/DashboardLayout";
import { GamingButton } from "@/Components/ui/GamingButton";

export default function OrdersPage({ orders = { data: [] } }) {
    const [filter, setFilter] = useState("all");
    const [copiedCode, setCopiedCode] = useState(null);

    const copyToClipboard = async (code) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCode(code);
            setTimeout(() => setCopiedCode(null), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    };

    const filteredOrders = orders.data
        ? orders.data.filter((order) => {
              if (filter === "all") return true;
              return order.status === filter;
          })
        : [];

    const filterOptions = [
        { value: "all", label: "All Orders" },
        { value: "completed", label: "Completed" },
        { value: "processing", label: "Processing" },
        { value: "pending", label: "Pending" },
        { value: "cancelled", label: "Cancelled" },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "text-green-600 bg-green-100 dark:bg-green-900/20";
            case "processing":
                return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
            case "pending":
                return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
            case "cancelled":
                return "text-red-600 bg-red-100 dark:bg-red-900/20";
            default:
                return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case "paid":
                return "text-green-600 bg-green-100 dark:bg-green-900/20";
            case "pending":
                return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
            case "failed":
                return "text-red-600 bg-red-100 dark:bg-red-900/20";
            default:
                return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
        }
    };

    return (
        <>
            <Head title="Order History" />
            <div className="min-h-screen">
                <Header />
                <DashboardLayout>
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2">
                                    Order History
                                </h1>
                                <p className="text-muted-foreground">
                                    Track and manage all your voucher purchases
                                </p>
                            </div>

                            <div className="flex gap-2">
                                {filterOptions.map((option) => (
                                    <GamingButton
                                        key={option.value}
                                        variant={
                                            filter === option.value
                                                ? "primary"
                                                : "ghost"
                                        }
                                        size="sm"
                                        onClick={() => setFilter(option.value)}
                                    >
                                        {option.label}
                                    </GamingButton>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card rounded-xl p-6">
                            <div className="space-y-4">
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="glass-card rounded-xl p-6 hover:shadow-lg transition-shadow"
                                        >
                                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                                {/* Order Info */}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-4 mb-2">
                                                        <h3 className="font-heading font-semibold text-lg">
                                                            Order #
                                                            {order.order_number}
                                                        </h3>
                                                        <div className="flex gap-2">
                                                            <span
                                                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                                    order.status
                                                                )}`}
                                                            >
                                                                {order.status
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                    order.status.slice(
                                                                        1
                                                                    )}
                                                            </span>
                                                            <span
                                                                className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                                                                    order.payment_status
                                                                )}`}
                                                            >
                                                                {order.payment_status
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                    order.payment_status.slice(
                                                                        1
                                                                    )}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="text-sm text-muted-foreground mb-3">
                                                        Placed on{" "}
                                                        {new Date(
                                                            order.created_at
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            }
                                                        )}
                                                    </div>

                                                    {/* Order Items Preview */}
                                                    <div className="space-y-2">
                                                        {order.order_items
                                                            .slice(0, 2)
                                                            .map(
                                                                (
                                                                    item,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="flex items-center justify-between text-sm"
                                                                    >
                                                                        <div>
                                                                            <span className="font-medium">
                                                                                {
                                                                                    item
                                                                                        .product
                                                                                        .title
                                                                                }
                                                                            </span>
                                                                            <span className="text-muted-foreground">
                                                                                {" "}
                                                                                ×{" "}
                                                                                {
                                                                                    item.quantity
                                                                                }
                                                                            </span>
                                                                            {item.actual_codes &&
                                                                                item
                                                                                    .actual_codes
                                                                                    .length >
                                                                                    0 && (
                                                                                    <span className="ml-2 text-green-600 text-xs">
                                                                                        ✓
                                                                                        Codes
                                                                                        Delivered
                                                                                    </span>
                                                                                )}
                                                                        </div>
                                                                        <span className="font-medium">
                                                                            $
                                                                            {
                                                                                item.total_price
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                )
                                                            )}
                                                        {order.order_items
                                                            .length > 2 && (
                                                            <div className="text-sm text-muted-foreground">
                                                                +
                                                                {order
                                                                    .order_items
                                                                    .length -
                                                                    2}{" "}
                                                                more item(s)
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Show codes if order is completed */}
                                                    {order.status ===
                                                        "completed" && (
                                                        <div className="mt-4">
                                                            <h4 className="text-sm font-medium text-green-600 mb-2">
                                                                Your Voucher
                                                                Codes:
                                                            </h4>
                                                            <div className="space-y-2">
                                                                {order.order_items.map(
                                                                    (
                                                                        item,
                                                                        itemIndex
                                                                    ) => {
                                                                        return item.actual_codes &&
                                                                            Array.isArray(
                                                                                item.actual_codes
                                                                            ) &&
                                                                            item
                                                                                .actual_codes
                                                                                .length >
                                                                                0 ? (
                                                                            <div
                                                                                key={
                                                                                    itemIndex
                                                                                }
                                                                                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3"
                                                                            >
                                                                                <div className="text-sm font-medium mb-1">
                                                                                    {
                                                                                        item
                                                                                            .product
                                                                                            .title
                                                                                    }
                                                                                </div>
                                                                                <div className="grid grid-cols-1 gap-2">
                                                                                    {item.actual_codes.map(
                                                                                        (
                                                                                            code,
                                                                                            codeIndex
                                                                                        ) => (
                                                                                            <div
                                                                                                key={
                                                                                                    codeIndex
                                                                                                }
                                                                                                className="bg-white dark:bg-gray-800 border border-green-300 dark:border-green-700 rounded px-3 py-2 text-sm font-mono flex items-center justify-between"
                                                                                            >
                                                                                                <span className="select-all">
                                                                                                    {
                                                                                                        code
                                                                                                    }
                                                                                                </span>
                                                                                                <button
                                                                                                    onClick={() =>
                                                                                                        copyToClipboard(
                                                                                                            code
                                                                                                        )
                                                                                                    }
                                                                                                    className="ml-2 px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors flex items-center gap-1"
                                                                                                    title="Copy code"
                                                                                                >
                                                                                                    {copiedCode ===
                                                                                                    code ? (
                                                                                                        <>
                                                                                                            <svg
                                                                                                                className="w-3 h-3"
                                                                                                                fill="currentColor"
                                                                                                                viewBox="0 0 20 20"
                                                                                                            >
                                                                                                                <path
                                                                                                                    fillRule="evenodd"
                                                                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                                                                    clipRule="evenodd"
                                                                                                                />
                                                                                                            </svg>
                                                                                                            Copied
                                                                                                        </>
                                                                                                    ) : (
                                                                                                        <>
                                                                                                            <svg
                                                                                                                className="w-3 h-3"
                                                                                                                fill="none"
                                                                                                                stroke="currentColor"
                                                                                                                viewBox="0 0 24 24"
                                                                                                            >
                                                                                                                <path
                                                                                                                    strokeLinecap="round"
                                                                                                                    strokeLinejoin="round"
                                                                                                                    strokeWidth={
                                                                                                                        2
                                                                                                                    }
                                                                                                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                                                                                />
                                                                                                            </svg>
                                                                                                            Copy
                                                                                                        </>
                                                                                                    )}
                                                                                                </button>
                                                                                            </div>
                                                                                        )
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        ) : item.assigned_codes ===
                                                                          null ? (
                                                                            <div
                                                                                key={
                                                                                    itemIndex
                                                                                }
                                                                                className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3"
                                                                            >
                                                                                <div className="text-sm font-medium mb-1">
                                                                                    {
                                                                                        item
                                                                                            .product
                                                                                            .title
                                                                                    }
                                                                                </div>
                                                                                <div className="text-sm text-yellow-600">
                                                                                    No
                                                                                    codes
                                                                                    available
                                                                                    for
                                                                                    this
                                                                                    product
                                                                                    at
                                                                                    the
                                                                                    time
                                                                                    of
                                                                                    purchase.
                                                                                </div>
                                                                            </div>
                                                                        ) : null;
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Order Total & Actions */}
                                                <div className="text-right">
                                                    <div className="mb-4">
                                                        <div className="text-2xl font-bold text-accent">
                                                            $
                                                            {order.total_amount}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {order.order_items.reduce(
                                                                (sum, item) =>
                                                                    sum +
                                                                    item.quantity,
                                                                0
                                                            )}{" "}
                                                            item(s)
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Link
                                                            href={route(
                                                                "orders.show",
                                                                order.id
                                                            )}
                                                        >
                                                            <GamingButton
                                                                variant="primary"
                                                                size="sm"
                                                                className="w-full lg:w-auto"
                                                            >
                                                                View Details
                                                            </GamingButton>
                                                        </Link>

                                                        {order.status ===
                                                            "pending" && (
                                                            <GamingButton
                                                                variant="ghost"
                                                                size="sm"
                                                                className="w-full lg:w-auto text-red-600 hover:text-red-700"
                                                                onClick={() => {
                                                                    if (
                                                                        confirm(
                                                                            "Are you sure you want to cancel this order?"
                                                                        )
                                                                    ) {
                                                                        // Handle order cancellation
                                                                        window.location.href =
                                                                            route(
                                                                                "orders.cancel",
                                                                                order.id
                                                                            );
                                                                    }
                                                                }}
                                                            >
                                                                Cancel Order
                                                            </GamingButton>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="text-6xl mb-4">📦</div>
                                        <h3 className="font-heading font-semibold text-xl mb-2">
                                            No orders found
                                        </h3>
                                        <p className="text-muted-foreground mb-6">
                                            {filter === "all"
                                                ? "You haven't placed any orders yet."
                                                : `No ${filter} orders found.`}
                                        </p>
                                        <GamingButton
                                            variant="primary"
                                            onClick={() =>
                                                (window.location.href =
                                                    "/products")
                                            }
                                        >
                                            Start Shopping
                                        </GamingButton>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {orders.links && orders.links.length > 3 && (
                                <div className="flex justify-center mt-8">
                                    <div className="flex gap-2">
                                        {orders.links.map((link, index) => {
                                            if (link.url === null) {
                                                return (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-2 text-gray-400 cursor-not-allowed"
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                );
                                            }

                                            return (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    className={`px-3 py-2 rounded ${
                                                        link.active
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-muted hover:bg-muted/80"
                                                    }`}
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </DashboardLayout>
            </div>
        </>
    );
}
