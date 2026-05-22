"use client";

import { GamingButton } from "@/Components/ui/GamingButton";

export function WishlistItem({ item, onMoveToCart, onRemove }) {
    return (
        <div className="glass-card rounded-xl p-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-shrink-0">
                    <img
                        src={
                            item.image ||
                            `/placeholder.svg?height=120&width=160&query=${item.title}`
                        }
                        alt={item.title}
                        className="w-full sm:w-32 h-24 object-cover rounded-lg"
                    />
                </div>

                <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                            <h3 className="font-heading font-semibold text-lg">
                                {item.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {item.platform}
                            </p>
                            {item.stock && item.stock < 10 && (
                                <p className="text-xs text-orange-500">
                                    Only {item.stock} left in stock
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => onRemove(item.id)}
                            className="text-destructive hover:text-destructive/80 text-sm self-start"
                        >
                            Remove
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">
                                Status:
                            </span>
                            <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                    item.stock > 0
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                }`}
                            >
                                {item.stock > 0 ? "In Stock" : "Out of Stock"}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            {item.originalPrice &&
                                typeof item.originalPrice === "number" && (
                                    <span className="text-sm text-muted-foreground line-through">
                                        Tk {item.originalPrice.toFixed(2)}
                                    </span>
                                )}
                            <span className="text-xl font-bold text-accent">
                                Tk {item.price.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <GamingButton
                            variant="accent"
                            size="sm"
                            onClick={() => onMoveToCart(item)}
                            disabled={item.stock === 0}
                            className="flex-1 sm:flex-none"
                        >
                            {item.stock > 0 ? "Move to Cart" : "Out of Stock"}
                        </GamingButton>
                        <GamingButton
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                (window.location.href = `/products/${item.product_id}`)
                            }
                            className="flex-1 sm:flex-none"
                        >
                            View Details
                        </GamingButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
