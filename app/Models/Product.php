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

    protected $casts = [
        'features' => 'array',
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'buying_price' => 'decimal:2',
        'is_featured' => 'boolean',
        'total_codes' => 'integer',
        'sold_codes' => 'integer',
    ];

    protected $appends = [
        'stock'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function codes()
    {
        return $this->hasMany(Code::class);
    }

    public function availableCodes()
    {
        return $this->hasMany(Code::class)->where('status', 'available');
    }

        // Computed attribute for stock
    public function getStockAttribute()
    {
        // Always count available codes directly from the database
        return $this->codes()->where('status', 'available')->count();
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function cart()
    {
        return $this->hasMany(Cart::class);
    }

    public function wishlist()
    {
        return $this->hasMany(Wishlist::class);
    }
}
