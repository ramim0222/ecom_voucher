<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMarketingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null && $this->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'dataset_id' => ['nullable', 'string', 'max:255'],
            'pixel_id' => ['nullable', 'string', 'max:255'],
            'access_token' => ['nullable', 'string'],
            'catalog' => ['nullable', 'string', 'max:255'],
            'test_event_code' => ['nullable', 'string', 'max:255'],
            'browser_tracking_enabled' => ['nullable', 'boolean'],
            'server_tracking_enabled' => ['nullable', 'boolean'],
            'analytics_script' => ['nullable', 'string'],
            'tag_manager_head_script' => ['nullable', 'string'],
            'tag_manager_body_script' => ['nullable', 'string'],
            'pixel_script' => ['nullable', 'string'],
        ];
    }
}
