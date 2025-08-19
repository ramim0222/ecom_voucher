<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Code;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\OrderService;
use Illuminate\Support\Facades\Hash;

class OrderTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test user
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'first_name' => 'Test',
                'last_name' => 'User',
                'password' => Hash::make('password'),
                'phone_number' => '+880 1234 567890',
                'street_address' => '123 Test Street',
                'city' => 'Dhaka',
                'state' => 'Dhaka',
                'zip' => '1000',
                'country' => 'BD',
                'role' => 'customer',
                'status' => 'active',
            ]
        );

        // Create test category
        $category = Category::firstOrCreate(
            ['name' => 'Gaming Cards'],
            [
                'status' => 'active',
                'logo' => null,
            ]
        );

        // Create test products
        $products = [
            [
                'title' => 'Steam Wallet $10',
                'price' => 9.99,
                'original_price' => 10.00,
                'buying_price' => 8.00,
                'description' => 'Steam Wallet $10 digital code',
                'status' => 'active',
                'total_codes' => 100,
                'sold_codes' => 0,
                'is_featured' => true,
            ],
            [
                'title' => 'PlayStation Store $25',
                'price' => 24.99,
                'original_price' => 25.00,
                'buying_price' => 20.00,
                'description' => 'PlayStation Store $25 gift card',
                'status' => 'active',
                'total_codes' => 50,
                'sold_codes' => 0,
                'is_featured' => false,
            ],
        ];

        foreach ($products as $productData) {
            $product = Product::firstOrCreate(
                ['title' => $productData['title']],
                array_merge($productData, ['category_id' => $category->id])
            );

            // Create test codes for each product
            for ($i = 1; $i <= 10; $i++) {
                Code::firstOrCreate(
                    ['code' => $productData['title'] . '-CODE-' . str_pad($i, 3, '0', STR_PAD_LEFT)],
                    [
                        'product_id' => $product->id,
                        'status' => 'available',
                    ]
                );
            }
        }

        // Add items to cart for testing
        $steamProduct = Product::where('title', 'Steam Wallet $10')->first();
        $psProduct = Product::where('title', 'PlayStation Store $25')->first();

        Cart::firstOrCreate(
            ['user_id' => $user->id, 'product_id' => $steamProduct->id],
            ['quantity' => 2, 'price' => $steamProduct->price]
        );

        Cart::firstOrCreate(
            ['user_id' => $user->id, 'product_id' => $psProduct->id],
            ['quantity' => 1, 'price' => $psProduct->price]
        );

        $this->command->info('Test data seeded successfully!');
        $this->command->info('Test user email: test@example.com');
        $this->command->info('Test user password: password');
    }
}
