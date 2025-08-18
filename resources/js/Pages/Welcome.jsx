import { Header } from "@/Components/Layout/Header";
import { GamingButton } from "@/Components/ui/GamingButton";
import { VoucherCard } from "@/Components/ui/VoucherCard";

export default function HomePage({ featuredProducts = [], categories = [] }) {
    return (
        <div className="min-h-screen">
            <Header />

            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10"></div>
                <div className="container mx-auto text-center relative z-10">
                    <h1 className="font-heading font-bold text-5xl md:text-7xl mb-6 bg-gradient-to-r from-foreground via-accent to-primary bg-clip-text text-transparent">
                        Unlock Your Next Adventure
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Seamless purchases for gamers, by gamers. Get instant
                        access to your favorite gaming platforms.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <GamingButton
                            variant="accent"
                            size="lg"
                            onClick={() => (window.location.href = "/products")}
                        >
                            Explore Vouchers
                        </GamingButton>
                        <GamingButton variant="secondary" size="lg">
                            View Deals
                        </GamingButton>
                    </div>
                </div>
            </section>

            {/* Featured Vouchers */}
            <section className="py-16 px-4">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                            Top Picks for You
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Limited-time deals on the most popular gaming
                            vouchers
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <div className="text-center py-12">
                            <p className="text-muted-foreground text-lg">
                                No featured products available at the moment.
                            </p>
                            <GamingButton
                                variant="accent"
                                className="mt-4"
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
            <section className="py-16 px-4 bg-card/30">
                <div className="container mx-auto">
                    <h2 className="font-heading font-bold text-3xl md:text-4xl text-center mb-12">
                        Browse by Platform
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {categories.length > 0
                            ? categories.map((category) => (
                                  <div
                                      key={category.id}
                                      className="glass-card rounded-xl p-6 text-center hover-lift cursor-pointer group"
                                      onClick={() =>
                                          (window.location.href = `/products?category=${category.id}`)
                                      }
                                  >
                                      <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-accent">
                                          {category.logo ? (
                                              <img
                                                  src={`/storage/${category.logo}`}
                                                  alt={category.name}
                                                  className="w-full h-full object-cover"
                                              />
                                          ) : (
                                              <span className="text-2xl font-bold text-white">
                                                  {category.name[0]}
                                              </span>
                                          )}
                                      </div>
                                      <h3 className="font-heading font-semibold text-lg group-hover:text-accent transition-colors">
                                          {category.name}
                                      </h3>
                                  </div>
                              ))
                            : // Fallback to static categories if no categories in database
                              ["Steam", "PlayStation", "Xbox", "Nintendo"].map(
                                  (platform) => (
                                      <div
                                          key={platform}
                                          className="glass-card rounded-xl p-6 text-center hover-lift cursor-pointer group"
                                          onClick={() =>
                                              (window.location.href = `/products`)
                                          }
                                      >
                                          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                                              <span className="text-2xl font-bold text-white">
                                                  {platform[0]}
                                              </span>
                                          </div>
                                          <h3 className="font-heading font-semibold text-lg group-hover:text-accent transition-colors">
                                              {platform}
                                          </h3>
                                      </div>
                                  )
                              )}
                    </div>
                </div>
            </section>
        </div>
    );
}
