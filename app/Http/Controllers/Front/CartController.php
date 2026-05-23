<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use App\Services\MetaConversionApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    public function cart()
    {
        if (Auth::check()) {
            $cartItems = Auth::user()->cart()->with('product.category')->get();

            $transformedItems = $cartItems->map(function ($cartItem) {
                return [
                    'id' => $cartItem->product_id,
                    'product_id' => $cartItem->product_id,
                    'title' => $cartItem->product->title,
                    'price' => (float) $cartItem->price,
                    'originalPrice' => $cartItem->product->original_price ? (float) $cartItem->product->original_price : null,
                    'platform' => $cartItem->product->category->name ?? 'Gaming',
                    'image' => $cartItem->product->product_image ? asset('storage/' . $cartItem->product->product_image) : '/placeholder.svg',
                    'quantity' => (int) $cartItem->quantity,
                    'stock' => (int) $cartItem->product->stock,
                ];
            });
        } else {
            $guestCart = session('guest_cart', []);
            $transformedItems = collect();

            if (!empty($guestCart)) {
                $productIds = array_keys($guestCart);
                $products = Product::with('category')->whereIn('id', $productIds)->get()->keyBy('id');

                $transformedItems = collect($guestCart)->map(function ($cartItem, $productId) use ($products) {
                    $product = $products->get($productId);
                    if (!$product) {
                        return null;
                    }

                    return [
                        'id' => $productId,
                        'product_id' => $productId,
                        'title' => $product->title,
                        'price' => (float) $product->price,
                        'originalPrice' => $product->original_price ? (float) $product->original_price : null,
                        'platform' => $product->category->name ?? 'Gaming',
                        'image' => $product->product_image ? asset('storage/' . $product->product_image) : '/placeholder.svg',
                        'quantity' => (int) $cartItem['quantity'],
                        'stock' => (int) $product->stock,
                    ];
                })->filter()->values();
            }
        }

        return Inertia::render('Cart', [
            'cartItems' => $transformedItems,
        ]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);

        if ($product->stock < $request->quantity) {
            return back()->with('error', 'Not enough stock available.');
        }

        if (Auth::check()) {
            $existingCartItem = Cart::where('user_id', Auth::id())
                ->where('product_id', $request->product_id)
                ->first();

            if ($existingCartItem) {
                $newQuantity = $existingCartItem->quantity + $request->quantity;

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
                    'product_id' => $request->product_id,
                    'quantity' => $request->quantity,
                    'price' => $product->price,
                ]);
            }
        } else {
            $guestCart = session('guest_cart', []);
            $productId = (string) $request->product_id;

            if (isset($guestCart[$productId])) {
                $newQuantity = $guestCart[$productId]['quantity'] + $request->quantity;

                if ($product->stock < $newQuantity) {
                    return back()->with('error', 'Not enough stock available.');
                }

                $guestCart[$productId]['quantity'] = $newQuantity;
            } else {
                $guestCart[$productId] = [
                    'product_id' => (int) $request->product_id,
                    'quantity' => (int) $request->quantity,
                    'price' => $product->price,
                ];
            }

            session(['guest_cart' => $guestCart]);
        }

        MetaConversionApiService::trackAddToCart($product, (int) $request->quantity, $request);

        return back()->with('success', 'Product added to cart successfully!');
    }

    public function update(Request $request, $productId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($productId);

        if ($product->stock < $request->quantity) {
            return back()->with('error', 'Not enough stock available.');
        }

        if (Auth::check()) {
            $cartItem = Cart::where('user_id', Auth::id())
                ->where('product_id', $productId)
                ->first();

            if ($cartItem) {
                $cartItem->update(['quantity' => $request->quantity]);
            }
        } else {
            $guestCart = session('guest_cart', []);
            $key = (string) $productId;

            if (isset($guestCart[$key])) {
                $guestCart[$key]['quantity'] = (int) $request->quantity;
                session(['guest_cart' => $guestCart]);
            }
        }

        return back()->with('success', 'Cart updated successfully');
    }

    public function remove($productId)
    {
        if (Auth::check()) {
            Cart::where('user_id', Auth::id())
                ->where('product_id', $productId)
                ->delete();
        } else {
            $guestCart = session('guest_cart', []);
            unset($guestCart[(string) $productId]);
            session(['guest_cart' => $guestCart]);
        }

        return back()->with('success', 'Item removed from cart');
    }

    public function clear()
    {
        if (Auth::check()) {
            Cart::where('user_id', Auth::id())->delete();
        } else {
            session()->forget('guest_cart');
        }

        return back()->with('success', 'Cart cleared successfully');
    }
}
