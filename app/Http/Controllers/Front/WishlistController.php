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
        if (Auth::check()) {
            $wishlistItems = Auth::user()
                ->wishlist()
                ->with('product.category')
                ->get();

            $transformedItems = $wishlistItems->map(function ($wishlist) {
                return $this->transformProduct($wishlist->product, $wishlist->product_id);
            });
        } else {
            $guestWishlist = session('guest_wishlist', []);
            $transformedItems = collect();

            if (!empty($guestWishlist)) {
                $productIds = array_keys($guestWishlist);
                $products = Product::with('category')->whereIn('id', $productIds)->get()->keyBy('id');

                $transformedItems = collect($guestWishlist)->map(function ($item, $productId) use ($products) {
                    $product = $products->get($productId);
                    if (!$product) {
                        return null;
                    }

                    return $this->transformProduct($product, $productId);
                })->filter()->values();
            }
        }

        return Inertia::render('Wishlist', [
            'wishlistItems' => $transformedItems,
        ]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $product = Product::findOrFail($request->product_id);

        if (Auth::check()) {
            Wishlist::firstOrCreate([
                'user_id' => Auth::id(),
                'product_id' => $product->id,
            ]);
        } else {
            $guestWishlist = session('guest_wishlist', []);
            $guestWishlist[(string) $product->id] = [
                'product_id' => (int) $product->id,
            ];
            session(['guest_wishlist' => $guestWishlist]);
        }

        return back()->with('success', 'Added to wishlist.');
    }

    public function removeByProduct(Product $product)
    {
        if (Auth::check()) {
            Wishlist::where('user_id', Auth::id())
                ->where('product_id', $product->id)
                ->delete();
        } else {
            $guestWishlist = session('guest_wishlist', []);
            unset($guestWishlist[(string) $product->id]);
            session(['guest_wishlist' => $guestWishlist]);
        }

        return back()->with('success', 'Removed from wishlist.');
    }

    public function remove($productId)
    {
        if (Auth::check()) {
            Wishlist::where('user_id', Auth::id())
                ->where('product_id', $productId)
                ->delete();
        } else {
            $guestWishlist = session('guest_wishlist', []);
            unset($guestWishlist[(string) $productId]);
            session(['guest_wishlist' => $guestWishlist]);
        }

        return back()->with('success', 'Removed from wishlist.');
    }

    public function clear()
    {
        if (Auth::check()) {
            Wishlist::where('user_id', Auth::id())->delete();
        } else {
            session()->forget('guest_wishlist');
        }

        return back()->with('success', 'Wishlist cleared.');
    }

    public function moveToCart($productId)
    {
        $product = Product::findOrFail($productId);

        if ($product->stock <= 0) {
            return back()->with('error', 'Item is out of stock.');
        }

        if (Auth::check()) {
            $wishlist = Wishlist::where('user_id', Auth::id())
                ->where('product_id', $productId)
                ->first();

            if (!$wishlist) {
                return back()->with('error', 'Item not found in wishlist.');
            }

            $this->addProductToUserCart($product);
            $wishlist->delete();
        } else {
            $guestWishlist = session('guest_wishlist', []);
            if (!isset($guestWishlist[(string) $productId])) {
                return back()->with('error', 'Item not found in wishlist.');
            }

            $this->addProductToGuestCart($product);
            unset($guestWishlist[(string) $productId]);
            session(['guest_wishlist' => $guestWishlist]);
        }

        return back()->with('success', 'Moved to cart.');
    }

    public function moveAllToCart()
    {
        if (Auth::check()) {
            $wishlists = Wishlist::where('user_id', Auth::id())
                ->with('product')
                ->get();

            foreach ($wishlists as $wishlist) {
                $product = $wishlist->product;
                if (!$product || $product->stock <= 0) {
                    continue;
                }

                if ($this->addProductToUserCart($product)) {
                    $wishlist->delete();
                }
            }
        } else {
            $guestWishlist = session('guest_wishlist', []);
            $productIds = array_keys($guestWishlist);
            $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

            foreach ($guestWishlist as $productId => $item) {
                $product = $products->get($productId);
                if (!$product || $product->stock <= 0) {
                    continue;
                }

                if ($this->addProductToGuestCart($product)) {
                    unset($guestWishlist[(string) $productId]);
                }
            }

            session(['guest_wishlist' => $guestWishlist]);
        }

        return back()->with('success', 'Moved available items to cart.');
    }

    protected function transformProduct(Product $product, $productId): array
    {
        return [
            'id' => (int) $productId,
            'product_id' => (int) $productId,
            'slug' => $product->slug,
            'title' => $product->title,
            'price' => $product->price ? (float) $product->price : 0.0,
            'originalPrice' => $product->original_price ? (float) $product->original_price : null,
            'platform' => $product->category->name ?? 'Gaming',
            'image' => $product->product_image ? asset('storage/' . $product->product_image) : '/placeholder.svg',
            'stock' => (int) $product->stock,
        ];
    }

    protected function addProductToUserCart(Product $product): bool
    {
        $existingCartItem = Cart::where('user_id', Auth::id())
            ->where('product_id', $product->id)
            ->first();

        if ($existingCartItem) {
            $newQuantity = $existingCartItem->quantity + 1;
            if ($product->stock < $newQuantity) {
                return false;
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

        return true;
    }

    protected function addProductToGuestCart(Product $product): bool
    {
        $guestCart = session('guest_cart', []);
        $key = (string) $product->id;

        if (isset($guestCart[$key])) {
            $newQuantity = $guestCart[$key]['quantity'] + 1;
            if ($product->stock < $newQuantity) {
                return false;
            }
            $guestCart[$key]['quantity'] = $newQuantity;
        } else {
            $guestCart[$key] = [
                'product_id' => (int) $product->id,
                'quantity' => 1,
                'price' => $product->price,
            ];
        }

        session(['guest_cart' => $guestCart]);

        return true;
    }
}
