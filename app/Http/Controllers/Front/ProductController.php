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
        return Inertia::render('Product/Page', ['id' => $id]);
    }
}
