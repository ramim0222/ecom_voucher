import { useState } from "react";
import { ProductReviews } from "./ProductReviews";

export function ProductTabs({ product, auth }) {
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
                    onClick={() => setActiveTab("reviews")}
                    className={`px-4 py-2 border-b-2 transition-colors ${
                        activeTab === "reviews"
                            ? "border-accent text-accent"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                    } font-medium`}
                >
                    Reviews ({product.reviews})
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

                        {product.features &&
                            Array.isArray(product.features) &&
                            product.features.length > 0 && (
                                <div>
                                    <h4 className="font-medium mb-3">
                                        What's Included:
                                    </h4>
                                    <ul className="space-y-2">
                                        {product.features.map(
                                            (feature, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-center gap-2"
                                                >
                                                    <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                                                    <span className="text-sm">
                                                        {feature}
                                                    </span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}
                    </>
                ) : (
                    <ProductReviews product={product} auth={auth} />
                )}
            </div>
        </div>
    );
}
