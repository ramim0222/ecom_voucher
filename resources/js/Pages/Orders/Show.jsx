import { Head } from "@inertiajs/react";
import { Header } from "@/Components/Layout/Header";
import { GamingButton } from "@/Components/ui/GamingButton";
import { useState } from "react";

export default function OrderShow({ order }) {
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
            <Head title={`Order ${order.order_number}`} />
            <div className="min-h-screen">
                <Header />

                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="font-heading font-bold text-3xl md:text-4xl mb-2">
                                    Order Details
                                </h1>
                                <p className="text-muted-foreground">
                                    Order #{order.order_number}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                        order.status
                                    )}`}
                                >
                                    {order.status.charAt(0).toUpperCase() +
                                        order.status.slice(1)}
                                </span>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(
                                        order.payment_status
                                    )}`}
                                >
                                    Payment:{" "}
                                    {order.payment_status
                                        .charAt(0)
                                        .toUpperCase() +
                                        order.payment_status.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Order Items */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="glass-card rounded-xl p-6">
                                <h2 className="font-heading font-semibold text-xl mb-6">
                                    Order Items
                                </h2>

                                <div className="space-y-4">
                                    {order.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 border border-border rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <h4 className="font-medium">
                                                    {item.product_title}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Quantity: {item.quantity} ×
                                                    ${item.unit_price}
                                                </p>
                                                {item.assigned_codes &&
                                                    item.assigned_codes.length >
                                                        0 &&
                                                    (order.payment_status ===
                                                        "paid" ||
                                                        order.status ===
                                                            "completed") && (
                                                        <div className="mt-2">
                                                            <p className="text-sm font-medium text-green-600 mb-1">
                                                                Your Codes:
                                                            </p>
                                                            <div className="space-y-1">
                                                                {item.assigned_codes.map(
                                                                    (
                                                                        code,
                                                                        codeIndex
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                codeIndex
                                                                            }
                                                                            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded px-3 py-2 text-sm font-mono flex items-center justify-between"
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
                                                    )}
                                            </div>
                                            <div className="text-right">
                                                <span className="font-semibold">
                                                    ${item.total_price}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Customer Information */}
                            <div className="glass-card rounded-xl p-6">
                                <h2 className="font-heading font-semibold text-xl mb-6">
                                    Customer Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-medium mb-2">
                                            Contact Details
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {order.customer.name}
                                            <br />
                                            {order.customer.email}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium mb-2">
                                            Order Date
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(
                                                order.created_at
                                            ).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                        {order.payment_completed_at && (
                                            <div className="mt-2">
                                                <h3 className="font-medium mb-1">
                                                    Payment Date
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(
                                                        order.payment_completed_at
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="glass-card rounded-xl p-6 sticky top-24">
                                <h2 className="font-heading font-semibold text-xl mb-6">
                                    Order Summary
                                </h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>${order.subtotal}</span>
                                    </div>
                                    {order.discount_amount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount</span>
                                            <span>
                                                -${order.discount_amount}
                                            </span>
                                        </div>
                                    )}
                                    {order.tax_amount > 0 && (
                                        <div className="flex justify-between">
                                            <span>Tax</span>
                                            <span>${order.tax_amount}</span>
                                        </div>
                                    )}
                                    <hr className="border-border" />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-accent">
                                            ${order.total_amount}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <GamingButton
                                        variant="ghost"
                                        size="lg"
                                        className="w-full"
                                        onClick={() =>
                                            (window.location.href =
                                                route("dashboard"))
                                        }
                                    >
                                        ← Back to Dashboard
                                    </GamingButton>

                                    {order.status === "completed" && (
                                        <div className="text-center text-sm text-green-600">
                                            ✅ Order completed successfully!
                                        </div>
                                    )}

                                    {order.status === "pending" &&
                                        order.payment_status === "pending" && (
                                            <div className="text-center text-sm text-yellow-600">
                                                ⏳ Processing order...
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
