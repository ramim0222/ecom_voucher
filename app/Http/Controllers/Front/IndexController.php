<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Cart;
use App\Services\MetaConversionApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
            ->take(8)
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
            ->take(8)
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

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'featuredProducts' => $featuredProducts,
            'discountedProducts' => $discountedProducts,
        ]);
    }



    public function checkout(Request $request)
    {
        $user = Auth::user();

        if ($user) {
            // Authenticated user: load cart from DB
            $dbCartItems = Cart::where('user_id', $user->id)
                ->with(['product.category'])
                ->get();

            if ($dbCartItems->isEmpty()) {
                return redirect()->route('cart')->with('error', 'Your cart is empty. Please add items to continue.');
            }

            $cartItems = $dbCartItems->map(function ($cartItem) {
                return [
                    'id' => $cartItem->product_id,
                    'product_id' => $cartItem->product_id,
                    'title' => $cartItem->product->title,
                    'price' => (float) $cartItem->price,
                    'platform' => $cartItem->product->category->name ?? 'Digital',
                    'quantity' => (int) $cartItem->quantity,
                    'stock' => (int) $cartItem->product->stock,
                    'image' => $cartItem->product->product_image ? asset('storage/' . $cartItem->product->product_image) : '/placeholder.svg',
                ];
            })->values();

            MetaConversionApiService::trackInitiateCheckout($dbCartItems, $request);
        } else {
            // Guest user: load cart from session
            $guestCart = session('guest_cart', []);

            if (empty($guestCart)) {
                return redirect()->route('cart')->with('error', 'Your cart is empty. Please add items to continue.');
            }

            $productIds = array_keys($guestCart);
            $products = \App\Models\Product::with('category')->whereIn('id', $productIds)->get()->keyBy('id');

            $cartItems = collect($guestCart)->map(function ($item, $productId) use ($products) {
                $product = $products->get($productId);
                if (!$product) {
                    return null;
                }

                return [
                    'id' => $productId,
                    'product_id' => (int) $productId,
                    'title' => $product->title,
                    'price' => (float) $product->price,
                    'platform' => $product->category->name ?? 'Digital',
                    'quantity' => (int) $item['quantity'],
                    'stock' => (int) $product->stock,
                    'image' => $product->product_image ? asset('storage/' . $product->product_image) : '/placeholder.svg',
                ];
            })->filter()->values();
        }

        return Inertia::render('Checkout', [
            'cartItems' => $cartItems,
            'user' => $user,
        ]);
    }

}
