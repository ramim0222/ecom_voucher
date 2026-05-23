<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BkashPaymentService
{
    private string $baseUrl;
    private string $appKey;
    private string $appSecret;
    private string $username;
    private string $password;

    public function __construct(array $credentials)
    {
        $sandbox = (bool) ($credentials['sandbox_mode'] ?? true);

        $this->baseUrl   = $sandbox
            ? 'https://tokenized.sandbox.bka.sh/v1.2.0-beta'
            : 'https://tokenized.pay.bka.sh/v1.2.0-beta';

        $this->appKey    = $credentials['app_key'] ?? '';
        $this->appSecret = $credentials['app_secret'] ?? '';
        $this->username  = $credentials['username'] ?? '';
        $this->password  = $credentials['password'] ?? '';
    }

    public static function fromSettings(): self
    {
        return new self(PaymentSettingsService::getBkashCredentials());
    }

    /**
     * Grant an access token (cached for 55 minutes).
     */
    private function getToken(): string
    {
        $cacheKey = 'bkash_token_' . md5($this->appKey);

        return Cache::remember($cacheKey, now()->addMinutes(55), function () {
            $response = Http::withHeaders([
                'Content-Type'  => 'application/json',
                'username'      => $this->username,
                'password'      => $this->password,
            ])->post($this->baseUrl . '/tokenized/checkout/token/grant', [
                'app_key'    => $this->appKey,
                'app_secret' => $this->appSecret,
            ]);

            if (!$response->successful()) {
                Log::error('bKash token grant failed', ['body' => $response->body()]);
                throw new \RuntimeException('bKash: failed to grant access token.');
            }

            $token = $response->json('id_token');

            if (!$token) {
                throw new \RuntimeException('bKash: empty id_token in response.');
            }

            return $token;
        });
    }

    /**
     * Create a bKash payment and return the redirect URL.
     */
    public function initiatePayment(Order $order): string
    {
        $token = $this->getToken();

        $response = Http::withHeaders([
            'Content-Type'  => 'application/json',
            'Authorization' => $token,
            'X-APP-Key'     => $this->appKey,
        ])->post($this->baseUrl . '/tokenized/checkout/create', [
            'mode'                  => '0011',
            'payerReference'        => (string) $order->id,
            'callbackURL'           => route('payment.callback.bkash'),
            'merchantAssociationInfo' => 'MI05MID54RF09123456One',
            'amount'                => number_format($order->total_amount, 2, '.', ''),
            'currency'              => 'BDT',
            'intent'                => 'sale',
            'merchantInvoiceNumber' => $order->order_number,
        ]);

        if (!$response->successful()) {
            Log::error('bKash create payment failed', ['body' => $response->body(), 'order' => $order->id]);
            throw new \RuntimeException('bKash: failed to create payment session.');
        }

        $data = $response->json();

        if (($data['statusCode'] ?? '') !== '0000') {
            Log::error('bKash create payment non-zero status', ['data' => $data, 'order' => $order->id]);
            throw new \RuntimeException('bKash: ' . ($data['statusMessage'] ?? 'Unknown error'));
        }

        $paymentId = $data['paymentID'] ?? null;

        if (!$paymentId) {
            throw new \RuntimeException('bKash: missing paymentID in response.');
        }

        // Store paymentID on the order so the callback can look it up
        $order->update(['payment_reference' => $paymentId]);

        return $data['bkashURL'] ?? throw new \RuntimeException('bKash: missing bkashURL in response.');
    }

    /**
     * Execute (verify + capture) a payment by paymentID.
     * Returns true on success, false on any failure.
     */
    public function verifyPayment(string $paymentId): bool
    {
        try {
            $token = $this->getToken();

            $response = Http::withHeaders([
                'Content-Type'  => 'application/json',
                'Authorization' => $token,
                'X-APP-Key'     => $this->appKey,
            ])->post($this->baseUrl . '/tokenized/checkout/execute', [
                'paymentID' => $paymentId,
            ]);

            if (!$response->successful()) {
                Log::error('bKash execute failed', ['body' => $response->body(), 'paymentID' => $paymentId]);
                return false;
            }

            $data = $response->json();

            if (($data['statusCode'] ?? '') !== '0000') {
                Log::warning('bKash execute non-zero status', ['data' => $data, 'paymentID' => $paymentId]);
                return false;
            }

            Log::info('bKash payment verified', [
                'paymentID'   => $paymentId,
                'trxID'       => $data['trxID'] ?? null,
                'amount'      => $data['amount'] ?? null,
            ]);

            return true;

        } catch (\Throwable $e) {
            Log::error('bKash verifyPayment exception', ['error' => $e->getMessage(), 'paymentID' => $paymentId]);
            return false;
        }
    }

    /**
     * Query payment status without executing.
     */
    public function queryPayment(string $paymentId): array
    {
        $token = $this->getToken();

        $response = Http::withHeaders([
            'Content-Type'  => 'application/json',
            'Authorization' => $token,
            'X-APP-Key'     => $this->appKey,
        ])->post($this->baseUrl . '/tokenized/checkout/payment/status', [
            'paymentID' => $paymentId,
        ]);

        return $response->json() ?? [];
    }
}
