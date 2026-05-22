import { cn } from "@/lib/utils";
import { GamingButton } from "./GamingButton";

export function VoucherCard({
    title,
    price,
    originalPrice,
    discount,
    image,
    platform,
    rating,
    reviewsCount,
    className,
    ...props
}) {
    return (
        <div
            className={cn(
                "glass-card rounded-xl p-4 hover-lift group cursor-pointer",
                className
            )}
            {...props}
        >
            <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                    src={
                        image ||
                        `/placeholder.svg?height=200&width=300&query=${title} game voucher`
                    }
                    alt={title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {discount && (
                    <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 rounded-md text-sm font-semibold">
                        -{discount}%
                    </div>
                )}
                {platform && (
                    <div className="absolute top-2 left-2 bg-secondary/80 backdrop-blur-sm text-secondary-foreground px-2 py-1 rounded-md text-xs">
                        {platform}
                    </div>
                )}
            </div>

            <div className="space-y-3">
                <h3 className="font-heading font-semibold text-lg leading-tight group-hover:text-accent transition-colors">
                    {title}
                </h3>

                {rating > 0 && reviewsCount > 0 ? (
                    <div className="flex items-center gap-1">
                        <div className="flex text-accent">
                            {[...Array(5)].map((_, i) => (
                                <span
                                    key={i}
                                    className={
                                        i < Math.floor(rating)
                                            ? "text-accent"
                                            : "text-muted-foreground/30"
                                    }
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <span className="text-sm text-muted-foreground ml-1">
                            ({rating}) • {reviewsCount} review
                            {reviewsCount !== 1 ? "s" : ""}
                        </span>
                    </div>
                ) : null}

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-accent">
                            Tk {price}
                        </span>
                        {originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                                Tk {originalPrice}
                            </span>
                        )}
                    </div>
                    <GamingButton size="sm" variant="primary">
                        Buy Now
                    </GamingButton>
                </div>
            </div>
        </div>
    );
}
