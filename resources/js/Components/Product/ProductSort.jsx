import { router } from "@inertiajs/react";
import { ThemedSelect } from "@/Components/ui/ThemedSelect";

const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest" },
    { value: "popular", label: "Most Popular" },
];

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

export function ProductSort({ filters = {} }) {
    const handleSortChange = (sort) => {
        router.get(
            route("products"),
            buildQuery({
                ...filters,
                sort,
            }),
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
                Sort by:
            </span>
            <ThemedSelect
                value={filters.sort || "featured"}
                onChange={handleSortChange}
                options={sortOptions}
                size="sm"
                className="min-w-[200px] sm:min-w-[220px]"
            />
        </div>
    );
}
