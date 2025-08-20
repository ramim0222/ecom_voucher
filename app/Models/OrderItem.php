<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'unit_price',
        'total_price',
        'assigned_codes',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'assigned_codes' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($orderItem) {
            $orderItem->total_price = $orderItem->quantity * $orderItem->unit_price;
        });

        static::updating(function ($orderItem) {
            if ($orderItem->isDirty(['quantity', 'unit_price'])) {
                $orderItem->total_price = $orderItem->quantity * $orderItem->unit_price;
            }
        });
    }

    /**
     * Get the order that owns the order item
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the product that owns the order item
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Check if codes have been assigned to this order item
     */
    public function hasAssignedCodes(): bool
    {
        return !empty($this->assigned_codes);
    }

    /**
     * Get assigned code models
     */
    public function getAssignedCodeModels()
    {
        if (!$this->assigned_codes) {
            return collect();
        }

        try {
            return \App\Models\Code::whereIn('id', $this->assigned_codes)->get();
        } catch (\Exception $e) {
            return collect();
        }
    }

    /**
     * Get assigned codes as actual code values
     */
    public function getAssignedCodeValues(): array
    {
        if (!$this->assigned_codes) {
            return [];
        }

        try {
            return \App\Models\Code::whereIn('id', $this->assigned_codes)
                ->pluck('code')
                ->toArray();
        } catch (\Exception $e) {
            return [];
        }
    }
}
