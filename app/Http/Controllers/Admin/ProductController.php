<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;
use App\Models\Code;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'codes'])
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->paginate(10)
            ->through(function ($product) {
                $product->total_codes = $product->codes->count();
                $product->sold_codes = $product->codes->where('status', 'sold')->count();
                $product->append('stock');

                return $product;
            });
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
            'features' => $request->features ?: null,
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
            'features' => $request->features ?: null,
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

    public function uploadCodes(Request $request, Product $product)
    {
        $request->validate([
            'codes' => 'required|array',
            'codes.*' => 'required|string|max:255'
        ]);

        $uploadedCodes = [];
        $duplicateCodes = [];

        foreach ($request->codes as $codeValue) {
            // Check if code already exists for this product
            $existingCode = Code::where('product_id', $product->id)
                               ->where('code', $codeValue)
                               ->first();

            if ($existingCode) {
                $duplicateCodes[] = $codeValue;
            } else {
                $uploadedCodes[] = [
                    'code' => $codeValue,
                    'product_id' => $product->id,
                    'status' => 'available',
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            }
        }

        // Bulk insert new codes
        if (!empty($uploadedCodes)) {
            Code::insert($uploadedCodes);
        }

        // Update product's total_codes count
        $product->update([
            'total_codes' => $product->codes()->count()
        ]);

        $message = count($uploadedCodes) . ' codes uploaded successfully.';
        if (!empty($duplicateCodes)) {
            $message .= ' ' . count($duplicateCodes) . ' duplicate codes were skipped.';
        }

        return back()->with('success', $message);
    }

        public function getCodes(Product $product)
    {
        $codes = $product->codes()->latest()->get();

        return response()->json([
            'codes' => $codes,
            'total_codes' => $codes->count(),
            'available_codes' => $codes->where('status', 'available')->count(),
            'sold_codes' => $codes->where('status', 'sold')->count()
        ]);
    }

    public function bulkDeleteCodes(Request $request, Product $product)
    {
        \Log::info('Bulk delete request received', [
            'product_id' => $product->id,
            'request_data' => $request->all()
        ]);

        $request->validate([
            'code_ids' => 'required|array',
            'code_ids.*' => 'required|integer'
        ]);

        // Delete codes that belong to this product
        $deletedCount = Code::where('product_id', $product->id)
                           ->whereIn('id', $request->code_ids)
                           ->delete();

        \Log::info('Bulk delete completed', [
            'deleted_count' => $deletedCount,
            'product_id' => $product->id
        ]);

        // Update product's total_codes count
        $product->update([
            'total_codes' => $product->codes()->count(),
            'sold_codes' => $product->codes()->where('status', 'sold')->count()
        ]);

        return back()->with('success', "{$deletedCount} codes deleted successfully.");
    }
}
