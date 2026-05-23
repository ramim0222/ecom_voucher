<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Product;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class GuestSessionMergeService
{
    public function merge(User $user, ?Request $request = null): void
    {
        $request = $request ?? request();

        $this->mergeCart($user, $request->session()->get('guest_cart', []));
        $this->mergeWishlist($user, $request->session()->get('guest_wishlist', []));

        $request->session()->forget(['guest_cart', 'guest_wishlist']);
    }

    protected function mergeCart(User $user, array $guestCart): void
    {
        if (empty($guestCart)) {
            return;
        }

        foreach ($guestCart as $item) {
            $productId = $item['product_id'] ?? null;
            $quantity = (int) ($item['quantity'] ?? 1);

            if (!$productId || $quantity < 1) {
                continue;
            }

            $product = Product::find($productId);
            if (!$product || $product->stock <= 0) {
                continue;
            }

            $existingCartItem = Cart::where('user_id', $user->id)
                ->where('product_id', $productId)
                ->first();

            if ($existingCartItem) {
                $newQuantity = min(
                    $existingCartItem->quantity + $quantity,
                    (int) $product->stock
                );

                if ($newQuantity > $existingCartItem->quantity) {
                    $existingCartItem->update([
                        'quantity' => $newQuantity,
                        'price' => $product->price,
                    ]);
                }
            } else {
                Cart::create([
                    'user_id' => $user->id,
                    'product_id' => $productId,
                    'quantity' => min($quantity, (int) $product->stock),
                    'price' => $product->price,
                ]);
            }
        }
    }

    protected function mergeWishlist(User $user, array $guestWishlist): void
    {
        if (empty($guestWishlist)) {
            return;
        }

        foreach ($guestWishlist as $item) {
            $productId = is_array($item) ? ($item['product_id'] ?? null) : $item;

            if (!$productId || !Product::where('id', $productId)->exists()) {
                continue;
            }

            Wishlist::firstOrCreate([
                'user_id' => $user->id,
                'product_id' => $productId,
            ]);
        }
    }
}
