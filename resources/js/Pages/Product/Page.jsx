import { useState } from "react";
import { Header } from "@/Components/Layout/Header";
import { GamingButton } from "@/Components/ui/GamingButton";
import { ProductTabs } from "@/Components/Product/ProductTabs";
import { RelatedProducts } from "@/Components/Product/RelatedProducts";
import { Link, router } from "@inertiajs/react";

export default function ProductDetailsPage({
    product,
    auth,
    reviews,
    relatedProducts = [],
    userHasReviewed,
    userHasWishlisted = false,
    wishlistId = null,
}) {
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(userHasWishlisted);

    const discount = product.original_price
        ? Math.round(
              ((product.original_price - product.price) /
                  product.original_price) *
                  100
          )
        : 0;

    const addToCart = () => {
        // Check if product is in stock
        if ((product.stock || 0) === 0) {
            alert("This product is out of stock.");
            return;
        }

        // Check if requested quantity is available
        if (quantity > (product.stock || 0)) {
            alert(`Only ${product.stock} items available in stock.`);
            return;
        }

        setIsAddingToCart(true);

        router.post(
            "/cart/add",
            {
                product_id: product.id,
                quantity: quantity,
            },
            {
                onSuccess: () => {
                    alert("Product added to cart successfully!");
                    setIsAddingToCart(false);
                },
                onError: (errors) => {
                    console.error("Failed to add to cart:", errors);
                    alert("Failed to add product to cart. Please try again.");
                    setIsAddingToCart(false);
                },
            }
        );
    };

    const toggleWishlist = () => {
        if (!isWishlisted) {
            setIsWishlisted(true);
            router.post(
                "/wishlist/add",
                { product_id: product.id },
                {
                    preserveScroll: true,
                    onError: () => setIsWishlisted(false),
                    onFinish: () => {
                        // Optionally reload wishlist status if needed
                        router.reload({
                            only: ["userHasWishlisted", "wishlistId"],
                        });
                    },
                }
            );
        } else {
            setIsWishlisted(false);
            router.delete(`/wishlist/product/${product.id}`, {
                preserveScroll: true,
                onError: () => setIsWishlisted(true),
                onFinish: () => {
                    router.reload({
                        only: ["userHasWishlisted", "wishlistId"],
                    });
                },
            });
        }
    };

    return (
        <div className="min-h-screen">
            <Header />

            {/* Breadcrumb */}
            <div className="container mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-12 py-3 sm:py-4 md:py-4 lg:py-6 xl:py-8 2xl:py-10">
                <nav className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base text-muted-foreground">
                    <Link href={route("welcome")} className="hover:text-accent">
                        Home
                    </Link>
                    <span className="mx-1 sm:mx-2">/</span>
                    <Link
                        href={route("products")}
                        className="hover:text-accent"
                    >
                        Products
                    </Link>
                    <span className="mx-1 sm:mx-2">/</span>
                    <span className="text-foreground text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base">
                        {product.title}
                    </span>
                </nav>
            </div>

            <div className="container mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-12 py-4 sm:py-6 md:py-8 lg:py-8 xl:py-10 2xl:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 2xl:gap-20 mb-8 sm:mb-12 md:mb-16 lg:mb-16 xl:mb-20 2xl:mb-24">
                    {/* Product Image */}
                    <div className="space-y-3 sm:space-y-4 md:space-y-4 lg:space-y-6 xl:space-y-8 2xl:space-y-10">
                        <div className="glass-card rounded-xl p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 2xl:p-10">
                            <img
                                src={
                                    product.product_image
                                        ? `/storage/${product.product_image}`
                                        : "/placeholder.jpg"
                                }
                                alt={product.title}
                                className="w-full h-48 sm:h-56 md:h-64 lg:h-80 xl:h-96 2xl:h-[28rem] object-cover rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-6 xl:space-y-8 2xl:space-y-10">
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3 md:mb-3 lg:mb-4 xl:mb-5 2xl:mb-6">
                                <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base font-medium">
                                    {product.category.name}
                                </span>
                                {product.is_featured && (
                                    <span className="bg-accent/20 text-accent px-2 py-1 rounded text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base font-medium">
                                        ⭐ Featured
                                    </span>
                                )}
                            </div>

                            <h1 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-5xl mb-3 sm:mb-4 md:mb-4 lg:mb-6 xl:mb-8 2xl:mb-10 leading-tight">
                                {product.title}
                            </h1>

                            {product.average_rating > 0 && (
                                <div className="flex items-center gap-3 sm:gap-4 md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 mb-3 sm:mb-4 md:mb-4 lg:mb-6 xl:mb-8 2xl:mb-10">
                                    <div className="flex items-center gap-1">
                                        <div className="flex text-accent">
                                            {[...Array(5)].map((_, i) => (
                                                <span
                                                    key={i}
                                                    className={
                                                        i <
                                                        Math.floor(
                                                            product.average_rating
                                                        )
                                                            ? "text-accent"
                                                            : "text-muted-foreground/30"
                                                    }
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <span className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base text-muted-foreground ml-1">
                                            ({product.average_rating}) •{" "}
                                            {product.reviews_count} review
                                            {product.reviews_count !== 1
                                                ? "s"
                                                : ""}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 sm:space-y-4 md:space-y-4 lg:space-y6 xl:space-y-8 2xl:space-y-10">
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10">
                                <span className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-accent">
                                    Tk {product.price}
                                </span>
                                {product.original_price &&
                                    product.original_price > product.price && (
                                        <span className="text-lg sm:text-lg md:text-xl lg:text-xl xl:text-2xl 2xl:text-3xl text-muted-foreground line-through">
                                            Tk {product.original_price}
                                        </span>
                                    )}
                                {discount > 0 && (
                                    <span className="bg-accent text-accent-foreground px-2 sm:px-3 md:px-3 lg:px-4 xl:px-5 2xl:px-6 py-1 sm:py-1 md:py-1 lg:py-1.5 xl:py-2 2xl:py-2.5 rounded-full text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base font-semibold">
                                        Save {discount}%
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2 sm:space-y-2 md:space-y-3 lg:space-y-3 xl:space-y-4 2xl:space-y-5">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full ${
                                            product.stock > 0
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                        }`}
                                    ></span>
                                    <span className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base font-medium">
                                        {product.stock > 0
                                            ? "In Stock"
                                            : "Out of Stock"}
                                    </span>
                                </div>
                                <div className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base text-muted-foreground">
                                    <span className="font-medium">
                                        {product.stock}
                                    </span>{" "}
                                    codes available
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 sm:space-y-4 md:space-y-4 lg:space-y6 xl:space-y-8 2xl:space-y-10">
                            {/* Quantity Selector */}
                            {product.stock > 0 && (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10">
                                    <label className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base font-medium">
                                        Quantity:
                                    </label>
                                    <div className="flex items-center border border-border rounded-lg">
                                        <button
                                            onClick={() =>
                                                setQuantity(
                                                    Math.max(1, quantity - 1)
                                                )
                                            }
                                            className="px-2 sm:px-3 md:px-3 lg:px-4 xl:px-5 2xl:px-6 py-1.5 sm:py-2 md:py-2 lg:py-2.5 xl:py-3 2xl:py-3 hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                                            disabled={quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="px-3 sm:px-4 md:px-4 lg:px-5 xl:px-6 2xl:px-8 py-1.5 sm:py-2 md:py-2 lg:py-2.5 xl:py-3 2xl:py-3 min-w-[50px] sm:min-w-[60px] text-center border-l border-r border-border text-sm sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                setQuantity(
                                                    Math.min(
                                                        product.stock,
                                                        quantity + 1
                                                    )
                                                )
                                            }
                                            className="px-2 sm:px-3 md:px-3 lg:px-4 xl:px-5 2xl:px-6 py-1.5 sm:py-2 md:py-2 lg:py-2.5 xl:py-3 2xl:py-3 hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base"
                                            disabled={
                                                quantity >=
                                                (product.stock || 10)
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base text-muted-foreground">
                                        {product.stock || 0} available
                                    </span>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10">
                                <GamingButton
                                    variant="accent"
                                    size="lg"
                                    className="flex-1 text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base px-3 sm:px-4 md:px-4 lg:px-6 xl:px-8 2xl:px-10 py-2 sm:py-3 md:py-3 lg:py-4 xl:py-5 2xl:py-6"
                                    disabled={
                                        (product.stock || 0) === 0 ||
                                        isAddingToCart
                                    }
                                    onClick={addToCart}
                                >
                                    {isAddingToCart
                                        ? "Adding to Cart..."
                                        : (product.stock || 0) === 0
                                        ? "Out of Stock"
                                        : `Add to Cart - Tk ${(
                                              parseFloat(product.price) *
                                              quantity
                                          ).toFixed(2)}`}
                                </GamingButton>
                                <GamingButton
                                    variant="ghost"
                                    size="lg"
                                    onClick={toggleWishlist}
                                    title={
                                        isWishlisted
                                            ? "Remove from Wishlist"
                                            : "Add to Wishlist"
                                    }
                                    className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base px-3 sm:px-4 md:px-4 lg:px-6 xl:px-8 2xl:px-10 py-2 sm:py-3 md:py-3 lg:py-4 xl:py-5 2xl:py-6"
                                >
                                    {isWishlisted ? "♥" : "♡"}
                                </GamingButton>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Tabs */}
                <ProductTabs
                    product={product}
                    auth={auth}
                    reviews={reviews}
                    userHasReviewed={userHasReviewed}
                />

                {/* Related Products */}
                <RelatedProducts relatedProducts={relatedProducts} />
            </div>
        </div>
    );
}
