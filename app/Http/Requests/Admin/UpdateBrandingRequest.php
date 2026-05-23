<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBrandingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null && $this->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'brand_name' => ['required', 'string', 'max:100'],
            'brand_description' => ['nullable', 'string', 'max:500'],
            'hero_title' => ['required', 'string', 'max:150'],
            'hero_description' => ['nullable', 'string', 'max:500'],
            'products_title' => ['required', 'string', 'max:150'],
            'products_description' => ['nullable', 'string', 'max:500'],
            'featured_title' => ['required', 'string', 'max:150'],
            'featured_description' => ['nullable', 'string', 'max:500'],
            'discounts_title' => ['required', 'string', 'max:150'],
            'discounts_description' => ['nullable', 'string', 'max:500'],
            'categories_title' => ['required', 'string', 'max:150'],
            'branding.logo' => ['nullable', 'file', 'mimes:jpeg,jpg,png,webp,svg', 'max:2048'],
            'branding.favicon' => ['nullable', 'file', 'mimes:ico,png,svg,webp', 'max:1024'],
        ];
    }
}
