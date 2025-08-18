<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function welcome()
    {
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    }

    public function cart()
    {
        return Inertia::render('Cart');
    }

    public function checkout()
    {
        return Inertia::render('Checkout');
    }

    // public function products(Request $request)
    // {
    //     $categoryId = $request->query('category');
    //
    //     $query = Product::query()->where('status', 'active');
    //     if ($categoryId) {
    //         $query->where('category_id', $categoryId);
    //     }
    //
    //     $products = $query
    //         ->orderBy('sort_order')
    //         ->orderByDesc('id')
    //         ->get(['id', 'title', 'price', 'original_price', 'category_id', 'product_image']);
    //
    //     return Inertia::render('Product/Index', [
    //         'products' => $products,
    //         'activeCategory' => $categoryId ? (int) $categoryId : null,
    //     ]);
    // }
    //
    // public function product($id)
    // {
    //     return Inertia::render('Product/Page', ['id' => $id]);
    // }
}
