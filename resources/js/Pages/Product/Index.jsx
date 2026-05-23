"use client";

import { SiteLayout } from "@/Components/Layout/SiteLayout";
import { PageHead } from "@/Components/PageHead";
import { VoucherCard } from "@/Components/ui/VoucherCard";
import { GamingButton } from "@/Components/ui/GamingButton";
import { ProductFilters } from "@/Components/Product/ProductFilter";
import { ProductSort } from "@/Components/Product/ProductSort";
import { Link, usePage } from "@inertiajs/react";
import { useRef, useState } from "react";
import { usePageAnimations } from "@/hooks/usePageAnimations";

export default function ProductsPage({ products = [], filters = {} }) {
    const { branding = {}, categories = [] } = usePage().props;
    const productsTitle = branding?.products_title || "Gaming Vouchers";
    const productsDescription =
        branding?.products_description ||
        "Discover the best deals on gaming vouchers for all your favorite platforms";
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const refs = usePageAnimations({ header: true, sidebar: true, grid: true });

    const activeCategoryNames = (filters.categories ?? [])
        .map((id) => categories.find((c) => String(c.id) === String(id))?.name)
        .filter(Boolean);

    const toggleFilters = () => {
        setIsFiltersOpen(!isFiltersOpen);
    };

    return (
        <SiteLayout>
            <PageHead title={productsTitle} />

            {/* Page Header */}
            <section className="py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16 2xl:py-20 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-12 bg-gradient-to-r from-primary/10 to-accent/5">
                <div className="container mx-auto">
                    <div ref={refs.header} className="text-center mb-6 sm:mb-8 lg:mb-8 xl:mb-10 2xl:mb-12">
                        <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl mb-3 sm:mb-4 md:mb-4 lg:mb-6 xl:mb-8 2xl:mb-10">
                            {productsTitle}
                        </h1>
                        <p className="text-muted-foreground text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-xl max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto px-2 sm:px-0">
                            {productsDescription}
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 items-center justify-between">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <span className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base text-muted-foreground">
                                Showing {products.length} results
                            </span>
                            {activeCategoryNames.map((name) => (
                                <span
                                    key={name}
                                    className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full"
                                >
                                    {name}
                                </span>
                            ))}
                        </div>
                        <ProductSort filters={filters} />
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-12 py-4 sm:py-6 md:py-8 lg:py-8 xl:py-10 2xl:py-12">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
                    {/* Mobile Filters Toggle */}
                    <div className="lg:hidden flex justify-between items-center mb-4 sm:mb-6">
                        <h2 className="font-heading font-semibold text-lg sm:text-xl md:text-xl">
                            Filters
                        </h2>
                        <GamingButton
                            variant="ghost"
                            size="sm"
                            onClick={toggleFilters}
                            className="text-sm sm:text-base px-3 sm:px-4 py-2"
                        >
                            {isFiltersOpen ? "Hide Filters" : "Show Filters"}
                        </GamingButton>
                    </div>

                    {/* Filters Sidebar */}
                    <aside
                        ref={refs.sidebar}
                        className={`lg:w-64 lg:flex-shrink-0 ${
                            isFiltersOpen ? "block" : "hidden lg:block"
                        }`}
                    >
                        <div className="lg:sticky lg:top-24">
                            <ProductFilters
                                filters={filters}
                                categories={categories}
                            />
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <main className="flex-1">
                        <div
                            ref={refs.grid}
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 2xl:gap-10"
                        >
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
                                            (c) =>
                                                Number(c.id) ===
                                                Number(product.category_id)
                                        )?.name || ""
                                    }
                                    rating={product.average_rating}
                                    reviewsCount={product.reviews_count}
                                    href={route("product", product.slug)}
                                />
                            ))}
                        </div>

                        {/* Empty State */}
                        {products.length === 0 && (
                            <div className="text-center py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32">
                                <p className="text-muted-foreground text-base sm:text-lg lg:text-lg xl:text-xl 2xl:text-xl mb-4 sm:mb-6">
                                    No products found matching your criteria.
                                </p>
                                <Link href={route("products")}>
                                    <GamingButton
                                        variant="accent"
                                        className="text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
                                    >
                                        View All Products
                                    </GamingButton>
                                </Link>
                            </div>
                        )}

                        {/* Pagination */}
                        {products.length > 0 && (
                            <div className="flex justify-center mt-8 sm:mt-10 md:mt-12 lg:mt-12 xl:mt-16 2xl:mt-20">
                                <div className="flex items-center gap-1 sm:gap-2 md:gap-2 lg:gap-3 xl:gap-4 2xl:gap-5">
                                    <GamingButton
                                        variant="ghost"
                                        size="sm"
                                        disabled
                                        className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base px-2 sm:px-3 md:px-3 lg:px-4 xl:px-5 2xl:px-6 py-1.5 sm:py-2 md:py-2 lg:py-2.5 xl:py-3 2xl:py-3"
                                    >
                                        Previous
                                    </GamingButton>
                                    <GamingButton
                                        variant="primary"
                                        size="sm"
                                        className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base px-2 sm:px-3 md:px-3 lg:px-4 xl:px-5 2xl:px-6 py-1.5 sm:py-2 md:py-2 lg:py-2.5 xl:py-3 2xl:py-3"
                                    >
                                        1
                                    </GamingButton>
                                    <GamingButton
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base px-2 sm:px-3 md:px-3 lg:px-4 xl:px-5 2xl:px-6 py-1.5 sm:py-2 md:py-2 lg:py-2.5 xl:py-3 2xl:py-3"
                                    >
                                        2
                                    </GamingButton>
                                    <GamingButton
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base px-2 sm:px-3 md:px-3 lg:px-4 xl:px-5 2xl:px-6 py-1.5 sm:py-2 md:py-2 lg:py-2.5 xl:py-3 2xl:py-3"
                                    >
                                        3
                                    </GamingButton>
                                    <GamingButton
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base px-2 sm:px-3 md:px-3 lg:px-4 xl:px-5 2xl:px-6 py-1.5 sm:py-2 md:py-2 lg:py-2.5 xl:py-3 2xl:py-3"
                                    >
                                        Next
                                    </GamingButton>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </SiteLayout>
    );
}
