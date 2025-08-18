"use client";

import { Header } from "@/Components/Layout/Header";
import { VoucherCard } from "@/Components/ui/VoucherCard";
import { GamingButton } from "@/Components/ui/GamingButton";
import { ProductFilters } from "@/Components/Product/ProductFilter";
import { ProductSort } from "@/Components/Product/ProductSort";
import { usePage } from "@inertiajs/react";

export default function ProductsPage({ products = [], activeCategory = null }) {
    const { categories = [] } = usePage().props;

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
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                Showing {products.length} results
                            </span>
                            {activeCategory && (
                                <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                                    {categories.find(
                                        (c) => c.id === activeCategory
                                    )?.name || "Selected"}
                                </span>
                            )}
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
                                    title={product.title}
                                    price={product.price}
                                    originalPrice={product.original_price}
                                    discount={
                                        product.original_price &&
                                        product.original_price > product.price
                                            ? Math.round(
                                                  ((product.original_price -
                                                      product.price) /
                                                      product.original_price) *
                                                      100
                                              )
                                            : null
                                    }
                                    image={
                                        product.product_image
                                            ? `/storage/${product.product_image}`
                                            : null
                                    }
                                    platform={
                                        categories.find(
                                            (c) => c.id === product.category_id
                                        )?.name || ""
                                    }
                                    rating={product.average_rating}
                                    reviewsCount={product.reviews_count}
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
