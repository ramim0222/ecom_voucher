import { router } from "@inertiajs/react";

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
    const handleSortChange = (event) => {
        const sort = event.target.value;

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
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select
                value={filters.sort || "featured"}
                onChange={handleSortChange}
                className="bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
            </select>
        </div>
    );
}
