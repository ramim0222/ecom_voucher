import { Header } from "@/Components/Layout/Header";
import { GamingButton } from "@/Components/ui/GamingButton";
import { VoucherCard } from "@/Components/ui/VoucherCard";
import { useEffect, useState } from "react";

export default function HomePage({
    featuredProducts = [],
    discountedProducts = [],
    featuredCategories = [],
}) {
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
                        <GamingButton
                            variant="accent"
                            size="lg"
                            onClick={() => (window.location.href = "/products")}
                            className="text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4"
                        >
                            Explore Vouchers
                        </GamingButton>
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
                                onClick={() =>
                                    (window.location.href = `/products/${product.id}`)
                                }
                            />
                        ))}
                    </div>

                    {featuredProducts.length === 0 && (
                        <div className="text-center py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20 2xl:py-24">
                            <p className="text-muted-foreground text-base sm:text-lg lg:text-lg xl:text-xl 2xl:text-xl mb-4 sm:mb-6">
                                No featured products available at the moment.
                            </p>
                            <GamingButton
                                variant="accent"
                                className="mt-4 sm:mt-6 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
                                onClick={() =>
                                    (window.location.href = "/products")
                                }
                            >
                                Browse All Products
                            </GamingButton>
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
                                onClick={() =>
                                    (window.location.href = `/products/${product.id}`)
                                }
                            />
                        ))}
                    </div>

                    {discountedProducts.length === 0 && (
                        <div className="text-center py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20 2xl:py-24">
                            <p className="text-muted-foreground text-base sm:text-lg lg:text-lg xl:text-xl 2xl:text-xl mb-4 sm:mb-6">
                                No discounted products available at the moment.
                            </p>
                            <GamingButton
                                variant="accent"
                                className="mt-4 sm:mt-6 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
                                onClick={() =>
                                    (window.location.href = "/products")
                                }
                            >
                                Browse All Products
                            </GamingButton>
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

                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 2xl:gap-10">
                        {featuredCategories.length > 0
                            ? featuredCategories.map((category) => (
                                  <div
                                      key={category.id}
                                      className="glass-card rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 2xl:p-10 text-center hover-lift cursor-pointer group"
                                      onClick={() =>
                                          (window.location.href = `/products?category=${category.id}`)
                                      }
                                  >
                                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 mx-auto mb-3 sm:mb-4 md:mb-4 lg:mb-4 xl:mb-6 2xl:mb-8 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-accent">
                                          {category.logo ? (
                                              <img
                                                  src={`/storage/${category.logo}`}
                                                  alt={category.name}
                                                  className="w-full h-full object-cover"
                                              />
                                          ) : (
                                              <span className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-white">
                                                  {category.name[0]}
                                              </span>
                                          )}
                                      </div>
                                      <h3 className="font-heading font-semibold text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl group-hover:text-accent transition-colors">
                                          {category.name}
                                      </h3>
                                  </div>
                              ))
                            : // Fallback to static categories if no categories in database
                              ["Steam", "PlayStation", "Xbox", "Nintendo"].map(
                                  (platform) => (
                                      <div
                                          key={platform}
                                          className="glass-card rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 2xl:p-10 text-center hover-lift cursor-pointer group"
                                          onClick={() =>
                                              (window.location.href = `/products`)
                                          }
                                      >
                                          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 mx-auto mb-3 sm:mb-4 md:mb-4 lg:mb-4 xl:mb-6 2xl:mb-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                                              <span className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-white">
                                                  {platform[0]}
                                              </span>
                                          </div>
                                          <h3 className="font-heading font-semibold text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl group-hover:text-accent transition-colors">
                                              {platform}
                                          </h3>
                                      </div>
                                  )
                              )}
                    </div>
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
