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
        $product = Product::with('category')->find($id);

        if (!$product) {
            abort(404);
        }

        // Ensure features is an array (casting handles this automatically)
        if (!$product->features) {
            $product->features = [];
        }

        // Add reviews count (placeholder for now)
        $product->reviews = 0;

        // The stock is automatically calculated via the getStockAttribute() accessor in the Product model
        // and is included in JSON via the $appends array

        return Inertia::render('Product/Page', [
            'product' => $product,
        ]);
    }
}
