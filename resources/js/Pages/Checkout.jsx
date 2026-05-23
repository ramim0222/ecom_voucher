"use client";

import { useState, useEffect } from "react";
import { SiteLayout } from "@/Components/Layout/SiteLayout";
import { CheckoutForm } from "@/Components/Checkout/CheckoutForm";
import { OrderSummary } from "@/Components/Checkout/OrderSummary";
import { usePage } from "@inertiajs/react";
import { usePageAnimations } from "@/hooks/usePageAnimations";

export default function CheckoutPage({ cartItems = [], user }) {
    const { props } = usePage();

    const [orderData, setOrderData] = useState({
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
    });

    useEffect(() => {
        if (cartItems && cartItems.length > 0) {
            const items = cartItems.map((item) => ({
                id: item.id ?? item.product_id,
                title: item.title ?? item.product?.title ?? "Product",
                price: parseFloat(item.price),
                platform:
                    item.platform ??
                    item.product?.category?.name ??
                    "Digital",
                quantity: item.quantity,
            }));

            const subtotal = items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );
            const tax = subtotal * 0.0; // No tax for now
            const total = subtotal + tax;

            setOrderData({
                items,
                subtotal,
                tax,
                total,
            });
        }
    }, [cartItems]);

    const [currentStep, setCurrentStep] = useState(1);
    const refs = usePageAnimations({ header: true, form: true });

    const steps = [
        { number: 1, title: "Customer Info", completed: false },
        { number: 2, title: "Payment", completed: false },
        { number: 3, title: "Review", completed: false },
    ];

    return (
        <SiteLayout>

            <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
                <div ref={refs.header} className="mb-8">
                    <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl mb-4">
                        Checkout
                    </h1>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center mb-8 overflow-x-auto">
                        {steps.map((step, index) => (
                            <div
                                key={step.number}
                                className="flex items-center"
                            >
                                <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                                        currentStep >= step.number
                                            ? "bg-primary border-primary text-primary-foreground"
                                            : "border-border text-muted-foreground"
                                    }`}
                                >
                                    {step.completed ? "✓" : step.number}
                                </div>
                                <span
                                    className={`ml-2 text-sm hidden sm:inline ${
                                        currentStep >= step.number
                                            ? "text-foreground"
                                            : "text-muted-foreground"
                                    }`}
                                >
                                    {step.title}
                                </span>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${
                                            currentStep > step.number
                                                ? "bg-primary"
                                                : "bg-border"
                                        }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div ref={refs.form} className="lg:col-span-2">
                        <CheckoutForm
                            currentStep={currentStep}
                            onStepChange={setCurrentStep}
                            orderData={orderData}
                            user={user}
                        />
                    </div>

                    {/* Order Summary */}
                    <div ref={refs.summary} className="lg:col-span-1">
                        <OrderSummary orderData={orderData} />
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
