<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdatePaymentSettingsRequest;
use App\Models\Option;
use App\Services\PaymentSettingsService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PaymentSettingsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/PaymentSettings', [
            'paymentSettings' => PaymentSettingsService::getSettings(),
        ]);
    }

    public function update(UpdatePaymentSettingsRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $bkash  = $validated['bkash'] ?? [];
        $nagad  = $validated['nagad'] ?? [];
        $rocket = $validated['rocket'] ?? [];

        $settings = [
            'bkash' => [
                'enabled'      => (bool) ($bkash['enabled'] ?? false),
                'sandbox_mode' => (bool) ($bkash['sandbox_mode'] ?? true),
                'app_key'      => (string) ($bkash['app_key'] ?? ''),
                'app_secret'   => (string) ($bkash['app_secret'] ?? ''),
                'username'     => (string) ($bkash['username'] ?? ''),
                'password'     => (string) ($bkash['password'] ?? ''),
            ],
            'nagad' => [
                'enabled'      => (bool) ($nagad['enabled'] ?? false),
                'sandbox_mode' => (bool) ($nagad['sandbox_mode'] ?? true),
                'merchant_id'  => (string) ($nagad['merchant_id'] ?? ''),
                'merchant_key' => (string) ($nagad['merchant_key'] ?? ''),
            ],
            'rocket' => [
                'enabled'      => (bool) ($rocket['enabled'] ?? false),
                'sandbox_mode' => (bool) ($rocket['sandbox_mode'] ?? true),
                'merchant_id'  => (string) ($rocket['merchant_id'] ?? ''),
                'merchant_key' => (string) ($rocket['merchant_key'] ?? ''),
            ],
        ];

        Option::setValue('payment_settings', $settings);

        return redirect()
            ->route('admin.settings.payment')
            ->with('success', 'Payment settings updated successfully.');
    }
}
