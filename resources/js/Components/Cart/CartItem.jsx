"use client";

import { GamingButton } from "@/Components/ui/GamingButton";

export function CartItem({ item, onUpdateQuantity, onRemove }) {
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
                                Quantity:
                            </span>
                            <div className="flex items-center gap-2">
                                <GamingButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        onUpdateQuantity(
                                            item.id,
                                            item.quantity - 1
                                        )
                                    }
                                    disabled={item.quantity <= 1}
                                    className="w-8 h-8 p-0"
                                >
                                    -
                                </GamingButton>
                                <span className="w-8 text-center">
                                    {item.quantity}
                                </span>
                                <GamingButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        onUpdateQuantity(
                                            item.id,
                                            item.quantity + 1
                                        )
                                    }
                                    className="w-8 h-8 p-0"
                                >
                                    +
                                </GamingButton>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {item.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                    ${item.originalPrice.toFixed(2)}
                                </span>
                            )}
                            <span className="text-xl font-bold text-accent">
                                ${(item.price * item.quantity).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
