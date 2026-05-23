import { GamingButton } from "@/Components/ui/GamingButton";
import { router } from "@inertiajs/react";

const PRICE_RANGES = [
    { label: "Under Tk 100", value: "0-100" },
    { label: "Tk 100 - 250", value: "100-250" },
    { label: "Tk 250 - 500", value: "250-500" },
    { label: "Tk 500 - 1000", value: "500-1000" },
    { label: "Over Tk 1000", value: "1000+" },
];

const RATING_OPTIONS = [4, 3, 2, 1];

function buildQuery(filters) {
    const query = {};

    if (filters.categories?.length) {
        query.categories = filters.categories;
    }

    if (filters.price_range) {
        query.price_range = filters.price_range;
    }

    if (filters.min_rating) {
        query.min_rating = filters.min_rating;
    }

    if (filters.in_stock) {
        query.in_stock = "1";
    }

    if (filters.on_sale) {
        query.on_sale = "1";
    }

    if (filters.sort && filters.sort !== "featured") {
        query.sort = filters.sort;
    }

    return query;
}

export function ProductFilters({ filters = {}, categories = [] }) {
    const activeCategories = filters.categories ?? [];
    const activePlatforms = categories.filter(
        (category) =>
            String(category.status ?? "active").toLowerCase() === "active"
    );

    const applyFilters = (nextFilters) => {
        router.get(route("products"), buildQuery(nextFilters), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const toggleCategory = (categoryId) => {
        const id = String(categoryId);
        const nextCategories = activeCategories.includes(id)
            ? activeCategories.filter((value) => value !== id)
            : [...activeCategories, id];

        applyFilters({
            ...filters,
            categories: nextCategories,
        });
    };

    const setPriceRange = (value) => {
        applyFilters({
            ...filters,
            price_range: filters.price_range === value ? "" : value,
        });
    };

    const setMinRating = (rating) => {
        const value = String(rating);
        applyFilters({
            ...filters,
            min_rating: filters.min_rating === value ? "" : value,
        });
    };

    const toggleFlag = (key) => {
        applyFilters({
            ...filters,
            [key]: !filters[key],
        });
    };

    const clearAll = () => {
        router.get(route("products"), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <div className="glass-card rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold text-lg">Filters</h3>
                <GamingButton variant="ghost" size="sm" onClick={clearAll}>
                    Clear All
                </GamingButton>
            </div>

            {activePlatforms.length > 0 && (
                <div>
                    <h4 className="font-medium mb-3">Platform</h4>
                    <div className="space-y-2">
                        {activePlatforms.map((platform) => (
                            <label
                                key={platform.id}
                                className="flex items-center gap-2 cursor-pointer hover:text-accent"
                            >
                                <input
                                    type="checkbox"
                                    className="rounded border-border"
                                    checked={activeCategories.includes(
                                        String(platform.id)
                                    )}
                                    onChange={() => toggleCategory(platform.id)}
                                />
                                <span className="text-sm">{platform.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="space-y-2">
                    {PRICE_RANGES.map((range) => (
                        <label
                            key={range.value}
                            className="flex items-center gap-2 cursor-pointer hover:text-accent"
                        >
                            <input
                                type="radio"
                                name="priceRange"
                                className="border-border"
                                checked={filters.price_range === range.value}
                                onChange={() => setPriceRange(range.value)}
                            />
                            <span className="text-sm">{range.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="font-medium mb-3">Rating</h4>
                <div className="space-y-2">
                    {RATING_OPTIONS.map((rating) => (
                        <label
                            key={rating}
                            className="flex items-center gap-2 cursor-pointer hover:text-accent"
                        >
                            <input
                                type="checkbox"
                                className="rounded border-border"
                                checked={filters.min_rating === String(rating)}
                                onChange={() => setMinRating(rating)}
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

            <div>
                <h4 className="font-medium mb-3">Availability</h4>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-accent">
                        <input
                            type="checkbox"
                            className="rounded border-border"
                            checked={Boolean(filters.in_stock)}
                            onChange={() => toggleFlag("in_stock")}
                        />
                        <span className="text-sm">In Stock</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:text-accent">
                        <input
                            type="checkbox"
                            className="rounded border-border"
                            checked={Boolean(filters.on_sale)}
                            onChange={() => toggleFlag("on_sale")}
                        />
                        <span className="text-sm">On Sale</span>
                    </label>
                </div>
            </div>
        </div>
    );
}
