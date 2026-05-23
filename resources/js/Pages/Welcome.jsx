import { CategorySlider } from "@/Components/Home/CategorySlider";
import { Header } from "@/Components/Layout/Header";
import { GamingButton } from "@/Components/ui/GamingButton";
import { VoucherCard } from "@/Components/ui/VoucherCard";
import { Link, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function HomePage({
    featuredProducts = [],
    discountedProducts = [],
}) {
    const { categories = [] } = usePage().props;
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const onScroll = () => setShowScrollTop(window.scrollY > 300);
        window.addEventListener("scroll", onScroll);
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
    return (
        <div className="min-h-screen">
            <Header />

            {/* Hero Section */}
            <section className="relative py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 2xl:py-32 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10"></div>
                <div className="container mx-auto text-center relative z-10">
                    <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl mb-4 sm:mb-5 md:mb-6 lg:mb-8 xl:mb-10 2xl:mb-12 bg-gradient-to-r from-foreground via-accent to-primary bg-clip-text text-transparent leading-tight">
                        Unlock Your Next Adventure
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl 2xl:text-2xl text-muted-foreground mb-6 sm:mb-7 md:mb-8 lg:mb-8 xl:mb-10 2xl:mb-12 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto px-2 sm:px-0">
                        Seamless purchases for gamers, by gamers. Get instant
                        access to your favorite gaming platforms.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                        <Link href={route("products")}>
                            <GamingButton
                                variant="accent"
                                size="lg"
                                className="text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4"
                            >
                                Explore Vouchers
                            </GamingButton>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Vouchers */}
            <section className="py-8 sm:py-12 md:py-16 lg:py-16 xl:py-20 2xl:py-24 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-12">
                <div className="container mx-auto">
                    <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-12 xl:mb-16 2xl:mb-20">
                        <h2 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-5xl mb-3 sm:mb-4 md:mb-4 lg:mb-6 xl:mb-8 2xl:mb-10">
                            Top Picks for You
                        </h2>
                        <p className="text-muted-foreground text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-xl px-2 sm:px-0">
                            Limited-time deals on the most popular gaming
                            vouchers
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 2xl:gap-10">
                        {featuredProducts.map((product) => (
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
                                platform={product.category?.name || ""}
                                rating={product.average_rating}
                                reviewsCount={product.reviews_count}
                                href={route("product", product.id)}
                            />
                        ))}
                    </div>

                    {featuredProducts.length === 0 && (
                        <div className="text-center py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20 2xl:py-24">
                            <p className="text-muted-foreground text-base sm:text-lg lg:text-lg xl:text-xl 2xl:text-xl mb-4 sm:mb-6">
                                No featured products available at the moment.
                            </p>
                            <Link href={route("products")}>
                                <GamingButton
                                    variant="accent"
                                    className="mt-4 sm:mt-6 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
                                >
                                    Browse All Products
                                </GamingButton>
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Discounted Vouchers */}
            <section className="py-8 sm:py-12 md:py-16 lg:py-16 xl:py-20 2xl:py-24 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-12">
                <div className="container mx-auto">
                    <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-12 xl:mb-16 2xl:mb-20">
                        <h2 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-5xl mb-3 sm:mb-4 md:mb-4 lg:mb-6 xl:mb-8 2xl:mb-10">
                            Biggest Discounts
                        </h2>
                        <p className="text-muted-foreground text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-xl px-2 sm:px-0">
                            Save more on these top discounted vouchers
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 2xl:gap-10">
                        {discountedProducts.map((product) => (
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
                                platform={product.category?.name || ""}
                                rating={product.average_rating}
                                reviewsCount={product.reviews_count}
                                href={route("product", product.id)}
                            />
                        ))}
                    </div>

                    {discountedProducts.length === 0 && (
                        <div className="text-center py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20 2xl:py-24">
                            <p className="text-muted-foreground text-base sm:text-lg lg:text-lg xl:text-xl 2xl:text-xl mb-4 sm:mb-6">
                                No discounted products available at the moment.
                            </p>
                            <Link href={route("products")}>
                                <GamingButton
                                    variant="accent"
                                    className="mt-4 sm:mt-6 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
                                >
                                    Browse All Products
                                </GamingButton>
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Categories */}
            <section className="py-8 sm:py-12 md:py-16 lg:py-16 xl:py-20 2xl:py-24 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-12 bg-card/30">
                <div className="container mx-auto">
                    <h2 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-center mb-8 sm:mb-10 md:mb-12 lg:mb-12 xl:mb-16 2xl:mb-20">
                        Browse by Platform
                    </h2>

                    <CategorySlider categories={categories} />
                </div>
            </section>
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    aria-label="Move to top"
                    className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 bg-accent text-accent-foreground rounded-full shadow-lg hover:opacity-90 transition-opacity p-2 sm:p-3 md:p-4 text-lg sm:text-xl md:text-2xl"
                >
                    ↑
                </button>
            )}
        </div>
    );
}
