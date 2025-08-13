import { Header } from "@/Components/Layout/Header";
import { GamingButton } from "@/Components/ui/GamingButton";
import { ProductTabs } from "@/Components/Product/ProductTabs";
import { RelatedProducts } from "@/Components/Product/RelatedProducts";

export default function ProductDetailsPage({ id }) {
    const product = {
        id: id,
        title: "Steam Wallet $50",
        price: "45.99",
        originalPrice: "50.00",
        discount: 8,
        platform: "Steam",
        rating: 4.8,
        reviews: 1247,
        category: "PC Gaming",
        availability: "In Stock",
        deliveryTime: "Instant",
        description:
            "Add funds to your Steam Wallet and enjoy thousands of games available on the Steam platform. Perfect for purchasing games, DLC, and in-game items.",
        features: [
            "Instant digital delivery",
            "No expiration date",
            "Works worldwide",
            "24/7 customer support",
        ],
        howToRedeem: [
            "Log into your Steam account",
            "Go to 'Account Details'",
            "Click 'Add funds to your Steam Wallet'",
            "Enter the code and click 'Continue'",
        ],
    };

    return (
        <div className="min-h-screen">
            <Header />

            {/* Breadcrumb */}
            <div className="container mx-auto px-4 py-4">
                <nav className="text-sm text-muted-foreground">
                    <a href="/" className="hover:text-accent">
                        Home
                    </a>
                    <span className="mx-2">/</span>
                    <a href="/products" className="hover:text-accent">
                        Products
                    </a>
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
                                src={`/abstract-geometric-shapes.png?height=400&width=600&query=${product.title} voucher card`}
                                alt={product.title}
                                className="w-full h-96 object-cover rounded-lg"
                            />
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="flex gap-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="w-20 h-20 glass-card rounded-lg p-1 cursor-pointer hover-lift"
                                >
                                    <img
                                        src={`/abstract-geometric-shapes.png?height=80&width=80&query=${product.title} thumbnail ${i}`}
                                        alt={`${product.title} view ${i}`}
                                        className="w-full h-full object-cover rounded"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm font-medium">
                                    {product.platform}
                                </span>
                                <span className="bg-accent/20 text-accent px-2 py-1 rounded text-sm font-medium">
                                    {product.deliveryTime} Delivery
                                </span>
                            </div>

                            <h1 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                                {product.title}
                            </h1>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1">
                                    <div className="flex text-accent">
                                        {[...Array(5)].map((_, i) => (
                                            <span
                                                key={i}
                                                className={
                                                    i <
                                                    Math.floor(product.rating)
                                                        ? "text-accent"
                                                        : "text-muted"
                                                }
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-sm text-muted-foreground ml-1">
                                        ({product.rating}) • {product.reviews}{" "}
                                        reviews
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-bold text-accent">
                                    ${product.price}
                                </span>
                                {product.originalPrice && (
                                    <span className="text-xl text-muted-foreground line-through">
                                        ${product.originalPrice}
                                    </span>
                                )}
                                {product.discount && (
                                    <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
                                        Save {product.discount}%
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                <span className="text-sm font-medium">
                                    {product.availability}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <GamingButton
                                    variant="accent"
                                    size="lg"
                                    className="flex-1"
                                >
                                    Add to Cart - ${product.price}
                                </GamingButton>
                                <GamingButton variant="ghost" size="lg">
                                    ♡
                                </GamingButton>
                            </div>

                            <GamingButton
                                variant="primary"
                                size="lg"
                                className="w-full"
                            >
                                Buy Now
                            </GamingButton>
                        </div>

                        <div className="glass-card rounded-lg p-4 space-y-3">
                            <h3 className="font-semibold">Key Features:</h3>
                            <ul className="space-y-2">
                                {product.features.map((feature, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Product Tabs */}
                <ProductTabs product={product} />

                {/* Related Products */}
                <RelatedProducts currentProductId={product.id} />
            </div>
        </div>
    );
}
