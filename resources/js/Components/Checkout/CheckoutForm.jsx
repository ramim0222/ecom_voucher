"use client";

import { useState } from "react";
import { GamingButton } from "@/Components/ui/GamingButton";
import { ThemedSelect } from "@/Components/ui/ThemedSelect";
import { useForm } from "@inertiajs/react";

const countryOptions = [
    { value: "", label: "Select Country" },
    { value: "BD", label: "Bangladesh" },
    { value: "IN", label: "India" },
    { value: "PK", label: "Pakistan" },
    { value: "US", label: "United States" },
    { value: "CA", label: "Canada" },
    { value: "UK", label: "United Kingdom" },
];

const paymentMethodOptions = [
    { value: "card", label: "Credit/Debit Card" },
    { value: "bkash", label: "bKash" },
    { value: "rocket", label: "Rocket" },
    { value: "nagad", label: "Nagad" },
];

export function CheckoutForm({ currentStep, onStepChange, orderData, user }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        payment_method: "card",
        billing_address: {
            first_name: user?.first_name || "",
            last_name: user?.last_name || "",
            email: user?.email || "",
            phone: user?.phone_number || "",
            address: user?.street_address || "",
            city: user?.city || "",
            state: user?.state || "",
            zip: user?.zip || "",
            country: user?.country || "BD",
        },
        notes: "",
    });

    const [formData, setFormData] = useState({
        email: user?.email || "",
        firstName: user?.first_name || "",
        lastName: user?.last_name || "",
        phone: user?.phone_number || "",
        address: user?.street_address || "",
        city: user?.city || "",
        state: user?.state || "",
        zipCode: user?.zip || "",
        country: user?.country || "BD",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardName: "",
        paymentMethod: "card",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Update Inertia form data for billing address
        if (
            [
                "firstName",
                "lastName",
                "email",
                "phone",
                "address",
                "city",
                "state",
                "zipCode",
                "country",
            ].includes(name)
        ) {
            const addressField =
                {
                    firstName: "first_name",
                    lastName: "last_name",
                    address: "address",
                    zipCode: "zip",
                    state: "state",
                }[name] || name;

            setData("billing_address", {
                ...data.billing_address,
                [addressField]: value,
            });
        }

        if (name === "paymentMethod") {
            setData("payment_method", value);
        }
    };

    const handleThemedSelectChange = (name) => (value) => {
        handleInputChange({ target: { name, value } });
    };

    const validateStep = (step) => {
        if (step === 1) {
            return (
                formData.firstName &&
                formData.lastName &&
                formData.email &&
                formData.address &&
                formData.city &&
                formData.zipCode &&
                formData.country
            );
        }
        if (step === 2) {
            return (
                formData.paymentMethod === "bkash" ||
                (formData.cardNumber &&
                    formData.expiryDate &&
                    formData.cvv &&
                    formData.cardName)
            );
        }
        return true;
    };

    const handleNextStep = () => {
        if (currentStep < 3 && validateStep(currentStep)) {
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

        if (!validateStep(1) || !validateStep(2)) {
            alert("Please fill in all required fields");
            return;
        }

        const endpoint = user
            ? route("orders.create-from-cart")
            : route("orders.guest-create");

        post(endpoint, {
            onSuccess: () => {},
            onError: (errors) => {
                console.error("Order creation failed:", errors);
                alert("Failed to create order. Please try again.");
            },
        });
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
                                required
                            />
                            {errors["billing_address.email"] && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors["billing_address.email"]}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="+880 1234 567890"
                                required
                            />
                            {errors["billing_address.phone"] && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors["billing_address.phone"]}
                                </p>
                            )}
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
                                    required
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
                                    required
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                    placeholder="Dhaka"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    State/Division
                                </label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Dhaka"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                    placeholder="1000"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Country
                                </label>
                                <ThemedSelect
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleThemedSelectChange("country")}
                                    options={countryOptions}
                                    placeholder="Select Country"
                                />
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
                                Payment Method
                            </label>
                            <ThemedSelect
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleThemedSelectChange("paymentMethod")}
                                options={paymentMethodOptions}
                            />
                        </div>

                        {formData.paymentMethod === "card" && (
                            <>
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
                                        required={
                                            formData.paymentMethod === "card"
                                        }
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
                                            required={
                                                formData.paymentMethod ===
                                                "card"
                                            }
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
                                            required={
                                                formData.paymentMethod ===
                                                "card"
                                            }
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
                                        required={
                                            formData.paymentMethod === "card"
                                        }
                                    />
                                </div>
                            </>
                        )}

                        {formData.paymentMethod === "bkash" && (
                            <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-lg p-4">
                                <div className="flex items-center mb-2">
                                    <span className="text-pink-600 dark:text-pink-400 font-medium">
                                        bKash Payment
                                    </span>
                                </div>
                                <p className="text-sm text-pink-600 dark:text-pink-400">
                                    You will be redirected to bKash payment
                                    gateway after placing the order.
                                </p>
                            </div>
                        )}

                        {(formData.paymentMethod === "rocket" ||
                            formData.paymentMethod === "nagad") && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <div className="flex items-center mb-2">
                                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                                        {formData.paymentMethod === "rocket"
                                            ? "Rocket"
                                            : "Nagad"}{" "}
                                        Payment
                                    </span>
                                </div>
                                <p className="text-sm text-blue-600 dark:text-blue-400">
                                    You will be redirected to{" "}
                                    {formData.paymentMethod === "rocket"
                                        ? "Rocket"
                                        : "Nagad"}{" "}
                                    payment gateway after placing the order.
                                </p>
                            </div>
                        )}
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
                        disabled={!validateStep(currentStep)}
                    >
                        Continue
                    </GamingButton>
                ) : (
                    <GamingButton
                        variant="accent"
                        size="lg"
                        onClick={handleSubmit}
                        disabled={
                            processing || !validateStep(1) || !validateStep(2)
                        }
                    >
                        {processing ? "Processing..." : "Place Order"}
                    </GamingButton>
                )}
            </div>
        </div>
    );
}
