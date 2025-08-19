<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Product;
use App\Models\Cart;
use App\Services\OrderService;

class CreateTestOrder extends Command
{
    protected $signature = 'order:create-test';
    protected $description = 'Create a test order for testing the order system';

    public function handle()
    {
        $user = User::where('email', 'test@example.com')->first();
        $product = Product::first();

        if (!$user) {
            $this->error('Test user not found. Please run the OrderTestSeeder first.');
            return;
        }

        if (!$product) {
            $this->error('No products found. Please run the OrderTestSeeder first.');
            return;
        }

        // Clear any existing cart items for the test user
        Cart::where('user_id', $user->id)->delete();

        // Add a product to cart
        Cart::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'price' => $product->price,
        ]);

        $this->info("Added {$product->title} to cart for {$user->email}");

        // Create order from cart
        $orderService = new OrderService();

        try {
            $order = $orderService->createOrderFromCart($user, [
                'payment_method' => 'test',
                'billing_address' => [
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'phone' => $user->phone_number,
                    'address' => $user->street_address,
                    'city' => $user->city,
                    'state' => $user->state,
                    'zip' => $user->zip,
                    'country' => $user->country,
                ],
                'notes' => 'Test order created via command',
            ]);

            $this->info("Test order created successfully!");
            $this->info("Order ID: {$order->id}");
            $this->info("Order Number: {$order->order_number}");
            $this->info("Status: {$order->status}");
            $this->info("Total: \${$order->total_amount}");
            $this->info("You can view it at: http://127.0.0.1:8000/orders/{$order->id}");

        } catch (\Exception $e) {
            $this->error("Failed to create order: " . $e->getMessage());
        }
    }
}
