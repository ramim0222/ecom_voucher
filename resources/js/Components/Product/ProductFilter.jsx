import { GamingButton } from "@/Components/ui/GamingButton";

export function ProductFilters() {
    const platforms = [
        "Steam",
        "PlayStation",
        "Xbox",
        "Nintendo",
        "Epic Games",
        "Google Play",
    ];
    const categories = [
        "PC Gaming",
        "Console Gaming",
        "Mobile Gaming",
        "Subscription Services",
    ];
    const priceRanges = [
        { label: "Under Tk 10", value: "0-10" },
        { label: "Tk 10 - 25", value: "10-25" },
        { label: "Tk 25 - 50", value: "25-50" },
        { label: "Tk 50 - 100", value: "50-100" },
        { label: "Over Tk 100", value: "100+" },
    ];

    return (
        <div className="glass-card rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold text-lg">Filters</h3>
                <GamingButton variant="ghost" size="sm">
                    Clear All
                </GamingButton>
            </div>

            {/* Platform Filter */}
            <div>
                <h4 className="font-medium mb-3">Platform</h4>
                <div className="space-y-2">
                    {platforms.map((platform) => (
                        <label
                            key={platform}
                            className="flex items-center gap-2 cursor-pointer hover:text-accent"
                        >
                            <input
                                type="checkbox"
                                className="rounded border-border"
                            />
                            <span className="text-sm">{platform}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Category Filter */}
            <div>
                <h4 className="font-medium mb-3">Category</h4>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <label
                            key={category}
                            className="flex items-center gap-2 cursor-pointer hover:text-accent"
                        >
                            <input
                                type="checkbox"
                                className="rounded border-border"
                            />
                            <span className="text-sm">{category}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="space-y-2">
                    {priceRanges.map((range) => (
                        <label
                            key={range.value}
                            className="flex items-center gap-2 cursor-pointer hover:text-accent"
                        >
                            <input
                                type="radio"
                                name="priceRange"
                                className="border-border"
                            />
                            <span className="text-sm">{range.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Rating Filter */}
            <div>
                <h4 className="font-medium mb-3">Rating</h4>
                <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                        <label
                            key={rating}
                            className="flex items-center gap-2 cursor-pointer hover:text-accent"
                        >
                            <input
                                type="checkbox"
                                className="rounded border-border"
                            />
                            <div className="flex items-center gap-1">
                                <div className="flex text-accent">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className={
                                                i < rating
                                                    ? "text-accent"
                                                    : "text-muted"
                                            }
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <span className="text-sm">& Up</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Availability */}
            <div>
                <h4 className="font-medium mb-3">Availability</h4>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-accent">
                        <input
                            type="checkbox"
                            className="rounded border-border"
                        />
                        <span className="text-sm">In Stock</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:text-accent">
                        <input
                            type="checkbox"
                            className="rounded border-border"
                        />
                        <span className="text-sm">On Sale</span>
                    </label>
                </div>
            </div>
        </div>
    );
}
