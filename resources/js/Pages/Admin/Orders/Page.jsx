"use client";

import { useState } from "react";
import { AdminLayout } from "@/Components/Admin/AdminLayout";
import { GamingButton } from "@/Components/ui/GamingButton";
import { OrderItemsTable } from "@/Components/Admin/OrderItemsTable";
import { OrderActivityLog } from "@/Components/Admin/OrderActivityLog";
import { OrderActionModal } from "@/Components/Admin/OrderActionModal";

export default function AdminOrderDetailsPage({ params }) {
    const orderId = params?.id || "ORD-2024-001";

    // Mock order data - in real app, this would be fetched based on orderId
    const [order] = useState({
        id: orderId,
        orderNumber: orderId,
        date: "2024-01-20T10:30:00Z",
        customer: {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "+1 (555) 123-4567",
            avatar: "/diverse-user-avatars.png",
        },
        billingAddress: {
            street: "123 Gaming Street",
            city: "San Francisco",
            state: "CA",
            zipCode: "94102",
            country: "United States",
        },
        items: [
            {
                id: 1,
                name: "Steam $50 Gift Card",
                sku: "STEAM-50-USD",
                price: 50.0,
                quantity: 1,
                subtotal: 50.0,
                image: "/steam-voucher-card.png",
            },
            {
                id: 2,
                name: "PlayStation Plus 1 Month Subscription",
                sku: "PSN-PLUS-1M",
                price: 39.99,
                quantity: 1,
                subtotal: 39.99,
                image: "/playstation-voucher-card.png",
            },
        ],
        subtotal: 89.99,
        tax: 7.2,
        shipping: 0.0,
        discount: 0.0,
        total: 97.19,
        paymentStatus: "paid",
        paymentMethod: "Credit Card (**** 4242)",
        deliveryStatus: "processing",
        notes: "Customer requested expedited delivery",
    });

    const [actionModal, setActionModal] = useState({
        isOpen: false,
        type: "",
        title: "",
        message: "",
    });

    const handleAdminAction = (actionType) => {
        const actions = {
            markDelivered: {
                title: "Mark as Delivered",
                message: `Mark order ${order.orderNumber} as delivered? This will notify the customer and update the order status.`,
            },
            refundOrder: {
                title: "Refund Order",
                message: `Process a full refund for order ${
                    order.orderNumber
                }? This action will refund $${order.total.toFixed(
                    2
                )} to the customer's payment method.`,
            },
            contactBuyer: {
                title: "Contact Buyer",
                message: `Send a message to ${order.customer.name} regarding order ${order.orderNumber}`,
            },
        };

        setActionModal({
            isOpen: true,
            type: actionType,
            ...actions[actionType],
        });
    };

    const handleConfirmAction = async (actionType, data) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        switch (actionType) {
            case "markDelivered":
                alert("Order marked as delivered successfully");
                break;
            case "refundOrder":
                alert(
                    `Refund of $${order.total.toFixed(
                        2
                    )} processed successfully`
                );
                break;
            case "contactBuyer":
                alert(`Message sent to ${order.customer.email}`);
                break;
        }

        setActionModal({ isOpen: false, type: "", title: "", message: "" });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "delivered":
                return "text-green-400 bg-green-400/20";
            case "processing":
                return "text-yellow-400 bg-yellow-400/20";
            case "pending":
                return "text-blue-400 bg-blue-400/20";
            case "cancelled":
                return "text-red-400 bg-red-400/20";
            case "paid":
                return "text-green-400 bg-green-400/20";
            case "refunded":
                return "text-red-400 bg-red-400/20";
            default:
                return "text-slate-400 bg-slate-400/20";
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <GamingButton
                        variant="ghost"
                        size="sm"
                        onClick={() => (window.location.href = "/admin/orders")}
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
                                {order.orderNumber}
                            </h2>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-slate-400">
                                    Placed on{" "}
                                    {new Date(order.date).toLocaleDateString()}{" "}
                                    at{" "}
                                    {new Date(order.date).toLocaleTimeString()}
                                </span>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                        order.paymentStatus
                                    )}`}
                                >
                                    Payment: {order.paymentStatus}
                                </span>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                        order.deliveryStatus
                                    )}`}
                                >
                                    Delivery: {order.deliveryStatus}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-white">
                                ${order.total.toFixed(2)}
                            </div>
                            <div className="text-slate-400 text-sm">
                                {order.items.length} items
                            </div>
                        </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-700">
                        <GamingButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAdminAction("markDelivered")}
                            className="text-green-400 hover:text-green-300"
                            disabled={order.deliveryStatus === "delivered"}
                        >
                            📦 Mark as Delivered
                        </GamingButton>
                        <GamingButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAdminAction("refundOrder")}
                            className="text-red-400 hover:text-red-300"
                            disabled={order.paymentStatus === "refunded"}
                        >
                            💰 Refund Order
                        </GamingButton>
                        <GamingButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAdminAction("contactBuyer")}
                            className="text-blue-400 hover:text-blue-300"
                        >
                            📧 Contact Buyer
                        </GamingButton>
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
                                    {order.customer.avatar ? (
                                        <img
                                            src={
                                                order.customer.avatar ||
                                                "/placeholder.svg"
                                            }
                                            alt={order.customer.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-white font-bold text-sm">
                                            {order.customer.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <div className="text-white font-medium">
                                        {order.customer.name}
                                    </div>
                                    <div className="text-slate-400 text-sm">
                                        {order.customer.email}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">
                                        Phone:
                                    </span>
                                    <span className="text-white">
                                        {order.customer.phone}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">
                                        Customer ID:
                                    </span>
                                    <span className="text-white">
                                        #{order.customer.id}
                                    </span>
                                </div>
                            </div>
                            <GamingButton
                                variant="ghost"
                                size="sm"
                                className="w-full text-slate-300"
                                onClick={() =>
                                    (window.location.href = `/admin/users/${order.customer.id}`)
                                }
                            >
                                View Customer Profile
                            </GamingButton>
                        </div>
                    </div>

                    {/* Billing Address */}
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
                        <h3 className="font-heading font-semibold text-lg text-white mb-4">
                            Billing Address
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="text-white">
                                {order.billingAddress.street}
                            </div>
                            <div className="text-white">
                                {order.billingAddress.city},{" "}
                                {order.billingAddress.state}{" "}
                                {order.billingAddress.zipCode}
                            </div>
                            <div className="text-white">
                                {order.billingAddress.country}
                            </div>
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
                                    {order.paymentMethod}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Status:</span>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                        order.paymentStatus
                                    )}`}
                                >
                                    {order.paymentStatus}
                                </span>
                            </div>
                            <div className="pt-3 border-t border-slate-700 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">
                                        Subtotal:
                                    </span>
                                    <span className="text-white">
                                        ${order.subtotal.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Tax:</span>
                                    <span className="text-white">
                                        ${order.tax.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">
                                        Shipping:
                                    </span>
                                    <span className="text-white">
                                        ${order.shipping.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between font-medium pt-2 border-t border-slate-700">
                                    <span className="text-white">Total:</span>
                                    <span className="text-white">
                                        ${order.total.toFixed(2)}
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

                {/* Order Notes */}
                {order.notes && (
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
                        <h3 className="font-heading font-semibold text-lg text-white mb-4">
                            Order Notes
                        </h3>
                        <p className="text-slate-300">{order.notes}</p>
                    </div>
                )}

                {/* Activity Log */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
                    <h3 className="font-heading font-semibold text-lg text-white mb-4">
                        Activity Log
                    </h3>
                    <OrderActivityLog orderId={order.id} />
                </div>
            </div>

            {/* Order Action Modal */}
            <OrderActionModal
                isOpen={actionModal.isOpen}
                onClose={() =>
                    setActionModal({
                        isOpen: false,
                        type: "",
                        title: "",
                        message: "",
                    })
                }
                onConfirm={handleConfirmAction}
                type={actionModal.type}
                title={actionModal.title}
                message={actionModal.message}
                order={order}
            />
        </AdminLayout>
    );
}
