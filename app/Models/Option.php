<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Option extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
    ];

    public static function getValue($key, $default = null)
    {
        $option = static::where('key', $key)->first();

        if (! $option) {
            return $default;
        }

        $decoded = json_decode($option->value, true);

        return $decoded !== null ? $decoded : $option->value;
    }

    public static function setValue($key, $value)
    {
        $option = static::where('key', $key)->first();

        if (! $option) {
            $option = new static();
            $option->key = $key;
        }

        $option->value = is_array($value) || is_object($value) ? json_encode($value) : (string) $value;
        $option->save();

        return $option;
    }
}
