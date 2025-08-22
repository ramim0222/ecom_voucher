import { useState } from "react";
import { ProductReviews } from "./ProductReviews";
import { ProductFeatures } from "./ProductFeatures";

export function ProductTabs({ product, auth, reviews, userHasReviewed }) {
    const [activeTab, setActiveTab] = useState("description");

    return (
        <div className="glass-card rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 2xl:p-10">
            {/* Tab Navigation */}
            <div className="flex flex-col sm:flex-row border-b border-border mb-4 sm:mb-5 md:mb-6 lg:mb-6 xl:mb-8 2xl:mb-10">
                <button
                    onClick={() => setActiveTab("description")}
                    className={`px-2 sm:px-3 md:px-4 lg:px-4 xl:px-6 2xl:px-8 py-2 sm:py-2.5 md:py-3 lg:py-3 xl:py-4 2xl:py-5 border-b-2 transition-colors text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base font-medium ${
                        activeTab === "description"
                            ? "border-accent text-accent"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                    Description
                </button>
                <button
                    onClick={() => setActiveTab("features")}
                    className={`px-2 sm:px-3 md:px-4 lg:px-4 xl:px-6 2xl:px-8 py-2 sm:py-2.5 md:py-3 lg:py-3 xl:py-4 2xl:py-5 border-b-2 transition-colors text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base font-medium ${
                        activeTab === "features"
                            ? "border-accent text-accent"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                    Features
                </button>
                <button
                    onClick={() => setActiveTab("reviews")}
                    className={`px-2 sm:px-3 md:px-4 lg:px-4 xl:px-6 2xl:px-8 py-2 sm:py-2.5 md:py-3 lg:py-3 xl:py-4 2xl:py-5 border-b-2 transition-colors text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base font-medium ${
                        activeTab === "reviews"
                            ? "border-accent text-accent"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                    <span className="hidden sm:inline">Reviews</span>
                    <span className="sm:hidden">Reviews</span>
                    <span className="ml-1 sm:ml-2">
                        ({product.reviews_count || 0})
                    </span>
                </button>
            </div>

            {/* Tab Content */}
            <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-6 xl:space-y-8 2xl:space-y-10">
                {activeTab === "description" ? (
                    <>
                        <div>
                            <h3 className="font-heading font-semibold text-lg sm:text-xl md:text-xl lg:text-xl xl:text-2xl 2xl:text-3xl mb-3 sm:mb-4 md:mb-4 lg:mb-6 xl:mb-8 2xl:mb-10">
                                Product Description
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-sm sm:text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl">
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
