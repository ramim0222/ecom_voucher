"use client";

import { GamingButton } from "@/Components/ui/GamingButton";

export function CartSummary({ subtotal, total, itemCount }) {
    return (
        <div className="glass-card rounded-xl p-6 sticky top-24">
            <h2 className="font-heading font-semibold text-xl mb-6">
                Order Summary
            </h2>

            <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-accent">Free</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-accent">${total.toFixed(2)}</span>
                </div>
            </div>

            <div className="space-y-3">
                <GamingButton
                    variant="accent"
                    size="lg"
                    className="w-full"
                    onClick={() => (window.location.href = "/checkout")}
                >
                    Proceed to Checkout
                </GamingButton>

                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <span>🔒</span>
                        <span>Secure checkout with 256-bit SSL encryption</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-medium mb-3">We Accept:</h3>
                <div className="flex gap-2">
                    {["Visa", "MC", "PayPal", "Apple Pay"].map((method) => (
                        <div
                            key={method}
                            className="bg-muted rounded px-2 py-1 text-xs"
                        >
                            {method}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
