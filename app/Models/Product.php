<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'product_image',
        'title',
        'category_id',
        'status',
        'price',
        'original_price',
        'buying_price',
        'description',
        'total_codes',
        'sold_codes',
        'features',
        'is_featured',
        'sort_order',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
