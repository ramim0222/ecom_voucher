import { useState } from "react";
import { GamingButton } from "@/Components/ui/GamingButton";

export function ProductReviews({ product, auth }) {
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState("");

    // Mock reviews data (in real app, this would come from backend)
    const reviews = [
        {
            id: 1,
            user: "John Doe",
            rating: 5,
            comment:
                "Excellent service! The code was delivered instantly and worked perfectly.",
            date: "2024-03-15",
            avatar: "/placeholder-user.jpg",
        },
        {
            id: 2,
            user: "Jane Smith",
            rating: 4,
            comment: "Good value for money. Would buy again.",
            date: "2024-03-14",
            avatar: "/placeholder-user.jpg",
        },
    ];

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
            {/* Review Statistics */}
            <div className="flex items-center gap-8">
                <div className="text-center">
                    <div className="text-4xl font-bold text-accent mb-1">
                        {product.rating}
                    </div>
                    <StarRating value={Math.floor(product.rating)} readonly />
                    <div className="text-sm text-muted-foreground mt-1">
                        {product.reviews} reviews
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
                                            (star === Math.floor(product.rating)
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
                <div className="glass-card rounded-lg p-6 space-y-4">
                    <h3 className="font-heading font-semibold text-lg">
                        Write a Review
                    </h3>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Rating
                        </label>
                        <StarRating value={rating} onChange={setRating} />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Your Review
                        </label>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            className="w-full h-24 px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent/50"
                            placeholder="Share your experience with this product..."
                        />
                    </div>
                    <GamingButton variant="accent" className="w-full">
                        Submit Review
                    </GamingButton>
                </div>
            ) : (
                <div className="glass-card rounded-lg p-6 text-center">
                    <p className="text-muted-foreground mb-4">
                        Please log in to write a review
                    </p>
                    <GamingButton
                        variant="accent"
                        as="a"
                        href="/login"
                        className="inline-block"
                    >
                        Login to Review
                    </GamingButton>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.map((review) => (
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
                                <StarRating value={review.rating} readonly />
                                <p className="mt-2 text-muted-foreground">
                                    {review.comment}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
