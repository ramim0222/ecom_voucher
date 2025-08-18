import { Link, useForm, usePage } from "@inertiajs/react";
import { GamingButton } from "@/Components/ui/GamingButton";

export function ProductReviews({ product, auth, reviews, userHasReviewed }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        rating: 5,
        review: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("reviews.store", product.id), {
            onSuccess: () => {
                reset();
            },
        });
    };

    const StarRating = ({ value, onChange, readonly = false }) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type={readonly ? "button" : "button"}
                        disabled={readonly}
                        onClick={() => onChange?.(star)}
                        className={`text-xl ${
                            star <= value
                                ? "text-accent"
                                : "text-muted-foreground/30"
                        } ${
                            !readonly && "hover:text-accent"
                        } transition-colors`}
                    >
                        ★
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-8">
            {/* Flash Messages */}
            {flash?.success && (
                <div className="glass-card rounded-lg p-4 bg-green-500/10 border border-green-500/20">
                    <p className="text-green-400">{flash.success}</p>
                </div>
            )}
            {flash?.error && (
                <div className="glass-card rounded-lg p-4 bg-red-500/10 border border-red-500/20">
                    <p className="text-red-400">{flash.error}</p>
                </div>
            )}

            {/* Review Statistics */}
            <div className="flex items-center gap-8">
                <div className="text-center">
                    <div className="text-4xl font-bold text-accent mb-1">
                        {product.average_rating || 0}
                    </div>
                    <StarRating
                        value={Math.floor(product.average_rating || 0)}
                        readonly
                    />
                    <div className="text-sm text-muted-foreground mt-1">
                        {product.reviews_count || 0} reviews
                    </div>
                </div>
                <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <div
                            key={star}
                            className="flex items-center gap-2 text-sm"
                        >
                            <div className="w-8">{star} ★</div>
                            <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-accent"
                                    style={{
                                        width: `${
                                            (star ===
                                            Math.floor(
                                                product.average_rating || 0
                                            )
                                                ? 80
                                                : 20) + "%"
                                        }`,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Write Review Section */}
            {auth?.user ? (
                !userHasReviewed ? (
                    <form
                        onSubmit={handleSubmit}
                        className="glass-card rounded-lg p-6 space-y-4"
                    >
                        <h3 className="font-heading font-semibold text-lg">
                            Write a Review
                        </h3>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">
                                Rating
                            </label>
                            <StarRating
                                value={data.rating}
                                onChange={(value) => setData("rating", value)}
                            />
                            {errors.rating && (
                                <p className="text-red-400 text-sm">
                                    {errors.rating}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">
                                Your Review
                            </label>
                            <textarea
                                value={data.review}
                                onChange={(e) =>
                                    setData("review", e.target.value)
                                }
                                className="w-full h-24 px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
                                placeholder="Share your experience with this product..."
                            />
                            {errors.review && (
                                <p className="text-red-400 text-sm">
                                    {errors.review}
                                </p>
                            )}
                        </div>
                        <GamingButton
                            variant="accent"
                            className="w-full"
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? "Submitting..." : "Submit Review"}
                        </GamingButton>
                    </form>
                ) : (
                    <div className="glass-card rounded-lg p-6 text-center">
                        <p className="text-muted-foreground mb-4">
                            You have already reviewed this product
                        </p>
                        <div className="text-accent font-medium">
                            Thank you for your feedback!
                        </div>
                    </div>
                )
            ) : (
                <div className="glass-card rounded-lg p-6 text-center">
                    <p className="text-muted-foreground mb-4">
                        Please log in to write a review
                    </p>
                    <Link href={route("login")}>
                        <GamingButton variant="accent" className="inline-block">
                            Login to Review
                        </GamingButton>
                    </Link>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews && reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div
                            key={review.id}
                            className="glass-card rounded-lg p-6 space-y-4"
                        >
                            <div className="flex items-start gap-4">
                                <img
                                    src={review.avatar}
                                    alt={review.user}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">
                                            {review.user}
                                        </h4>
                                        <span className="text-sm text-muted-foreground">
                                            {review.date}
                                        </span>
                                    </div>
                                    <StarRating
                                        value={review.rating}
                                        readonly
                                    />
                                    <p className="mt-2 text-muted-foreground">
                                        {review.comment}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="glass-card rounded-lg p-6 text-center">
                        <p className="text-muted-foreground">
                            No reviews yet. Be the first to review this product!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
