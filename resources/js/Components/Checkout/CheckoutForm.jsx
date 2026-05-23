"use client";

import { useState } from "react";
import { usePage } from "@inertiajs/react";
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

const METHOD_LABELS = {
    bkash:  "bKash",
    nagad:  "Nagad",
    rocket: "Rocket",
};

const METHOD_STYLES = {
    bkash:  { bg: "bg-green-50 dark:bg-green-900/20", border: "border-green-200 dark:border-green-800", text: "text-green-700 dark:text-green-400" },
    nagad:  { bg: "bg-orange-50 dark:bg-orange-900/20", border: "border-orange-200 dark:border-orange-800", text: "text-orange-700 dark:text-orange-400" },
    rocket: { bg: "bg-purple-50 dark:bg-purple-900/20", border: "border-purple-200 dark:border-purple-800", text: "text-purple-700 dark:text-purple-400" },
};

export function CheckoutForm({ currentStep, onStepChange, orderData, user }) {
    const { paymentMethods = [] } = usePage().props;

    const paymentMethodOptions = paymentMethods.map((m) => ({
        value: m,
        label: METHOD_LABELS[m] ?? m,
    }));

    const defaultMethod = paymentMethods[0] ?? "";

    const { data, setData, post, processing, errors } = useForm({
        payment_method: defaultMethod,
        billing_address: {
            first_name: user?.first_name || "",
            last_name:  user?.last_name  || "",
            email:      user?.email      || "",
            phone:      user?.phone_number || "",
            address:    user?.street_address || "",
            city:       user?.city     || "",
            state:      user?.state    || "",
            zip:        user?.zip      || "",
            country:    user?.country  || "BD",
        },
        notes: "",
    });

    const [formData, setFormData] = useState({
        email:         user?.email          || "",
        firstName:     user?.first_name     || "",
        lastName:      user?.last_name      || "",
        phone:         user?.phone_number   || "",
        address:       user?.street_address || "",
        city:          user?.city           || "",
        state:         user?.state          || "",
        zipCode:       user?.zip            || "",
        country:       user?.country        || "BD",
        paymentMethod: defaultMethod,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        const addressFieldMap = {
            firstName: "first_name",
            lastName:  "last_name",
            address:   "address",
            zipCode:   "zip",
            state:     "state",
        };

        if (Object.keys(addressFieldMap).includes(name) || ["email", "phone", "city", "country"].includes(name)) {
            const addressField = addressFieldMap[name] ?? name;
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
            return !!formData.paymentMethod;
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
            preserveScroll: true,
            onError: (errs) => {
                console.error("Order creation failed:", errs);
                alert("Failed to create order. Please try again.");
            },
        });
    };

    const selectedStyle = METHOD_STYLES[formData.paymentMethod] ?? METHOD_STYLES.bkash;

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
                        Payment Method
                    </h2>

                    {paymentMethodOptions.length === 0 ? (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-yellow-700 dark:text-yellow-400 text-sm">
                            No payment methods are currently available. Please
                            contact the store.
                        </div>
                    ) : (
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Select Payment Method
                                </label>
                                <ThemedSelect
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleThemedSelectChange("paymentMethod")}
                                    options={paymentMethodOptions}
                                />
                            </div>

                            {formData.paymentMethod && (
                                <div
                                    className={`${selectedStyle.bg} border ${selectedStyle.border} rounded-lg p-4`}
                                >
                                    <p className={`font-medium mb-1 ${selectedStyle.text}`}>
                                        {METHOD_LABELS[formData.paymentMethod]} Payment
                                    </p>
                                    <p className={`text-sm ${selectedStyle.text}`}>
                                        After placing your order you will be redirected to the{" "}
                                        {METHOD_LABELS[formData.paymentMethod]} payment page to
                                        complete the transaction securely.
                                    </p>
                                </div>
                            )}
                        </form>
                    )}
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
                                {METHOD_LABELS[formData.paymentMethod] ?? formData.paymentMethod}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                You will be redirected to complete payment after placing your order.
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
                            processing ||
                            !validateStep(1) ||
                            !validateStep(2) ||
                            paymentMethodOptions.length === 0
                        }
                    >
                        {processing ? "Processing..." : "Place Order & Pay"}
                    </GamingButton>
                )}
            </div>
        </div>
    );
}
