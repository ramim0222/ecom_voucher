<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category')->get();
        $categories = Category::where('status', 'active')->get();

        return Inertia::render('Admin/Products', [
            'products' => $products,
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'status' => 'required|in:active,inactive',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'buying_price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'total_codes' => 'nullable|integer|min:0',
            'sold_codes' => 'nullable|integer|min:0',
            'features' => 'nullable|array',
            'is_featured' => 'boolean',
            'sort_order' => 'nullable|integer',
            'product_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $data = [
            'title' => $request->title,
            'category_id' => $request->category_id,
            'status' => $request->status,
            'price' => $request->price,
            'original_price' => $request->original_price,
            'buying_price' => $request->buying_price,
            'description' => $request->description,
            'total_codes' => $request->total_codes ?? 0,
            'sold_codes' => $request->sold_codes ?? 0,
            'features' => $request->features ? json_encode($request->features) : null,
            'is_featured' => $request->boolean('is_featured'),
            'sort_order' => $request->sort_order ?? 0,
        ];

        // Handle product image upload
        if ($request->hasFile('product_image')) {
            $file = $request->file('product_image');
            $filename = Str::slug($request->title) . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('products', $filename, 'public');
            $data['product_image'] = $path;
        }

        Product::create($data);

        return back()->with('success', 'Product created successfully.');
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'status' => 'required|in:active,inactive',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'buying_price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'total_codes' => 'nullable|integer|min:0',
            'sold_codes' => 'nullable|integer|min:0',
            'features' => 'nullable|array',
            'is_featured' => 'boolean',
            'sort_order' => 'nullable|integer',
            'product_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $data = [
            'title' => $request->title,
            'category_id' => $request->category_id,
            'status' => $request->status,
            'price' => $request->price,
            'original_price' => $request->original_price,
            'buying_price' => $request->buying_price,
            'description' => $request->description,
            'total_codes' => $request->total_codes ?? 0,
            'sold_codes' => $request->sold_codes ?? 0,
            'features' => $request->features ? json_encode($request->features) : null,
            'is_featured' => $request->boolean('is_featured'),
            'sort_order' => $request->sort_order ?? 0,
        ];

        // Handle product image upload
        if ($request->hasFile('product_image')) {
            // Delete old image if exists
            if ($product->product_image) {
                Storage::disk('public')->delete($product->product_image);
            }

            $file = $request->file('product_image');
            $filename = Str::slug($request->title) . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('products', $filename, 'public');
            $data['product_image'] = $path;
        }

        $product->update($data);

        return back()->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        // Delete product image if exists
        if ($product->product_image) {
            Storage::disk('public')->delete($product->product_image);
        }

        $product->delete();

        return back()->with('success', 'Product deleted successfully.');
    }
}
