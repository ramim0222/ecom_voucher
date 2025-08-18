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
    userHasReviewed,
}) {
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    // Debug: Log product data to console
    console.log("Product data:", product);
    console.log("Product stock:", product.stock);
    console.log("Product stock type:", typeof product.stock);

    const discount = product.original_price
        ? Math.round(
              ((product.original_price - product.price) /
                  product.original_price) *
                  100
          )
        : 0;

    const addToCart = () => {
        // Check if user is authenticated
        if (!auth.user) {
            router.visit("/login");
            return;
        }

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

    return (
        <div className="min-h-screen">
            <Header />

            {/* Breadcrumb */}
            <div className="container mx-auto px-4 py-4">
                <nav className="text-sm text-muted-foreground">
                    <Link href={route("welcome")} className="hover:text-accent">
                        Home
                    </Link>
                    <span className="mx-2">/</span>
                    <Link
                        href={route("products")}
                        className="hover:text-accent"
                    >
                        Products
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground">{product.title}</span>
                </nav>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Product Image */}
                    <div className="space-y-4">
                        <div className="glass-card rounded-xl p-4">
                            <img
                                src={
                                    product.product_image
                                        ? `/storage/${product.product_image}`
                                        : "/placeholder.jpg"
                                }
                                alt={product.title}
                                className="w-full h-96 object-cover rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm font-medium">
                                    {product.category.name}
                                </span>
                                {product.is_featured && (
                                    <span className="bg-accent/20 text-accent px-2 py-1 rounded text-sm font-medium">
                                        ⭐ Featured
                                    </span>
                                )}
                            </div>

                            <h1 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                                {product.title}
                            </h1>

                            {product.average_rating > 0 && (
                                <div className="flex items-center gap-4 mb-4">
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
                                        <span className="text-sm text-muted-foreground ml-1">
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

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-bold text-accent">
                                    ${product.price}
                                </span>
                                {product.original_price &&
                                    product.original_price > product.price && (
                                        <span className="text-xl text-muted-foreground line-through">
                                            ${product.original_price}
                                        </span>
                                    )}
                                {discount > 0 && (
                                    <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
                                        Save {discount}%
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`w-3 h-3 rounded-full ${
                                            product.stock > 0
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                        }`}
                                    ></span>
                                    <span className="text-sm font-medium">
                                        {product.stock > 0
                                            ? "In Stock"
                                            : "Out of Stock"}
                                    </span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    <span className="font-medium">
                                        {product.stock}
                                    </span>{" "}
                                    codes available
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Quantity Selector */}
                            {(product.stock > 0 ||
                                true) /* Temporarily always show for debugging */ && (
                                <div className="flex items-center gap-4">
                                    <label className="text-sm font-medium">
                                        Quantity:
                                    </label>
                                    <div className="flex items-center border border-border rounded-lg">
                                        <button
                                            onClick={() =>
                                                setQuantity(
                                                    Math.max(1, quantity - 1)
                                                )
                                            }
                                            className="px-3 py-2 hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-2 min-w-[60px] text-center border-l border-r border-border">
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
                                            className="px-3 py-2 hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={
                                                quantity >=
                                                (product.stock || 10)
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        {product.stock || 0} available
                                    </span>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <GamingButton
                                    variant="accent"
                                    size="lg"
                                    className="flex-1"
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
                                        : auth.user
                                        ? `Add to Cart - $${(
                                              parseFloat(product.price) *
                                              quantity
                                          ).toFixed(2)}`
                                        : "Login to Add to Cart"}
                                </GamingButton>
                                <GamingButton variant="ghost" size="lg">
                                    ♡
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
                <RelatedProducts currentProductId={product.id} />
            </div>
        </div>
    );
}
