"use client";

import { useState, useEffect } from "react";
import { SiteLayout } from "@/Components/Layout/SiteLayout";
import { GamingButton } from "@/Components/ui/GamingButton";
import { CartItem } from "@/Components/Cart/CartItem";
import { CartSummary } from "@/Components/Cart/CartSummary";
import { Link, router, usePage } from "@inertiajs/react";

export default function CartPage({ cartItems: initialCartItems = [] }) {
    const { props } = usePage();
    const { flash, auth } = props;
    const [cartItems, setCartItems] = useState(initialCartItems);

    // Update local state when props change
    useEffect(() => {
        setCartItems(initialCartItems);
    }, [initialCartItems]);

    // Show flash messages
    useEffect(() => {
        if (flash?.success) {
            // You can implement a better toast/notification system here
            console.log("Success:", flash.success);
        }
        if (flash?.error) {
            alert("Error: " + flash.error);
        }
    }, [flash]);

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity === 0) {
            removeItem(id);
            return;
        }

        // Check stock before updating
        const item = cartItems.find((item) => item.id === id);
        if (item && newQuantity > item.stock) {
            alert(`Only ${item.stock} items available in stock.`);
            return;
        }

        // Optimistic update - update UI immediately
        setCartItems(
            cartItems.map((item) =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );

        // Send request to server
        router.patch(
            `/cart/${id}`,
            { quantity: newQuantity },
            {
                onError: () => {
                    // Revert on error and reload fresh data
                    router.reload({ only: ["cartItems"] });
                },
            }
        );
    };

    const removeItem = (id) => {
        // Optimistic update - remove item immediately
        setCartItems(cartItems.filter((item) => item.id !== id));

        // Send request to server
        router.delete(`/cart/${id}`, {
            onError: () => {
                // Revert on error and reload fresh data
                router.reload({ only: ["cartItems"] });
            },
        });
    };

    const clearCart = () => {
        if (confirm("Are you sure you want to clear your cart?")) {
            // Optimistic update - clear items immediately
            setCartItems([]);

            // Send request to server
            router.delete("/cart", {
                onError: () => {
                    // Revert on error and reload fresh data
                    router.reload({ only: ["cartItems"] });
                },
            });
        }
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const total = subtotal;

    if (cartItems.length === 0) {
        return (
            <SiteLayout>
                <div className="container mx-auto px-3 sm:px-4 py-12 sm:py-16 text-center">
                    <div className="glass-card rounded-xl p-12 max-w-md mx-auto">
                        <div className="text-6xl mb-4">🛒</div>
                        <h1 className="font-heading font-bold text-2xl mb-4">
                            Your Cart is Empty
                        </h1>
                        <p className="text-muted-foreground mb-6">
                            Looks like you haven't added any vouchers to your
                            cart yet.
                        </p>
                        <Link href={route("products")}>
                            <GamingButton variant="primary" size="lg">
                                Browse Vouchers
                            </GamingButton>
                        </Link>
                    </div>
                </div>
            </SiteLayout>
        );
    }

    return (
        <SiteLayout>

            <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
                <div className="mb-8">
                    <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl mb-2">
                        Shopping Cart
                    </h1>
                    <p className="text-muted-foreground">
                        {cartItems.length}{" "}
                        {cartItems.length === 1 ? "item" : "items"} in your cart
                    </p>
                    {!auth?.user && (
                        <div className="mt-4 flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-lg px-4 py-3 text-sm">
                            <span>You are shopping as a guest.</span>
                            <Link
                                href={route("login")}
                                className="text-accent hover:underline font-medium"
                            >
                                Sign in
                            </Link>
                            <span className="text-muted-foreground">to save your cart across devices.</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onUpdateQuantity={updateQuantity}
                                onRemove={removeItem}
                            />
                        ))}

                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <Link href={route("products")}>
                                <GamingButton variant="ghost" size="lg">
                                    Continue Shopping
                                </GamingButton>
                            </Link>
                            <GamingButton
                                variant="secondary"
                                size="lg"
                                onClick={clearCart}
                            >
                                Clear Cart
                            </GamingButton>
                        </div>
                    </div>

                    {/* Cart Summary */}
                    <div className="lg:col-span-1">
                        <CartSummary
                            subtotal={subtotal}
                            total={total}
                            itemCount={cartItems.length}
                        />
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
