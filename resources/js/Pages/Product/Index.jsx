"use client";

import { Header } from "@/Components/Layout/Header";
import { VoucherCard } from "@/Components/ui/VoucherCard";
import { GamingButton } from "@/Components/ui/GamingButton";
import { ProductFilters } from "@/Components/Product/ProductFilter";
import { ProductSort } from "@/Components/Product/ProductSort";

export default function ProductsPage() {
    const products = [
        {
            id: 1,
            title: "Steam Wallet $50",
            price: "45.99",
            originalPrice: "50.00",
            discount: 8,
            platform: "Steam",
            rating: 4.8,
            category: "PC Gaming",
            availability: "In Stock",
        },
        {
            id: 2,
            title: "PlayStation Store $25",
            price: "22.99",
            originalPrice: "25.00",
            discount: 8,
            platform: "PlayStation",
            rating: 4.9,
            category: "Console Gaming",
            availability: "In Stock",
        },
        {
            id: 3,
            title: "Xbox Game Pass 3 Months",
            price: "29.99",
            originalPrice: "35.99",
            discount: 17,
            platform: "Xbox",
            rating: 4.7,
            category: "Console Gaming",
            availability: "In Stock",
        },
        {
            id: 4,
            title: "Nintendo eShop $20",
            price: "18.99",
            originalPrice: "20.00",
            discount: 5,
            platform: "Nintendo",
            rating: 4.6,
            category: "Console Gaming",
            availability: "In Stock",
        },
        {
            id: 5,
            title: "Epic Games Store $15",
            price: "13.99",
            originalPrice: "15.00",
            discount: 7,
            platform: "Epic Games",
            rating: 4.5,
            category: "PC Gaming",
            availability: "In Stock",
        },
        {
            id: 6,
            title: "Google Play $10",
            price: "9.49",
            originalPrice: "10.00",
            discount: 5,
            platform: "Google Play",
            rating: 4.4,
            category: "Mobile Gaming",
            availability: "In Stock",
        },
    ];

    return (
        <div className="min-h-screen">
            <Header />

            {/* Page Header */}
            <section className="py-12 px-4 bg-gradient-to-r from-primary/10 to-accent/5">
                <div className="container mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
                            Gaming Vouchers
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Discover the best deals on gaming vouchers for all
                            your favorite platforms
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm text-muted-foreground">
                                Showing {products.length} results
                            </span>
                        </div>
                        <ProductSort />
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <ProductFilters />
                    </aside>

                    {/* Products Grid */}
                    <main className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <VoucherCard
                                    key={product.id}
                                    {...product}
                                    onClick={() =>
                                        (window.location.href = `/products/${product.id}`)
                                    }
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center mt-12">
                            <div className="flex items-center gap-2">
                                <GamingButton
                                    variant="ghost"
                                    size="sm"
                                    disabled
                                >
                                    Previous
                                </GamingButton>
                                <GamingButton variant="primary" size="sm">
                                    1
                                </GamingButton>
                                <GamingButton variant="ghost" size="sm">
                                    2
                                </GamingButton>
                                <GamingButton variant="ghost" size="sm">
                                    3
                                </GamingButton>
                                <GamingButton variant="ghost" size="sm">
                                    Next
                                </GamingButton>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
