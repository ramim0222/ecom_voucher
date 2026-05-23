"use client";

import { VoucherCard } from "@/Components/ui/VoucherCard";

export function RelatedProducts({ relatedProducts = [] }) {
    if (relatedProducts.length === 0) {
        return null;
    }

    return (
        <section className="mt-16">
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-8">
                You Might Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((product) => (
                    <VoucherCard
                        key={product.id}
                        title={product.title}
                        price={product.price}
                        originalPrice={product.original_price}
                        discount={
                            product.original_price &&
                            product.original_price > product.price
                                ? Math.round(
                                      ((product.original_price - product.price) /
                                          product.original_price) *
                                          100
                                  )
                                : null
                        }
                        image={
                            product.product_image
                                ? `/storage/${product.product_image}`
                                : null
                        }
                        platform={product.platform}
                        rating={product.average_rating}
                        reviewsCount={product.reviews_count}
                        href={route("product", product.id)}
                    />
                ))}
            </div>
        </section>
    );
}
