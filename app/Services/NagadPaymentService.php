<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request as RequestFacade;
use Illuminate\Support\Str;

class NagadPaymentService
{
    private string $baseUrl;
    private string $merchantId;
    private string $merchantKey;

    // Nagad public key for encrypting sensitive data (sandbox)
    private const SANDBOX_PUBLIC_KEY = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAp7apGpzNwFapCLaFOVeF' .
        'KBZ0ZBWwNy2HkfMsFRLBdHLiOFRhG5kgvIz6nHqfMEDrwT7Q+f0CVPQ9P0YFTZ' .
        'qr0kgJJpXuAiH5V+Zy9Y0LNqHkKQMkLUBPb3DpzV5rMB4WCjX1lH+q9K9RmH8d' .
        'OxA1VnwFrF3F8r5LkFfj3oZT3sTEG+Q7oAkPaS2kFq1GVc3PqzDzZoZPH1j+Zml' .
        'oUm0KjjQkW0g7L2U3b6oSNz3lBqe3G8sB5YFiVnPvF6fZ4DdX3+MlDHq2ASVZN' .
        'OQjIDAQAB';

    public function __construct(array $credentials)
    {
        $sandbox = (bool) ($credentials['sandbox_mode'] ?? true);

        $this->baseUrl     = $sandbox
            ? 'https://sandbox.mynagad.com:10080/remote-payment-gateway-1.0'
            : 'https://api.mynagad.com/api/dfs';

        $this->merchantId  = $credentials['merchant_id'] ?? '';
        $this->merchantKey = $credentials['merchant_key'] ?? '';
    }

    public static function fromSettings(): self
    {
        return new self(PaymentSettingsService::getNagadCredentials());
    }

    /**
     * Encrypt data with Nagad's RSA public key.
     */
    private function encryptData(string $plainText): string
    {
        $publicKey = "-----BEGIN PUBLIC KEY-----\n" .
            chunk_split(self::SANDBOX_PUBLIC_KEY, 64, "\n") .
            "-----END PUBLIC KEY-----";

        openssl_public_encrypt($plainText, $encrypted, $publicKey, OPENSSL_PKCS1_PADDING);

        return base64_encode($encrypted);
    }

    /**
     * Generate HMAC signature using the merchant key.
     */
    private function generateSignature(string $plainText): string
    {
        return base64_encode(hash_hmac('sha256', $plainText, $this->merchantKey, true));
    }

    /**
     * Initiate a Nagad payment session and return the redirect URL.
     */
    public function initiatePayment(Order $order): string
    {
        $datetime    = now()->format('YmdHis');
        $orderId     = $order->order_number;
        $callbackUrl = route('payment.callback.nagad');

        $sensitiveData = json_encode([
            'merchantId'      => $this->merchantId,
            'datetime'        => $datetime,
            'orderId'         => $orderId,
            'challenge'       => Str::random(40),
        ]);

        $encryptedData = $this->encryptData($sensitiveData);
        $signature     = $this->generateSignature($sensitiveData);

        // Step 1: Initialize
        $initUrl = $this->baseUrl . '/api/dfs/check-out/initialize/' . $this->merchantId . '/' . $orderId;

        $clientIp = RequestFacade::ip() ?? '127.0.0.1';

        $initResponse = Http::withHeaders([
            'Content-Type'         => 'application/json',
            'X-KM-Api-Version'     => 'v-0.2.0',
            'X-KM-IP-V4'          => $clientIp,
            'X-KM-Client-Type'    => 'PC_WEB',
        ])->post($initUrl, [
            'dateTime'              => $datetime,
            'sensitiveData'         => $encryptedData,
            'signature'             => $signature,
        ]);

        if (!$initResponse->successful()) {
            Log::error('Nagad init failed', ['body' => $initResponse->body(), 'order' => $order->id]);
            throw new \RuntimeException('Nagad: initialization failed.');
        }

        $initData = $initResponse->json();

        if (!isset($initData['sensitiveData'])) {
            throw new \RuntimeException('Nagad: missing sensitiveData in init response.');
        }

        // Step 2: Complete checkout
        $amount  = number_format($order->total_amount, 2, '.', '');
        $completeData = json_encode([
            'merchantId'       => $this->merchantId,
            'orderId'          => $orderId,
            'currencyCode'     => '050',
            'amount'           => $amount,
            'challenge'        => $initData['sensitiveData'],
        ]);

        $encryptedComplete = $this->encryptData($completeData);
        $completeSignature = $this->generateSignature($completeData);

        $completeUrl = $this->baseUrl . '/api/dfs/check-out/complete/' . $this->merchantId . '/' . $orderId;

        $completeResponse = Http::withHeaders([
            'Content-Type'         => 'application/json',
            'X-KM-Api-Version'     => 'v-0.2.0',
            'X-KM-IP-V4'          => $clientIp,
            'X-KM-Client-Type'    => 'PC_WEB',
        ])->post($completeUrl, [
            'sensitiveData'         => $encryptedComplete,
            'signature'             => $completeSignature,
            'merchantCallbackURL'   => $callbackUrl,
        ]);

        if (!$completeResponse->successful()) {
            Log::error('Nagad complete failed', ['body' => $completeResponse->body(), 'order' => $order->id]);
            throw new \RuntimeException('Nagad: payment completion step failed.');
        }

        $completeData = $completeResponse->json();

        $redirectUrl = $completeData['callBackUrl'] ?? null;

        if (!$redirectUrl) {
            Log::error('Nagad missing callBackUrl', ['data' => $completeData, 'order' => $order->id]);
            throw new \RuntimeException('Nagad: missing redirect URL in response.');
        }

        // Store payment reference
        $order->update(['payment_reference' => $completeData['paymentReferenceId'] ?? $orderId]);

        return $redirectUrl;
    }

    /**
     * Verify a Nagad payment by payment reference ID.
     */
    public function verifyPayment(string $paymentRefId): bool
    {
        try {
            $verifyUrl = $this->baseUrl . '/api/dfs/verify/payment/' . $paymentRefId;

            $response = Http::withHeaders([
                'Content-Type'     => 'application/json',
                'X-KM-Api-Version' => 'v-0.2.0',
            ])->get($verifyUrl);

            if (!$response->successful()) {
                Log::error('Nagad verify failed', ['body' => $response->body(), 'ref' => $paymentRefId]);
                return false;
            }

            $data = $response->json();

            $status = $data['status'] ?? '';

            if (strtolower($status) !== 'success') {
                Log::warning('Nagad verify non-success', ['data' => $data, 'ref' => $paymentRefId]);
                return false;
            }

            Log::info('Nagad payment verified', [
                'ref'    => $paymentRefId,
                'amount' => $data['amount'] ?? null,
                'status' => $status,
            ]);

            return true;

        } catch (\Throwable $e) {
            Log::error('Nagad verifyPayment exception', ['error' => $e->getMessage(), 'ref' => $paymentRefId]);
            return false;
        }
    }
}
