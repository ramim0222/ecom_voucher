<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function welcome()
    {
        // Get featured products with review statistics
        $featuredProducts = Product::where('status', 'active')
            ->where('is_featured', true)
            ->with(['category', 'reviews' => function($query) {
                $query->where('status', 'approved');
            }])
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->take(6) // Limit to 6 featured products
            ->get(['id', 'title', 'price', 'original_price', 'category_id', 'product_image', 'is_featured'])
            ->map(function ($product) {
                // Calculate review statistics
                $approvedReviews = $product->reviews;
                $reviewsCount = $approvedReviews->count();
                $averageRating = $reviewsCount > 0 ? $approvedReviews->avg('rating') : 0;

                // Add computed fields
                $product->reviews_count = $reviewsCount;
                $product->average_rating = round($averageRating, 1);

                // Remove the reviews relationship to avoid sending unnecessary data
                unset($product->reviews);

                return $product;
            });

        // Get discounted products (original_price > price), highest discount first
        $discountedProducts = Product::where('status', 'active')
            ->whereNotNull('original_price')
            ->whereColumn('original_price', '>', 'price')
            ->with(['category', 'reviews' => function($query) {
                $query->where('status', 'approved');
            }])
            // Order by discount percentage desc, then most recent
            ->orderByRaw('(original_price - price) / NULLIF(original_price, 0) DESC')
            ->orderByDesc('id')
            ->take(6)
            ->get(['id', 'title', 'price', 'original_price', 'category_id', 'product_image', 'is_featured'])
            ->map(function ($product) {
                $approvedReviews = $product->reviews;
                $reviewsCount = $approvedReviews->count();
                $averageRating = $reviewsCount > 0 ? $approvedReviews->avg('rating') : 0;

                $product->reviews_count = $reviewsCount;
                $product->average_rating = round($averageRating, 1);

                unset($product->reviews);

                return $product;
            });

        // Get categories for category display
        $categories = Category::where('status', 'active')
            ->orderBy('id')
            ->take(4)
            ->get(['id', 'name', 'logo']);

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'featuredProducts' => $featuredProducts,
            'discountedProducts' => $discountedProducts,
            'categories' => $categories,
        ]);
    }



    public function checkout()
    {
        return Inertia::render('Checkout');
    }

}
