"use client";

import { useState, useEffect } from "react";
import { Header } from "@/Components/Layout/Header";
import { GamingButton } from "@/Components/ui/GamingButton";
import { WishlistItem } from "@/Components/Wishlist/WishlistItem";
import { WishlistSummary } from "@/Components/Wishlist/WishlistSummary";

export default function WishlistPage({
    wishlistItems: initialWishlistItems = [],
}) {
    const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);

    // Update local state when props change
    useEffect(() => {
        setWishlistItems(initialWishlistItems);
    }, [initialWishlistItems]);

    const moveToCart = (item) => {
        // This would typically call an API to move item from wishlist to cart
        // For now, we'll just remove it from wishlist
        setWishlistItems(
            wishlistItems.filter((wishlistItem) => wishlistItem.id !== item.id)
        );

        // You can implement the actual cart addition logic here
        console.log("Moving to cart:", item);
    };

    const removeItem = (id) => {
        setWishlistItems(wishlistItems.filter((item) => item.id !== id));
    };

    const moveAllToCart = () => {
        const inStockItems = wishlistItems.filter((item) => item.stock > 0);
        if (inStockItems.length === 0) return;

        // Move all in-stock items to cart
        inStockItems.forEach((item) => moveToCart(item));
    };

    const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);

    const hasInStockItems = wishlistItems.some((item) => item.stock > 0);

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen">
                <Header />
                <div className="container mx-auto px-4 py-16 text-center">
                    <div className="glass-card rounded-xl p-12 max-w-md mx-auto">
                        <div className="text-6xl mb-4">💝</div>
                        <h1 className="font-heading font-bold text-2xl mb-4">
                            Your Wishlist is Empty
                        </h1>
                        <p className="text-muted-foreground mb-6">
                            Start building your gaming wishlist by adding your
                            favorite vouchers.
                        </p>
                        <GamingButton
                            variant="primary"
                            size="lg"
                            onClick={() => (window.location.href = "/products")}
                        >
                            Browse Vouchers
                        </GamingButton>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="font-heading font-bold text-3xl md:text-4xl mb-2">
                        My Wishlist
                    </h1>
                    <p className="text-muted-foreground">
                        {wishlistItems.length}{" "}
                        {wishlistItems.length === 1 ? "item" : "items"} in your
                        wishlist
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Wishlist Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {wishlistItems.map((item) => (
                            <WishlistItem
                                key={item.id}
                                item={item}
                                onMoveToCart={moveToCart}
                                onRemove={removeItem}
                            />
                        ))}

                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <GamingButton
                                variant="ghost"
                                size="lg"
                                onClick={() =>
                                    (window.location.href = "/products")
                                }
                            >
                                Continue Shopping
                            </GamingButton>
                            <GamingButton
                                variant="secondary"
                                size="lg"
                                onClick={() => setWishlistItems([])}
                            >
                                Clear Wishlist
                            </GamingButton>
                        </div>
                    </div>

                    {/* Wishlist Summary */}
                    <div className="lg:col-span-1">
                        <WishlistSummary
                            totalItems={wishlistItems.length}
                            totalValue={totalValue}
                            onMoveAllToCart={moveAllToCart}
                            hasInStockItems={hasInStockItems}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
