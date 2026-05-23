import { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import { AdminLayout } from "@/Components/Admin/AdminLayout";
import { PageHead } from "@/Components/PageHead";
import { GamingButton } from "@/Components/ui/GamingButton";
import { OrderItemsTable } from "@/Components/Admin/OrderItemsTable";
import { ConfirmModal } from "@/Components/Admin/ConfirmModal";

const CANCELLABLE_STATUSES = ["pending", "processing"];

export default function AdminOrderDetailsPage({ order }) {
    const { flash } = usePage().props;
    const [loading, setLoading] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [statusModal, setStatusModal] = useState({
        isOpen: false,
        type: "",
        title: "",
        currentValue: "",
    });

    const canCancel = CANCELLABLE_STATUSES.includes(order.status);

    const handleStatusUpdate = (type) => {
        setStatusModal({
            isOpen: true,
            type: type,
            title:
                type === "status"
                    ? "Update Order Status"
                    : "Update Payment Status",
            currentValue:
                type === "status" ? order.status : order.payment_status,
        });
    };

    const handleStatusChange = (newValue) => {
        setLoading(true);

        const endpoint =
            statusModal.type === "status"
                ? route("admin.orders.update-status", order.id)
                : route("admin.orders.update-payment-status", order.id);

        const data =
            statusModal.type === "status"
                ? { status: newValue }
                : { payment_status: newValue };

        router.patch(endpoint, data, {
            preserveScroll: true,
            onSuccess: () => {
                setStatusModal({
                    isOpen: false,
                    type: "",
                    title: "",
                    currentValue: "",
                });
            },
            onError: (errors) => {
                console.error("Status update failed:", errors);
                alert("Failed to update status. Please try again.");
            },
            onFinish: () => setLoading(false),
        });
    };

    const handleCancelOrder = () => {
        setLoading(true);

        router.post(
            route("admin.orders.cancel", order.id),
            { reason: "Cancelled by admin" },
            {
                preserveScroll: true,
                onSuccess: () => setShowCancelModal(false),
                onError: (errors) => {
                    console.error("Cancel order failed:", errors);
                    alert("Failed to cancel order. Please try again.");
                },
                onFinish: () => setLoading(false),
            }
        );
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
            <PageHead title={`Order ${order.order_number}`} />
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

                {/* Header */}
                <div className="flex items-center gap-4">
                    <GamingButton
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                            router.visit(route("admin.orders.index"))
                        }
                        className="text-slate-300"
                    >
                        ← Back to Orders
                    </GamingButton>
                    <div>
                        <h1 className="font-heading font-bold text-2xl text-white">
                            Order Details
                        </h1>
                        <p className="text-slate-400">
                            Manage order and customer information
                        </p>
                    </div>
                </div>

                {/* Order Overview */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
                        <div>
                            <h2 className="font-heading font-bold text-xl text-white mb-2">
                                {order.order_number}
                            </h2>
                            <div className="flex items-center gap-4 text-sm flex-wrap">
                                <span className="text-slate-400">
                                    Placed on{" "}
                                    {new Date(
                                        order.created_at
                                    ).toLocaleDateString()}{" "}
                                    at{" "}
                                    {new Date(
                                        order.created_at
                                    ).toLocaleTimeString()}
                                </span>
                                <button
                                    onClick={() => handleStatusUpdate("status")}
                                    disabled={loading}
                                    className={`px-2 py-1 rounded-full text-xs font-medium hover:opacity-80 transition-opacity disabled:opacity-50 ${getStatusColor(
                                        order.status
                                    )}`}
                                >
                                    Status: {order.status}
                                </button>
                                <button
                                    onClick={() =>
                                        handleStatusUpdate("payment_status")
                                    }
                                    disabled={loading}
                                    className={`px-2 py-1 rounded-full text-xs font-medium hover:opacity-80 transition-opacity disabled:opacity-50 ${getPaymentStatusColor(
                                        order.payment_status
                                    )}`}
                                >
                                    Payment: {order.payment_status}
                                </button>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-white">
                                Tk{" "}
                                {parseFloat(order.total_amount || 0).toFixed(2)}
                            </div>
                            <div className="text-slate-400 text-sm">
                                {order.items?.length || 0} items
                            </div>
                        </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-700">
                        <GamingButton
                            variant="primary"
                            size="sm"
                            onClick={() => handleStatusUpdate("status")}
                            disabled={loading}
                        >
                            📝 Update Status
                        </GamingButton>
                        <GamingButton
                            variant="primary"
                            size="sm"
                            onClick={() => handleStatusUpdate("payment_status")}
                            disabled={loading}
                        >
                            💳 Update Payment
                        </GamingButton>
                        {canCancel && (
                            <GamingButton
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowCancelModal(true)}
                                disabled={loading}
                                className="text-red-400 hover:text-red-300"
                            >
                                ❌ Cancel Order
                            </GamingButton>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Customer Information */}
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
                        <h3 className="font-heading font-semibold text-lg text-white mb-4">
                            Customer Information
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        {(order.customer.name || "G")
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <div className="text-white font-medium">
                                        {order.customer.name || "Guest"}
                                    </div>
                                    <div className="text-slate-400 text-sm">
                                        {order.customer.email || "—"}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                {order.customer.phone && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">
                                            Phone:
                                        </span>
                                        <span className="text-white">
                                            {order.customer.phone}
                                        </span>
                                    </div>
                                )}
                                {order.customer.id && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">
                                            Customer ID:
                                        </span>
                                        <span className="text-white">
                                            #{order.customer.id}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {order.customer.id && (
                                <GamingButton
                                    variant="ghost"
                                    size="sm"
                                    className="w-full text-slate-300"
                                    onClick={() =>
                                        router.visit(
                                            route(
                                                "admin.users.show",
                                                order.customer.id
                                            )
                                        )
                                    }
                                >
                                    View Customer Profile
                                </GamingButton>
                            )}
                        </div>
                    </div>

                    {/* Billing Address */}
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
                        <h3 className="font-heading font-semibold text-lg text-white mb-4">
                            Billing Address
                        </h3>
                        <div className="space-y-2 text-sm">
                            {order.billing_address ? (
                                <>
                                    {(order.billing_address.first_name ||
                                        order.billing_address.last_name) && (
                                        <div className="text-white">
                                            {order.billing_address.first_name}{" "}
                                            {order.billing_address.last_name}
                                        </div>
                                    )}
                                    {order.billing_address.address && (
                                        <div className="text-white">
                                            {order.billing_address.address}
                                        </div>
                                    )}
                                    <div className="text-white">
                                        {[
                                            order.billing_address.city,
                                            order.billing_address.state,
                                            order.billing_address.zip,
                                        ]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </div>
                                    {order.billing_address.country && (
                                        <div className="text-white">
                                            {order.billing_address.country}
                                        </div>
                                    )}
                                    {order.billing_address.email && (
                                        <div className="text-slate-400 pt-2">
                                            {order.billing_address.email}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-slate-400">
                                    No billing address provided
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
                        <h3 className="font-heading font-semibold text-lg text-white mb-4">
                            Payment Information
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Method:</span>
                                <span className="text-white">
                                    {order.payment_method || "Not specified"}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Status:</span>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                                        order.payment_status
                                    )}`}
                                >
                                    {order.payment_status}
                                </span>
                            </div>
                            {order.payment_reference && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">
                                        Reference:
                                    </span>
                                    <span className="text-white text-xs">
                                        {order.payment_reference}
                                    </span>
                                </div>
                            )}
                            {order.payment_completed_at && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">
                                        Paid At:
                                    </span>
                                    <span className="text-white text-xs">
                                        {new Date(
                                            order.payment_completed_at
                                        ).toLocaleString()}
                                    </span>
                                </div>
                            )}
                            <div className="pt-3 border-t border-slate-700 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">
                                        Subtotal:
                                    </span>
                                    <span className="text-white">
                                        Tk{" "}
                                        {parseFloat(
                                            order.subtotal || 0
                                        ).toFixed(2)}
                                    </span>
                                </div>
                                {order.tax_amount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">
                                            Tax:
                                        </span>
                                        <span className="text-white">
                                            Tk{" "}
                                            {parseFloat(
                                                order.tax_amount || 0
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                {order.discount_amount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">
                                            Discount:
                                        </span>
                                        <span className="text-green-400">
                                            -Tk{" "}
                                            {parseFloat(
                                                order.discount_amount || 0
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between font-medium pt-2 border-t border-slate-700">
                                    <span className="text-white">Total:</span>
                                    <span className="text-white">
                                        Tk{" "}
                                        {parseFloat(
                                            order.total_amount || 0
                                        ).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
                    <h3 className="font-heading font-semibold text-lg text-white mb-4">
                        Order Items
                    </h3>
                    <OrderItemsTable items={order.items} />
                </div>

                {/* Notes */}
                {order.notes && (
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
                        <h3 className="font-heading font-semibold text-lg text-white mb-4">
                            Order Notes
                        </h3>
                        <p className="text-slate-300">{order.notes}</p>
                    </div>
                )}
            </div>

            {/* Status Update Modal */}
            {statusModal.isOpen && (
                <StatusUpdateModal
                    isOpen={statusModal.isOpen}
                    onClose={() =>
                        !loading &&
                        setStatusModal({
                            isOpen: false,
                            type: "",
                            title: "",
                            currentValue: "",
                        })
                    }
                    onConfirm={handleStatusChange}
                    type={statusModal.type}
                    title={statusModal.title}
                    currentValue={statusModal.currentValue}
                    loading={loading}
                />
            )}

            <ConfirmModal
                isOpen={showCancelModal}
                onClose={() => !loading && setShowCancelModal(false)}
                onConfirm={handleCancelOrder}
                title="Cancel Order"
                message={`Are you sure you want to cancel order ${order.order_number}? This action cannot be undone.`}
                confirmText="Cancel Order"
                confirmVariant="danger"
                icon="❌"
            />
        </AdminLayout>
    );
}

function StatusUpdateModal({
    isOpen,
    onClose,
    onConfirm,
    type,
    title,
    currentValue,
    loading,
}) {
    const [selectedValue, setSelectedValue] = useState(currentValue);

    useEffect(() => {
        if (isOpen) {
            setSelectedValue(currentValue);
        }
    }, [currentValue, isOpen]);

    const statusOptions =
        type === "status"
            ? [
                  { value: "pending", label: "Pending" },
                  { value: "processing", label: "Processing" },
                  { value: "completed", label: "Completed" },
                  { value: "cancelled", label: "Cancelled" },
                  { value: "refunded", label: "Refunded" },
              ]
            : [
                  { value: "pending", label: "Pending" },
                  { value: "paid", label: "Paid" },
                  { value: "failed", label: "Failed" },
                  { value: "refunded", label: "Refunded" },
              ];

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(selectedValue);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 w-full max-w-md mx-4">
                <h2 className="text-xl font-bold text-white mb-4">{title}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            {type === "status"
                                ? "Order Status"
                                : "Payment Status"}
                        </label>
                        <select
                            value={selectedValue}
                            onChange={(e) => setSelectedValue(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                            disabled={loading}
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || selectedValue === currentValue}
                            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Updating..." : "Update Status"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
