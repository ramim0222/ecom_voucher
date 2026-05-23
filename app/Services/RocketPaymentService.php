<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RocketPaymentService
{
    private string $baseUrl;
    private string $merchantId;
    private string $merchantKey;

    public function __construct(array $credentials)
    {
        $sandbox = (bool) ($credentials['sandbox_mode'] ?? true);

        // DBBL Nexus Pay (Rocket) endpoint
        $this->baseUrl    = $sandbox
            ? 'https://sandbox.rocket.com.bd/merchant'
            : 'https://www.rocket.com.bd/merchant';

        $this->merchantId  = $credentials['merchant_id'] ?? '';
        $this->merchantKey = $credentials['merchant_key'] ?? '';
    }

    public static function fromSettings(): self
    {
        return new self(PaymentSettingsService::getRocketCredentials());
    }

    /**
     * Generate HMAC-SHA256 signature.
     */
    private function generateSignature(string $data): string
    {
        return hash_hmac('sha256', $data, $this->merchantKey);
    }

    /**
     * Initiate a Rocket (DBBL Nexus Pay) payment session and return the redirect URL.
     */
    public function initiatePayment(Order $order): string
    {
        $invoiceId   = $order->order_number;
        $amount      = number_format($order->total_amount, 2, '.', '');
        $callbackUrl = route('payment.callback.rocket');
        $timestamp   = now()->format('YmdHis');

        $signatureRaw = $this->merchantId . $invoiceId . $amount . $callbackUrl . $timestamp;
        $signature    = $this->generateSignature($signatureRaw);

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post($this->baseUrl . '/payment/init', [
            'merchant_id'   => $this->merchantId,
            'invoice_id'    => $invoiceId,
            'amount'        => $amount,
            'currency'      => 'BDT',
            'desc'          => 'Order ' . $invoiceId,
            'callback_url'  => $callbackUrl,
            'timestamp'     => $timestamp,
            'signature'     => $signature,
            'cus_name'      => ($order->billing_address['first_name'] ?? '') . ' ' . ($order->billing_address['last_name'] ?? ''),
            'cus_email'     => $order->billing_address['email'] ?? '',
            'cus_phone'     => $order->billing_address['phone'] ?? '',
        ]);

        if (!$response->successful()) {
            Log::error('Rocket init failed', ['body' => $response->body(), 'order' => $order->id]);
            throw new \RuntimeException('Rocket: payment initiation failed.');
        }

        $data = $response->json();

        if (($data['result'] ?? '') !== 'true' && ($data['status'] ?? '') !== 'success') {
            Log::error('Rocket non-success response', ['data' => $data, 'order' => $order->id]);
            throw new \RuntimeException('Rocket: ' . ($data['errorMessage'] ?? 'Unknown error'));
        }

        $redirectUrl = $data['payment_url'] ?? null;

        if (!$redirectUrl) {
            throw new \RuntimeException('Rocket: missing payment_url in response.');
        }

        $order->update(['payment_reference' => $data['session_key'] ?? $invoiceId]);

        return $redirectUrl;
    }

    /**
     * Verify a Rocket payment by session key / invoice ID.
     */
    public function verifyPayment(string $sessionKey): bool
    {
        try {
            $timestamp    = now()->format('YmdHis');
            $signatureRaw = $this->merchantId . $sessionKey . $timestamp;
            $signature    = $this->generateSignature($signatureRaw);

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/payment/verify', [
                'merchant_id' => $this->merchantId,
                'session_key' => $sessionKey,
                'timestamp'   => $timestamp,
                'signature'   => $signature,
            ]);

            if (!$response->successful()) {
                Log::error('Rocket verify failed', ['body' => $response->body(), 'session' => $sessionKey]);
                return false;
            }

            $data   = $response->json();
            $status = strtolower($data['pay_status'] ?? $data['status'] ?? '');

            if ($status !== 'successful' && $status !== 'success') {
                Log::warning('Rocket verify non-success', ['data' => $data, 'session' => $sessionKey]);
                return false;
            }

            Log::info('Rocket payment verified', [
                'session' => $sessionKey,
                'amount'  => $data['amount'] ?? null,
                'status'  => $status,
            ]);

            return true;

        } catch (\Throwable $e) {
            Log::error('Rocket verifyPayment exception', ['error' => $e->getMessage(), 'session' => $sessionKey]);
            return false;
        }
    }
}
