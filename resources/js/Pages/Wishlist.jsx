"use client";

import { useState, useEffect } from "react";
import { Header } from "@/Components/Layout/Header";
import { GamingButton } from "@/Components/ui/GamingButton";
import { WishlistItem } from "@/Components/Wishlist/WishlistItem";
import { WishlistSummary } from "@/Components/Wishlist/WishlistSummary";
import { Link, router, usePage } from "@inertiajs/react";

export default function WishlistPage({
    wishlistItems: initialWishlistItems = [],
}) {
    const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);
    const { props } = usePage();
    const { flash, auth } = props;

    // Update local state when props change
    useEffect(() => {
        setWishlistItems(initialWishlistItems);
    }, [initialWishlistItems]);

    // Show flash messages (optional toast system could hook here)
    useEffect(() => {
        if (flash?.error) {
            alert("Error: " + flash.error);
        }
    }, [flash]);

    const moveToCart = (item) => {
        if (!item || item.stock === 0) {
            alert("This item is out of stock.");
            return;
        }

        // Optimistic UI: remove from wishlist immediately
        const previous = wishlistItems;
        setWishlistItems(previous.filter((w) => w.id !== item.id));

        router.post(
            `/wishlist/${item.id}/move-to-cart`,
            {},
            {
                preserveScroll: true,
                onError: () => {
                    // Revert on error
                    setWishlistItems(previous);
                },
                onFinish: () => {
                    // Optionally reload counts or server truth
                    router.reload({ only: ["wishlistItems"] });
                },
            }
        );
    };

    const removeItem = (id) => {
        const previous = wishlistItems;
        setWishlistItems(previous.filter((item) => item.id !== id));

        router.delete(`/wishlist/${id}`, {
            preserveScroll: true,
            onError: () => {
                setWishlistItems(previous);
            },
            onFinish: () => {
                router.reload({ only: ["wishlistItems"] });
            },
        });
    };

    const moveAllToCart = () => {
        const inStockItems = wishlistItems.filter((item) => item.stock > 0);
        if (inStockItems.length === 0) return;

        // Optimistic UI: remove in-stock items locally
        const previous = wishlistItems;
        const remaining = previous.filter((item) => item.stock <= 0);
        setWishlistItems(remaining);

        router.post(
            "/wishlist/move-all",
            {},
            {
                preserveScroll: true,
                onError: () => {
                    setWishlistItems(previous);
                },
                onFinish: () => {
                    router.reload({ only: ["wishlistItems"] });
                },
            }
        );
    };

    const clearWishlist = () => {
        const previous = wishlistItems;
        setWishlistItems([]);
        router.delete("/wishlist", {
            preserveScroll: true,
            onError: () => setWishlistItems(previous),
            onFinish: () => router.reload({ only: ["wishlistItems"] }),
        });
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
                    {!auth?.user && (
                        <div className="mt-4 flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-lg px-4 py-3 text-sm">
                            <span>You are browsing as a guest.</span>
                            <Link
                                href={route("login")}
                                className="text-accent hover:underline font-medium"
                            >
                                Sign in
                            </Link>
                            <span className="text-muted-foreground">
                                to save your wishlist across devices.
                            </span>
                        </div>
                    )}
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
                                onClick={clearWishlist}
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
