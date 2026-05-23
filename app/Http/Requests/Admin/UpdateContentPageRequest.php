<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateContentPageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        $rules = [
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:500'],
        ];

        if ($this->routeIs('admin.settings.content.faq.update')) {
            $rules['items'] = ['nullable', 'array'];
            $rules['items.*.question'] = ['required_with:items.*.answer', 'string', 'max:500'];
            $rules['items.*.answer'] = ['required_with:items.*.question', 'string', 'max:5000'];
        } else {
            $rules['content'] = ['nullable', 'string', 'max:50000'];
        }

        return $rules;
    }
}
