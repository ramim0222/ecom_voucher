<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Http;

class ContactFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
            'recaptcha_token' => ['required', 'string', function ($attribute, $value, $fail) {
                $secretKey = config('services.recaptcha.secret_key');

                if (empty($secretKey) || str_starts_with($secretKey, 'your-')) {
                    return;
                }

                $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                    'secret' => $secretKey,
                    'response' => $value,
                    'remoteip' => $this->ip(),
                ]);

                $result = $response->json();

                if (! ($result['success'] ?? false)) {
                    $fail('reCAPTCHA verification failed. Please try again.');
                    return;
                }

                if (($result['score'] ?? 0) < 0.5) {
                    $fail('Your submission was flagged as suspicious. Please try again.');
                }
            }],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Name is required.',
            'email.required' => 'Email is required.',
            'email.email' => 'Please provide a valid email address.',
            'subject.required' => 'Subject is required.',
            'message.required' => 'Message is required.',
            'message.max' => 'Message cannot exceed 5000 characters.',
            'recaptcha_token.required' => 'reCAPTCHA verification is required.',
        ];
    }
}
