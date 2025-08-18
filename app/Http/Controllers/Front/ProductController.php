<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;

class ProductController extends Controller
{
    public function products(Request $request)
    {
        $categoryId = $request->query('category');

        $query = Product::query()->where('status', 'active');
        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        $products = $query
            ->with('codes')
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get(['id', 'title', 'price', 'original_price', 'category_id', 'product_image']);

        return Inertia::render('Product/Index', [
            'products' => $products,
            'activeCategory' => $categoryId ? (int) $categoryId : null,
        ]);
    }

    public function product($id)
    {
        $product = Product::with(['category', 'reviews.user'])->find($id);

        if (!$product) {
            abort(404);
        }

        // Ensure features is an array (casting handles this automatically)
        if (!$product->features) {
            $product->features = [];
        }

        // Get approved reviews with user information
        $approvedReviews = $product->reviews()
            ->where('status', 'approved')
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'user' => $review->user->full_name,
                    'rating' => $review->rating,
                    'comment' => $review->review,
                    'date' => $review->created_at->format('Y-m-d'),
                    'avatar' => '/placeholder-user.jpg', // You can add user avatars later
                ];
            });

        // Calculate review statistics
        $reviewsCount = $approvedReviews->count();
        $averageRating = $reviewsCount > 0 ? $approvedReviews->avg('rating') : 0;

        // Add computed review data to product
        $product->reviews_count = $reviewsCount;
        $product->average_rating = round($averageRating, 1);

        // Check if current user has already reviewed this product
        $userHasReviewed = auth()->check() ?
            $product->reviews()->where('user_id', auth()->id())->exists() : false;

        // The stock is automatically calculated via the getStockAttribute() accessor in the Product model
        // and is included in JSON via the $appends array

        return Inertia::render('Product/Page', [
            'product' => $product,
            'reviews' => $approvedReviews,
            'userHasReviewed' => $userHasReviewed,
        ]);
    }
}
