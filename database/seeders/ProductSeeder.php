<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Get existing categories or create some if they don't exist
        $categories = Category::all();

        if ($categories->isEmpty()) {
            $categories = collect([
                Category::create([
                    'name' => 'Steam',
                    'description' => 'Steam gaming platform vouchers',
                    'status' => 'active',
                ]),
                Category::create([
                    'name' => 'PlayStation',
                    'description' => 'PlayStation Store vouchers',
                    'status' => 'active',
                ]),
                Category::create([
                    'name' => 'Xbox',
                    'description' => 'Xbox gaming vouchers',
                    'status' => 'active',
                ]),
            ]);
        }

        $products = [
            [
                'title' => 'Steam Wallet $50',
                'category_id' => $categories->first()->id,
                'status' => 'active',
                'price' => 45.99,
                'original_price' => 50.00,
                'buying_price' => 40.00,
                'description' => 'Add funds to your Steam Wallet with this $50 voucher',
                'total_codes' => 100,
                'sold_codes' => 15,
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'PlayStation Store $25',
                'category_id' => $categories->count() > 1 ? $categories->skip(1)->first()->id : $categories->first()->id,
                'status' => 'active',
                'price' => 22.99,
                'original_price' => 25.00,
                'buying_price' => 20.00,
                'description' => 'PlayStation Store gift card for games and content',
                'total_codes' => 75,
                'sold_codes' => 8,
                'is_featured' => false,
                'sort_order' => 2,
            ],
            [
                'title' => 'Xbox Game Pass 3 Months',
                'category_id' => $categories->count() > 2 ? $categories->skip(2)->first()->id : $categories->first()->id,
                'status' => 'active',
                'price' => 29.99,
                'original_price' => 35.99,
                'buying_price' => 25.00,
                'description' => '3 months of Xbox Game Pass Ultimate',
                'total_codes' => 50,
                'sold_codes' => 12,
                'is_featured' => true,
                'sort_order' => 3,
            ],
            [
                'title' => 'Steam Wallet $20',
                'category_id' => $categories->first()->id,
                'status' => 'inactive',
                'price' => 18.99,
                'original_price' => 20.00,
                'buying_price' => 16.00,
                'description' => 'Add $20 to your Steam Wallet',
                'total_codes' => 0,
                'sold_codes' => 0,
                'is_featured' => false,
                'sort_order' => 4,
            ],
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }
    }
}
