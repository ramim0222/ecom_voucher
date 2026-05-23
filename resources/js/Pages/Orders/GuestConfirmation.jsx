import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { SiteLayout } from "@/Components/Layout/SiteLayout";
import { GamingButton } from "@/Components/ui/GamingButton";

export default function GuestConfirmation({ order }) {
    const [copiedCode, setCopiedCode] = useState(null);

    const copyToClipboard = async (code) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCode(code);
            setTimeout(() => setCopiedCode(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const billingAddress = order.billing_address ?? {};
    const customerName =
        [billingAddress.first_name, billingAddress.last_name]
            .filter(Boolean)
            .join(" ") || "Guest";

    return (
        <>
            <Head title="Order Confirmed" />
            <SiteLayout>

                <div className="container mx-auto px-4 py-8 max-w-3xl">
                    {/* Success Banner */}
                    <div className="glass-card rounded-xl p-8 mb-8 text-center border border-green-500/30">
                        <div className="text-5xl mb-4">✅</div>
                        <h1 className="font-heading font-bold text-3xl mb-2">
                            Order Confirmed!
                        </h1>
                        <p className="text-muted-foreground mb-1">
                            Thank you, {customerName}. Your order has been
                            placed successfully.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Order #{order.order_number}
                        </p>
                        <div className="mt-3 inline-flex items-center gap-2 bg-green-500/10 text-green-600 dark:text-green-400 px-4 py-1.5 rounded-full text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                        </div>
                    </div>

                    {/* Order Items & Codes */}
                    <div className="glass-card rounded-xl p-6 mb-6">
                        <h2 className="font-heading font-semibold text-xl mb-4">
                            Your Voucher Codes
                        </h2>
                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="border border-border rounded-lg p-4"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-medium">
                                                {item.product_title}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Qty: {item.quantity} &times; Tk{" "}
                                                {parseFloat(
                                                    item.unit_price
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                        <span className="font-bold text-accent">
                                            Tk{" "}
                                            {parseFloat(
                                                item.total_price
                                            ).toFixed(2)}
                                        </span>
                                    </div>

                                    {item.assigned_codes &&
                                        item.assigned_codes.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                                    Your codes:
                                                </p>
                                                {item.assigned_codes.map(
                                                    (code, codeIdx) => (
                                                        <div
                                                            key={codeIdx}
                                                            className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-2 font-mono text-sm"
                                                        >
                                                            <span className="text-accent font-semibold tracking-widest">
                                                                {code}
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    copyToClipboard(
                                                                        code
                                                                    )
                                                                }
                                                                className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-3 shrink-0"
                                                            >
                                                                {copiedCode ===
                                                                code
                                                                    ? "Copied!"
                                                                    : "Copy"}
                                                            </button>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="glass-card rounded-xl p-6 mb-6">
                        <h2 className="font-heading font-semibold text-xl mb-4">
                            Order Summary
                        </h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Subtotal
                                </span>
                                <span>
                                    Tk {parseFloat(order.subtotal).toFixed(2)}
                                </span>
                            </div>
                            {parseFloat(order.discount_amount) > 0 && (
                                <div className="flex justify-between text-green-600 dark:text-green-400">
                                    <span>Discount</span>
                                    <span>
                                        - Tk{" "}
                                        {parseFloat(
                                            order.discount_amount
                                        ).toFixed(2)}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                                <span>Total</span>
                                <span className="text-accent">
                                    Tk{" "}
                                    {parseFloat(order.total_amount).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Billing Info */}
                    {billingAddress.email && (
                        <div className="glass-card rounded-xl p-6 mb-6">
                            <h2 className="font-heading font-semibold text-xl mb-3">
                                Billing Information
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {customerName}
                                <br />
                                {billingAddress.email}
                                {billingAddress.phone && (
                                    <>
                                        <br />
                                        {billingAddress.phone}
                                    </>
                                )}
                            </p>
                        </div>
                    )}

                    {/* Notice */}
                    <div className="bg-primary/10 border border-primary/30 rounded-lg px-4 py-3 text-sm text-muted-foreground mb-8">
                        <p>
                            <strong className="text-foreground">
                                Save your codes!
                            </strong>{" "}
                            This page is only shown once. Please copy your
                            voucher codes above before leaving.
                        </p>
                        <p className="mt-2">
                            Want to track orders?{" "}
                            <Link
                                href={route("register")}
                                className="text-accent hover:underline font-medium"
                            >
                                Create an account
                            </Link>{" "}
                            for order history and faster checkout.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <GamingButton
                            variant="accent"
                            size="lg"
                            className="flex-1"
                            onClick={() => (window.location.href = "/products")}
                        >
                            Continue Shopping
                        </GamingButton>
                    </div>
                </div>
            </SiteLayout>
        </>
    );
}
