<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use App\Models\Product;
use App\Models\Cart;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WishlistController extends Controller
{
    public function index()
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $wishlistItems = Auth::user()
            ->wishlist()
            ->with('product.category')
            ->get();

        $transformedItems = $wishlistItems->map(function ($wishlist) {
            $product = $wishlist->product;
            return [
                'id' => $wishlist->id,
                'product_id' => $wishlist->product_id,
                'title' => $product->title,
                'price' => $product->price ? (float) $product->price : 0.0,
                'originalPrice' => $product->original_price ? (float) $product->original_price : null,
                'platform' => $product->category->name ?? 'Gaming',
                'image' => $product->product_image ? asset('storage/' . $product->product_image) : '/placeholder.svg',
                'stock' => (int) $product->stock,
            ];
        });

        return Inertia::render('Wishlist', [
            'wishlistItems' => $transformedItems,
        ]);
    }

    public function add(Request $request)
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        // Ensure product exists
        $product = Product::findOrFail($request->product_id);

        // Create if not exists due to unique index
        Wishlist::firstOrCreate([
            'user_id' => Auth::id(),
            'product_id' => $product->id,
        ]);

        return back()->with('success', 'Added to wishlist.');
    }

    public function removeByProduct(Product $product)
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        Wishlist::where('user_id', Auth::id())
            ->where('product_id', $product->id)
            ->delete();

        return back()->with('success', 'Removed from wishlist.');
    }

    public function remove(Wishlist $wishlist)
    {
        if (!Auth::check() || $wishlist->user_id !== Auth::id()) {
            abort(403);
        }

        $wishlist->delete();

        return back()->with('success', 'Removed from wishlist.');
    }

    public function clear()
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        Wishlist::where('user_id', Auth::id())->delete();

        return back()->with('success', 'Wishlist cleared.');
    }

    public function moveToCart(Wishlist $wishlist)
    {
        if (!Auth::check() || $wishlist->user_id !== Auth::id()) {
            abort(403);
        }

        $product = Product::findOrFail($wishlist->product_id);

        if ($product->stock <= 0) {
            return back()->with('error', 'Item is out of stock.');
        }

        // Add one quantity to cart or increment existing
        $existingCartItem = Cart::where('user_id', Auth::id())
            ->where('product_id', $product->id)
            ->first();

        if ($existingCartItem) {
            $newQuantity = $existingCartItem->quantity + 1;
            if ($product->stock < $newQuantity) {
                return back()->with('error', 'Not enough stock available.');
            }
            $existingCartItem->update([
                'quantity' => $newQuantity,
                'price' => $product->price,
            ]);
        } else {
            Cart::create([
                'user_id' => Auth::id(),
                'product_id' => $product->id,
                'quantity' => 1,
                'price' => $product->price,
            ]);
        }

        // Remove from wishlist
        $wishlist->delete();

        return back()->with('success', 'Moved to cart.');
    }

    public function moveAllToCart()
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $wishlists = Wishlist::where('user_id', Auth::id())
            ->with('product')
            ->get();

        foreach ($wishlists as $wishlist) {
            $product = $wishlist->product;
            if (!$product) {
                continue;
            }
            if ($product->stock <= 0) {
                continue;
            }

            $existingCartItem = Cart::where('user_id', Auth::id())
                ->where('product_id', $product->id)
                ->first();

            if ($existingCartItem) {
                $newQuantity = $existingCartItem->quantity + 1;
                if ($product->stock >= $newQuantity) {
                    $existingCartItem->update([
                        'quantity' => $newQuantity,
                        'price' => $product->price,
                    ]);
                    $wishlist->delete();
                }
            } else {
                Cart::create([
                    'user_id' => Auth::id(),
                    'product_id' => $product->id,
                    'quantity' => 1,
                    'price' => $product->price,
                ]);
                $wishlist->delete();
            }
        }

        return back()->with('success', 'Moved available items to cart.');
    }
}
