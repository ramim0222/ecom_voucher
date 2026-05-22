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
        $cartItems = Auth::user()->cart()->with('product.category')->get();

        // Transform cart items for frontend
        $transformedItems = $cartItems->map(function ($cartItem) {
            return [
                'id' => $cartItem->id,
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

        return Inertia::render('Cart', [
            'cartItems' => $transformedItems
        ]);
    }

    public function add(Request $request)
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);

        // Check if product has enough stock
        if ($product->stock < $request->quantity) {
            return back()->with('error', 'Not enough stock available.');
        }

        // Check if item already exists in cart
        $existingCartItem = Cart::where('user_id', Auth::id())
            ->where('product_id', $request->product_id)
            ->first();

        if ($existingCartItem) {
            // Update quantity
            $newQuantity = $existingCartItem->quantity + $request->quantity;

            if ($product->stock < $newQuantity) {
                return back()->with('error', 'Not enough stock available.');
            }

            $existingCartItem->update([
                'quantity' => $newQuantity,
                'price' => $product->price, // Update price in case it changed
            ]);
        } else {
            // Create new cart item
            Cart::create([
                'user_id' => Auth::id(),
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'price' => $product->price,
            ]);
        }

        MetaConversionApiService::trackAddToCart($product, (int) $request->quantity, $request);

        return back()->with('success', 'Product added to cart successfully!');
    }

    public function update(Request $request, Cart $cart)
    {
        // Ensure user owns this cart item
        if ($cart->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        // Check stock availability
        if ($cart->product->stock < $request->quantity) {
            return back()->with('error', 'Not enough stock available.');
        }

        $cart->update(['quantity' => $request->quantity]);

        return back()->with('success', 'Cart updated successfully');
    }

    public function remove(Cart $cart)
    {
        // Ensure user owns this cart item
        if ($cart->user_id !== Auth::id()) {
            abort(403);
        }

        $cart->delete();

        return back()->with('success', 'Item removed from cart');
    }

    public function clear()
    {
        Cart::where('user_id', Auth::id())->delete();

        return back()->with('success', 'Cart cleared successfully');
    }
}
