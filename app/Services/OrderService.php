<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Models\Cart;
use App\Models\Code;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderService
{
    /**
     * Create order from cart
     */
    public function createOrderFromCart(User $user, array $orderData = []): Order
    {
        return DB::transaction(function () use ($user, $orderData) {
            // Get cart items with FOR UPDATE lock to prevent concurrent issues
            $cartItems = Cart::where('user_id', $user->id)
                ->with(['product' => function($query) {
                    $query->lockForUpdate(); // Lock products to prevent race conditions
                }])
                ->get();

            if ($cartItems->isEmpty()) {
                throw new \Exception('Cart is empty');
            }

            // Validate stock availability with real-time check
            foreach ($cartItems as $cartItem) {
                $availableStock = $cartItem->product->codes()
                    ->where('status', 'available')
                    ->count();

                if ($availableStock < $cartItem->quantity) {
                    throw new \Exception("Insufficient stock for product: {$cartItem->product->title}. Available: {$availableStock}, Requested: {$cartItem->quantity}");
                }
            }

            // Create order
            $order = Order::create([
                'user_id' => $user->id,
                'subtotal' => 0,
                'discount_amount' => $orderData['discount_amount'] ?? 0,
                'tax_amount' => $orderData['tax_amount'] ?? 0,
                'total_amount' => 0,
                'status' => 'pending',
                'payment_method' => $orderData['payment_method'] ?? null,
                'billing_address' => $orderData['billing_address'] ?? null,
                'notes' => $orderData['notes'] ?? null,
            ]);

            // Create order items
            $subtotal = 0;
            foreach ($cartItems as $cartItem) {
                $orderItem = OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $cartItem->product->price,
                ]);

                $subtotal += $orderItem->total_price;
            }

            // Update order totals
            $totalAmount = $subtotal + $order->tax_amount - $order->discount_amount;
            $order->update([
                'subtotal' => $subtotal,
                'total_amount' => $totalAmount,
            ]);

            // Clear cart
            Cart::where('user_id', $user->id)->delete();

            // Auto-complete payment and assign codes for all orders
            $this->autoCompleteOrder($order);

            Log::info('Order created and auto-completed successfully', ['order_id' => $order->id, 'user_id' => $user->id]);

            return $order;
        });
    }

    /**
     * Create order for a guest (no user account required)
     */
    public function createGuestOrder(array $products, array $orderData = []): Order
    {
        return DB::transaction(function () use ($products, $orderData) {
            $subtotal = 0;
            $validatedProducts = [];

            foreach ($products as $productData) {
                $product = Product::findOrFail($productData['product_id']);

                $availableStock = $product->codes()
                    ->where('status', 'available')
                    ->lockForUpdate()
                    ->count();

                if ($availableStock < $productData['quantity']) {
                    throw new \Exception("Insufficient stock for product: {$product->title}. Available: {$availableStock}, Requested: {$productData['quantity']}");
                }

                $validatedProducts[] = [
                    'product' => $product,
                    'quantity' => $productData['quantity'],
                    'unit_price' => $product->price,
                ];

                $subtotal += $product->price * $productData['quantity'];
            }

            $order = Order::create([
                'user_id' => null,
                'subtotal' => $subtotal,
                'discount_amount' => $orderData['discount_amount'] ?? 0,
                'tax_amount' => $orderData['tax_amount'] ?? 0,
                'total_amount' => $subtotal + ($orderData['tax_amount'] ?? 0) - ($orderData['discount_amount'] ?? 0),
                'status' => 'pending',
                'payment_method' => $orderData['payment_method'] ?? null,
                'billing_address' => $orderData['billing_address'] ?? null,
                'notes' => $orderData['notes'] ?? null,
            ]);

            foreach ($validatedProducts as $productData) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $productData['product']->id,
                    'quantity' => $productData['quantity'],
                    'unit_price' => $productData['unit_price'],
                ]);
            }

            $this->autoCompleteOrder($order);

            Log::info('Guest order created and auto-completed successfully', ['order_id' => $order->id]);

            return $order;
        });
    }

    /**
     * Create order from products directly
     */
    public function createOrderFromProducts(User $user, array $products, array $orderData = []): Order
    {
        return DB::transaction(function () use ($user, $products, $orderData) {
            // Validate products and stock
            $subtotal = 0;
            $validatedProducts = [];

            foreach ($products as $productData) {
                $product = Product::findOrFail($productData['product_id']);

                if ($product->stock < $productData['quantity']) {
                    throw new \Exception("Insufficient stock for product: {$product->title}");
                }

                $validatedProducts[] = [
                    'product' => $product,
                    'quantity' => $productData['quantity'],
                    'unit_price' => $product->price,
                    'total_price' => $product->price * $productData['quantity'],
                ];

                $subtotal += $product->price * $productData['quantity'];
            }

            // Create order
            $order = Order::create([
                'user_id' => $user->id,
                'subtotal' => $subtotal,
                'discount_amount' => $orderData['discount_amount'] ?? 0,
                'tax_amount' => $orderData['tax_amount'] ?? 0,
                'total_amount' => $subtotal + ($orderData['tax_amount'] ?? 0) - ($orderData['discount_amount'] ?? 0),
                'status' => 'pending',
                'payment_method' => $orderData['payment_method'] ?? null,
                'billing_address' => $orderData['billing_address'] ?? null,
                'notes' => $orderData['notes'] ?? null,
            ]);

            // Create order items
            foreach ($validatedProducts as $productData) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $productData['product']->id,
                    'quantity' => $productData['quantity'],
                    'unit_price' => $productData['unit_price'],
                ]);
            }

            // Auto-complete payment and assign codes for all orders
            $this->autoCompleteOrder($order);

            Log::info('Order created and auto-completed successfully', ['order_id' => $order->id, 'user_id' => $user->id]);

            return $order;
        });
    }

    /**
     * Auto-complete order with payment and code assignment
     * Used when payment integration is not required
     */
    protected function autoCompleteOrder(Order $order): void
    {
        // Since payment integration is not available, automatically mark as paid
        $order->update([
            'payment_status' => 'paid',
            'payment_completed_at' => now(),
            'payment_reference' => 'AUTO-' . time() . '-' . $order->id,
            'payment_details' => ['auto_completed' => true, 'note' => 'Automatically marked as paid'],
            'status' => 'processing',
        ]);

        // Assign codes immediately
        $this->assignCodesAtPayment($order);

        // Mark order as completed since codes are assigned
        $order->update(['status' => 'completed']);

        Log::info('Order auto-completed successfully', [
            'order_id' => $order->id,
            'payment_reference' => $order->payment_reference
        ]);
    }

    /**
     * Process payment and complete order with code assignment
     */
    public function processPayment(Order $order, string $paymentMethod, array $paymentData = []): bool
    {
        try {
            return DB::transaction(function () use ($order, $paymentMethod, $paymentData) {
                // Double-check stock availability before finalizing
                foreach ($order->orderItems as $orderItem) {
                    $availableStock = $orderItem->product->codes()
                        ->where('status', 'available')
                        ->lockForUpdate() // Lock codes to prevent race conditions
                        ->count();

                    if ($availableStock < $orderItem->quantity) {
                        // Cancel the order if insufficient stock
                        $order->update([
                            'status' => 'cancelled',
                            'payment_status' => 'failed',
                            'notes' => $order->notes . "\nOrder cancelled due to insufficient stock at payment time."
                        ]);

                        throw new \Exception("Order cancelled: Insufficient stock for product: {$orderItem->product->title}. Available: {$availableStock}, Required: {$orderItem->quantity}");
                    }
                }

                // Mark payment as completed
                $order->update([
                    'payment_status' => 'paid',
                    'payment_completed_at' => now(),
                    'payment_reference' => $paymentData['payment_reference'] ?? null,
                    'payment_details' => $paymentData['payment_details'] ?? [],
                    'status' => 'processing',
                ]);

                // Assign codes immediately after payment
                $this->assignCodesAtPayment($order);

                // Mark order as completed since codes are assigned
                $order->update(['status' => 'completed']);

                Log::info('Payment processed and codes assigned successfully', [
                    'order_id' => $order->id,
                    'payment_method' => $paymentMethod
                ]);

                return true;
            });

        } catch (\Exception $e) {
            Log::error('Payment processing failed', [
                'order_id' => $order->id,
                'error' => $e->getMessage()
            ]);

            // Update order status to failed if not already updated
            if ($order->payment_status !== 'failed') {
                $order->update(['payment_status' => 'failed']);
            }

            return false;
        }
    }

    /**
     * Public method to assign codes to order (for admin use)
     */
    public function assignCodesToOrder(Order $order): void
    {
        $this->assignCodesAtPayment($order);
    }

    /**
     * Assign codes immediately upon successful payment
     */
    protected function assignCodesAtPayment(Order $order): void
    {
        foreach ($order->orderItems as $orderItem) {
            if (!$orderItem->assigned_codes) {
                // Get available codes with lock
                $availableCodes = $orderItem->product
                    ->codes()
                    ->where('status', 'available')
                    ->lockForUpdate()
                    ->limit($orderItem->quantity)
                    ->get();

                if ($availableCodes->count() < $orderItem->quantity) {
                    throw new \Exception("Insufficient codes available for product: {$orderItem->product->title}");
                }

                $codeIds = [];
                foreach ($availableCodes as $code) {
                    $code->update(['status' => 'sold']);
                    $codeIds[] = $code->id;
                }

                $orderItem->update(['assigned_codes' => $codeIds]);

                // Update product sold_codes count
                $orderItem->product->increment('sold_codes', $orderItem->quantity);
            }
        }
    }

    /**
     * Cancel order
     */
    public function cancelOrder(Order $order, string $reason = null): bool
    {
        try {
            DB::transaction(function () use ($order, $reason) {
                if ($order->isCompleted()) {
                    throw new \Exception('Cannot cancel completed order');
                }

                // If codes were assigned, release them
                foreach ($order->orderItems as $orderItem) {
                    if ($orderItem->hasAssignedCodes()) {
                        $codeModels = $orderItem->getAssignedCodeModels();
                        foreach ($codeModels as $code) {
                            $code->update(['status' => 'available']);
                        }

                        // Decrease sold_codes count
                        $orderItem->product->decrement('sold_codes', $orderItem->quantity);
                    }
                }

                $order->update([
                    'status' => 'cancelled',
                    'notes' => $order->notes . "\nCancellation reason: " . ($reason ?? 'No reason provided'),
                ]);
            });

            Log::info('Order cancelled successfully', ['order_id' => $order->id]);
            return true;

        } catch (\Exception $e) {
            Log::error('Order cancellation failed', [
                'order_id' => $order->id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

        /**
     * Get order summary for user
     */
    public function getOrderSummary(Order $order): array
    {
        $order->load(['orderItems.product', 'user']);

        return [
            'order_number' => $order->order_number,
            'status' => $order->status,
            'payment_status' => $order->payment_status,
            'subtotal' => $order->subtotal,
            'discount_amount' => $order->discount_amount,
            'tax_amount' => $order->tax_amount,
            'total_amount' => $order->total_amount,
            'created_at' => $order->created_at,
            'payment_completed_at' => $order->payment_completed_at,
            'customer' => $order->user ? [
                'name' => $order->user->full_name,
                'email' => $order->user->email,
            ] : [
                'name' => ($order->billing_address['first_name'] ?? '') . ' ' . ($order->billing_address['last_name'] ?? ''),
                'email' => $order->billing_address['email'] ?? '',
            ],
            'items' => $order->orderItems->map(function ($item) {
                $assignedCodes = null;
                if ($item->hasAssignedCodes()) {
                    $assignedCodes = Code::whereIn('id', $item->assigned_codes)
                        ->pluck('code')
                        ->toArray();
                }

                return [
                    'product_id' => $item->product_id,
                    'product_title' => $item->product->title,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'total_price' => $item->total_price,
                    'assigned_codes' => $assignedCodes,
                ];
            }),
        ];
    }

    /**
     * Check if product codes are available for order
     */
    public function checkProductAvailability(array $products): array
    {
        $availability = [];

        foreach ($products as $productData) {
            $product = Product::findOrFail($productData['product_id']);
            $requestedQuantity = $productData['quantity'];
            $availableStock = $product->stock;

            $availability[] = [
                'product_id' => $product->id,
                'product_title' => $product->title,
                'requested_quantity' => $requestedQuantity,
                'available_stock' => $availableStock,
                'is_available' => $availableStock >= $requestedQuantity,
            ];
        }

        return $availability;
    }
}
