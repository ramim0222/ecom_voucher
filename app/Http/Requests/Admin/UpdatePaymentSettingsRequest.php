<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePaymentSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            // bKash
            'bkash.enabled'      => ['nullable', 'boolean'],
            'bkash.sandbox_mode' => ['nullable', 'boolean'],
            'bkash.app_key'      => ['nullable', 'string', 'max:255'],
            'bkash.app_secret'   => ['nullable', 'string', 'max:255'],
            'bkash.username'     => ['nullable', 'string', 'max:255'],
            'bkash.password'     => ['nullable', 'string', 'max:255'],

            // Nagad
            'nagad.enabled'      => ['nullable', 'boolean'],
            'nagad.sandbox_mode' => ['nullable', 'boolean'],
            'nagad.merchant_id'  => ['nullable', 'string', 'max:255'],
            'nagad.merchant_key' => ['nullable', 'string', 'max:2000'],

            // Rocket
            'rocket.enabled'      => ['nullable', 'boolean'],
            'rocket.sandbox_mode' => ['nullable', 'boolean'],
            'rocket.merchant_id'  => ['nullable', 'string', 'max:255'],
            'rocket.merchant_key' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
