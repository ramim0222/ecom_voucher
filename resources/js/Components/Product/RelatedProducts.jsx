"use client";

import { VoucherCard } from "@/Components/ui/VoucherCard";

export function RelatedProducts({ currentProductId }) {
    const relatedProducts = [
        {
            id: 2,
            title: "Steam Wallet $25",
            price: "22.99",
            originalPrice: "25.00",
            discount: 8,
            platform: "Steam",
            rating: 4.7,
        },
        {
            id: 3,
            title: "Steam Wallet $100",
            price: "92.99",
            originalPrice: "100.00",
            discount: 7,
            platform: "Steam",
            rating: 4.9,
        },
        {
            id: 4,
            title: "CS:GO Weapon Case Key",
            price: "2.49",
            platform: "Steam",
            rating: 4.5,
        },
    ];

    return (
        <section className="mt-16">
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-8">
                You Might Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((product) => (
                    <VoucherCard
                        key={product.id}
                        {...product}
                        onClick={() =>
                            (window.location.href = `/products/${product.id}`)
                        }
                    />
                ))}
            </div>
        </section>
    );
}
