<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Wishlist;
use App\Services\MetaConversionApiService;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function products(Request $request)
    {
        $categoryIds = collect($request->input('categories', []))
            ->when($request->filled('category'), fn ($ids) => $ids->push($request->query('category')))
            ->map(fn ($id) => (int) $id)
            ->filter(fn ($id) => $id > 0)
            ->unique()
            ->values()
            ->all();

        $priceRange = $request->query('price_range');
        $minRating = $request->filled('min_rating') ? (float) $request->query('min_rating') : null;
        $inStock = $request->boolean('in_stock');
        $onSale = $request->boolean('on_sale');
        $sort = $request->query('sort', 'featured');

        $approvedReviewsQuery = fn ($query) => $query->where('status', 'approved');

        $query = Product::query()
            ->where('status', 'active')
            ->with(['codes'])
            ->withAvg(['reviews as average_rating_calc' => $approvedReviewsQuery], 'rating')
            ->withCount(['reviews as reviews_count_calc' => $approvedReviewsQuery]);

        if (! empty($categoryIds)) {
            $query->whereIn('category_id', $categoryIds);
        }

        if ($priceRange) {
            [$minPrice, $maxPrice] = $this->parsePriceRange($priceRange);
            if ($minPrice !== null) {
                $query->where('price', '>=', $minPrice);
            }
            if ($maxPrice !== null) {
                $query->where('price', '<=', $maxPrice);
            }
        }

        if ($minRating !== null) {
            $query->having('average_rating_calc', '>=', $minRating);
        }

        if ($inStock) {
            $query->whereHas('codes', fn ($codeQuery) => $codeQuery->where('status', 'available'));
        }

        if ($onSale) {
            $query->whereNotNull('original_price')
                ->whereColumn('original_price', '>', 'price');
        }

        match ($sort) {
            'price-low' => $query->orderBy('price')->orderByDesc('id'),
            'price-high' => $query->orderByDesc('price')->orderByDesc('id'),
            'rating' => $query->orderByDesc('average_rating_calc')->orderByDesc('id'),
            'newest' => $query->orderByDesc('created_at')->orderByDesc('id'),
            'popular' => $query->orderByDesc('reviews_count_calc')->orderByDesc('id'),
            default => $query->orderByDesc('is_featured')->orderBy('sort_order')->orderByDesc('id'),
        };

        $products = $query
            ->get(['id', 'slug', 'title', 'price', 'original_price', 'category_id', 'product_image', 'created_at'])
            ->map(function ($product) {
                $reviewsCount = (int) $product->reviews_count_calc;
                $averageRating = $reviewsCount > 0
                    ? round((float) $product->average_rating_calc, 1)
                    : 0;

                $product->reviews_count = $reviewsCount;
                $product->average_rating = $averageRating;

                unset($product->reviews_count_calc, $product->average_rating_calc, $product->codes);

                return $product;
            });

        return Inertia::render('Product/Index', [
            'products' => $products,
            'activeCategory' => count($categoryIds) === 1 ? $categoryIds[0] : null,
            'filters' => [
                'categories' => array_map('strval', $categoryIds),
                'price_range' => $priceRange ?: '',
                'min_rating' => $minRating ? (string) (int) $minRating : '',
                'in_stock' => $inStock,
                'on_sale' => $onSale,
                'sort' => $sort,
            ],
        ]);
    }

    public function product(Request $request, Product $product)
    {
        $product->load(['category', 'reviews.user']);

        if ($product->status !== 'active') {
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

        $userHasWishlisted = Auth::check()
            ? Wishlist::where('user_id', Auth::id())
                ->where('product_id', $product->id)
                ->exists()
            : isset(session('guest_wishlist', [])[(string) $product->id]);

        MetaConversionApiService::trackViewContent($product, $request);

        $approvedReviewsQuery = fn ($query) => $query->where('status', 'approved');

        $relatedProducts = Product::query()
            ->where('status', 'active')
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->withAvg(['reviews as average_rating_calc' => $approvedReviewsQuery], 'rating')
            ->withCount(['reviews as reviews_count_calc' => $approvedReviewsQuery])
            ->orderByDesc('is_featured')
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->limit(3)
            ->get(['id', 'slug', 'title', 'price', 'original_price', 'category_id', 'product_image'])
            ->map(function ($relatedProduct) use ($product) {
                $reviewsCount = (int) $relatedProduct->reviews_count_calc;
                $averageRating = $reviewsCount > 0
                    ? round((float) $relatedProduct->average_rating_calc, 1)
                    : 0;

                return [
                    'id' => $relatedProduct->id,
                    'slug' => $relatedProduct->slug,
                    'title' => $relatedProduct->title,
                    'price' => $relatedProduct->price,
                    'original_price' => $relatedProduct->original_price,
                    'product_image' => $relatedProduct->product_image,
                    'platform' => $product->category->name,
                    'average_rating' => $averageRating,
                    'reviews_count' => $reviewsCount,
                ];
            });

        return Inertia::render('Product/Page', [
            'product' => $product,
            'reviews' => $approvedReviews,
            'relatedProducts' => $relatedProducts,
            'userHasReviewed' => $userHasReviewed,
            'userHasWishlisted' => $userHasWishlisted,
            'wishlistId' => null,
        ]);
    }

    private function parsePriceRange(string $priceRange): array
    {
        return match ($priceRange) {
            '0-100' => [0, 100],
            '100-250' => [100, 250],
            '250-500' => [250, 500],
            '500-1000' => [500, 1000],
            '1000+' => [1000, null],
            default => [null, null],
        };
    }
}
