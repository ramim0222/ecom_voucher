import { useState } from "react";
import { ProductReviews } from "./ProductReviews";
import { ProductFeatures } from "./ProductFeatures";

export function ProductTabs({ product, auth, reviews, userHasReviewed }) {
    const [activeTab, setActiveTab] = useState("description");

    return (
        <div className="glass-card rounded-xl p-6">
            <div className="flex border-b border-border mb-6">
                <button
                    onClick={() => setActiveTab("description")}
                    className={`px-4 py-2 border-b-2 transition-colors ${
                        activeTab === "description"
                            ? "border-accent text-accent"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    } font-medium`}
                >
                    Description
                </button>
                <button
                    onClick={() => setActiveTab("features")}
                    className={`px-4 py-2 border-b-2 transition-colors ${
                        activeTab === "features"
                            ? "border-accent text-accent"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    } font-medium`}
                >
                    Features
                </button>
                <button
                    onClick={() => setActiveTab("reviews")}
                    className={`px-4 py-2 border-b-2 transition-colors ${
                        activeTab === "reviews"
                            ? "border-accent text-accent"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    } font-medium`}
                >
                    Reviews ({product.reviews_count || 0})
                </button>
            </div>

            <div className="space-y-6">
                {activeTab === "description" ? (
                    <>
                        <div>
                            <h3 className="font-heading font-semibold text-xl mb-4">
                                Product Description
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {product.description}
                            </p>
                        </div>
                    </>
                ) : activeTab === "reviews" ? (
                    <ProductReviews
                        product={product}
                        auth={auth}
                        reviews={reviews}
                        userHasReviewed={userHasReviewed}
                    />
                ) : activeTab === "features" ? (
                    <ProductFeatures product={product} />
                ) : null}
            </div>
        </div>
    );
}
