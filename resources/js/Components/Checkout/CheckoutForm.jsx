"use client";

import { useState } from "react";
import { GamingButton } from "@/Components/ui/GamingButton";

export function CheckoutForm({ currentStep, onStepChange, orderData }) {
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        zipCode: "",
        country: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardName: "",
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleNextStep = () => {
        if (currentStep < 3) {
            onStepChange(currentStep + 1);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            onStepChange(currentStep - 1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle order submission
        alert("Order placed successfully!");
    };

    return (
        <div className="glass-card rounded-xl p-6">
            {currentStep === 1 && (
                <div>
                    <h2 className="font-heading font-semibold text-xl mb-6">
                        Customer Information
                    </h2>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="John"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="123 Main Street"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="New York"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    ZIP Code
                                </label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleInputChange}
                                    className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="10001"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Country
                                </label>
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Select Country</option>
                                    <option value="US">United States</option>
                                    <option value="CA">Canada</option>
                                    <option value="UK">United Kingdom</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {currentStep === 2 && (
                <div>
                    <h2 className="font-heading font-semibold text-xl mb-6">
                        Payment Information
                    </h2>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Card Number
                            </label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleInputChange}
                                className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="1234 5678 9012 3456"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Expiry Date
                                </label>
                                <input
                                    type="text"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleInputChange}
                                    className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="MM/YY"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    CVV
                                </label>
                                <input
                                    type="text"
                                    name="cvv"
                                    value={formData.cvv}
                                    onChange={handleInputChange}
                                    className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="123"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Cardholder Name
                            </label>
                            <input
                                type="text"
                                name="cardName"
                                value={formData.cardName}
                                onChange={handleInputChange}
                                className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="John Doe"
                            />
                        </div>
                    </form>
                </div>
            )}

            {currentStep === 3 && (
                <div>
                    <h2 className="font-heading font-semibold text-xl mb-6">
                        Review Your Order
                    </h2>
                    <div className="space-y-4">
                        <div className="glass-card rounded-lg p-4">
                            <h3 className="font-medium mb-2">
                                Customer Information
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {formData.firstName} {formData.lastName}
                                <br />
                                {formData.email}
                                <br />
                                {formData.address}, {formData.city}{" "}
                                {formData.zipCode}
                            </p>
                        </div>

                        <div className="glass-card rounded-lg p-4">
                            <h3 className="font-medium mb-2">Payment Method</h3>
                            <p className="text-sm text-muted-foreground">
                                **** **** **** {formData.cardNumber.slice(-4)}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between mt-8">
                <GamingButton
                    variant="ghost"
                    size="lg"
                    onClick={handlePrevStep}
                    disabled={currentStep === 1}
                >
                    Back
                </GamingButton>

                {currentStep < 3 ? (
                    <GamingButton
                        variant="primary"
                        size="lg"
                        onClick={handleNextStep}
                    >
                        Continue
                    </GamingButton>
                ) : (
                    <GamingButton
                        variant="accent"
                        size="lg"
                        onClick={handleSubmit}
                    >
                        Place Order
                    </GamingButton>
                )}
            </div>
        </div>
    );
}
