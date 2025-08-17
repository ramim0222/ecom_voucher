<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::all();
        return Inertia::render('Admin/Categories', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $data = [
            'name' => $request->name,
            'description' => $request->description,
            'status' => $request->status ?? 'active',
        ];

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = Str::slug($request->name) . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('categories', $filename, 'public');
            $data['logo'] = $path;
        }

        Category::create($data);

        return redirect()->route('admin.categories.index')
                        ->with('success', 'Category created successfully.');
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $data = [
            'name' => $request->name,
            'description' => $request->description,
            'status' => $request->status ?? 'active',
        ];

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = Str::slug($request->name) . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('categories', $filename, 'public');
            $data['logo'] = $path;
        }

        $category->update($data);

        return redirect()->route('admin.categories.index')
                        ->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return redirect()->route('admin.categories.index')
                        ->with('success', 'Category deleted successfully.');
    }
}
