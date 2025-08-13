"use client";

import { useState } from "react";
import { Header } from "@/Components/Layout/Header";
import { GamingButton } from "@/Components/ui/GamingButton";
import { CartItem } from "@/Components/Cart/CartItem";
import { CartSummary } from "@/Components/Cart/CartSummary";

export default function CartPage() {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            title: "Steam Wallet $50",
            price: 45.99,
            originalPrice: 50.0,
            platform: "Steam",
            image: "/steam-voucher-card.png",
            quantity: 1,
        },
        {
            id: 2,
            title: "PlayStation Store $25",
            price: 22.99,
            originalPrice: 25.0,
            platform: "PlayStation",
            image: "/playstation-voucher-card.png",
            quantity: 2,
        },
        {
            id: 3,
            title: "Xbox Game Pass 3 Months",
            price: 29.99,
            originalPrice: 35.99,
            platform: "Xbox",
            image: "/placeholder-x1i2i.png",
            quantity: 1,
        },
    ]);

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity === 0) {
            setCartItems(cartItems.filter((item) => item.id !== id));
        } else {
            setCartItems(
                cartItems.map((item) =>
                    item.id === id ? { ...item, quantity: newQuantity } : item
                )
            );
        }
    };

    const removeItem = (id) => {
        setCartItems(cartItems.filter((item) => item.id !== id));
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen">
                <Header />
                <div className="container mx-auto px-4 py-16 text-center">
                    <div className="glass-card rounded-xl p-12 max-w-md mx-auto">
                        <div className="text-6xl mb-4">🛒</div>
                        <h1 className="font-heading font-bold text-2xl mb-4">
                            Your Cart is Empty
                        </h1>
                        <p className="text-muted-foreground mb-6">
                            Looks like you haven't added any vouchers to your
                            cart yet.
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
                        Shopping Cart
                    </h1>
                    <p className="text-muted-foreground">
                        {cartItems.length}{" "}
                        {cartItems.length === 1 ? "item" : "items"} in your cart
                    </p>
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
                            <GamingButton
                                variant="ghost"
                                size="lg"
                                onClick={() =>
                                    (window.location.href = "/products")
                                }
                            >
                                Continue Shopping
                            </GamingButton>
                            <GamingButton variant="secondary" size="lg">
                                Clear Cart
                            </GamingButton>
                        </div>
                    </div>

                    {/* Cart Summary */}
                    <div className="lg:col-span-1">
                        <CartSummary
                            subtotal={subtotal}
                            tax={tax}
                            total={total}
                            itemCount={cartItems.length}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
