"use client";

import { GamingButton } from "@/Components/ui/GamingButton";

export function WishlistSummary({
    totalItems,
    totalValue,
    onMoveAllToCart,
    hasInStockItems,
}) {
    return (
        <div className="glass-card rounded-xl p-6 sticky top-24">
            <h2 className="font-heading font-semibold text-xl mb-6">
                Wishlist Summary
            </h2>

            <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                    <span>Total Items</span>
                    <span className="font-semibold">{totalItems}</span>
                </div>
                <div className="flex justify-between">
                    <span>Total Value</span>
                    <span className="font-semibold text-accent">
                        ${totalValue.toFixed(2)}
                    </span>
                </div>
                <hr className="border-border" />
                <div className="text-sm text-muted-foreground">
                    <p>• Save items for later</p>
                    <p>• Get notified of price drops</p>
                    <p>• Quick access to favorites</p>
                </div>
            </div>

            <div className="space-y-3">
                <GamingButton
                    variant="accent"
                    size="lg"
                    className="w-full"
                    onClick={onMoveAllToCart}
                    disabled={!hasInStockItems}
                >
                    {hasInStockItems ? "Move All to Cart" : "No Items in Stock"}
                </GamingButton>

                <GamingButton
                    variant="ghost"
                    size="lg"
                    className="w-full"
                    onClick={() => (window.location.href = "/products")}
                >
                    Continue Shopping
                </GamingButton>

                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <span>💝</span>
                        <span>Your gaming wishlist</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-medium mb-3">Wishlist Features:</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <span>✓</span>
                        <span>Save favorite games</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>✓</span>
                        <span>Price tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>✓</span>
                        <span>Quick cart transfer</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
