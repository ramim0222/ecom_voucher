<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Category extends Model
{
    protected $fillable = [
        'name',
        'description',
        'status',
        'logo',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Delete logo when updating or deleting
        static::updating(function ($category) {
            $original = $category->getOriginal();
            if ($original['logo'] && $original['logo'] !== $category->logo) {
                Storage::disk('public')->delete($original['logo']);
            }
        });

        static::deleting(function ($category) {
            if ($category->logo) {
                Storage::disk('public')->delete($category->logo);
            }
        });
    }
}
