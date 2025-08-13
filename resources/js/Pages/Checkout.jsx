"use client";

import { useState } from "react";
import { Header } from "@/Components/Layout/Header";
import { CheckoutForm } from "@/Components/Checkout/CheckoutForm";
import { OrderSummary } from "@/Components/Checkout/OrderSummary";

export default function CheckoutPage() {
    const [orderData, setOrderData] = useState({
        items: [
            {
                id: 1,
                title: "Steam Wallet $50",
                price: 45.99,
                platform: "Steam",
                quantity: 1,
            },
            {
                id: 2,
                title: "PlayStation Store $25",
                price: 22.99,
                platform: "PlayStation",
                quantity: 2,
            },
        ],
        subtotal: 91.97,
        tax: 7.36,
        total: 99.33,
    });

    const [currentStep, setCurrentStep] = useState(1);

    const steps = [
        { number: 1, title: "Customer Info", completed: false },
        { number: 2, title: "Payment", completed: false },
        { number: 3, title: "Review", completed: false },
    ];

    return (
        <div className="min-h-screen">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                        Checkout
                    </h1>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center mb-8">
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
                                    className={`ml-2 text-sm ${
                                        currentStep >= step.number
                                            ? "text-foreground"
                                            : "text-muted-foreground"
                                    }`}
                                >
                                    {step.title}
                                </span>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`w-16 h-0.5 mx-4 ${
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
                    <div className="lg:col-span-2">
                        <CheckoutForm
                            currentStep={currentStep}
                            onStepChange={setCurrentStep}
                            orderData={orderData}
                        />
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <OrderSummary orderData={orderData} />
                    </div>
                </div>
            </div>
        </div>
    );
}
