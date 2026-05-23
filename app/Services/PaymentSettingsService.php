<?php

namespace App\Services;

use App\Models\Option;

class PaymentSettingsService
{
    public static function defaultBkashSettings(): array
    {
        return [
            'enabled'      => false,
            'sandbox_mode' => true,
            'app_key'      => '',
            'app_secret'   => '',
            'username'     => '',
            'password'     => '',
        ];
    }

    public static function defaultNagadSettings(): array
    {
        return [
            'enabled'      => false,
            'sandbox_mode' => true,
            'merchant_id'  => '',
            'merchant_key' => '',
        ];
    }

    public static function defaultRocketSettings(): array
    {
        return [
            'enabled'      => false,
            'sandbox_mode' => true,
            'merchant_id'  => '',
            'merchant_key' => '',
        ];
    }

    public static function getSettings(): array
    {
        $settings = Option::getValue('payment_settings', []);
        $settings = is_array($settings) ? $settings : [];

        $bkash  = is_array($settings['bkash'] ?? null) ? $settings['bkash'] : [];
        $nagad  = is_array($settings['nagad'] ?? null) ? $settings['nagad'] : [];
        $rocket = is_array($settings['rocket'] ?? null) ? $settings['rocket'] : [];

        $defaults = self::defaultBkashSettings();
        $normalized['bkash'] = [
            'enabled'      => (bool) ($bkash['enabled'] ?? $defaults['enabled']),
            'sandbox_mode' => (bool) ($bkash['sandbox_mode'] ?? $defaults['sandbox_mode']),
            'app_key'      => (string) ($bkash['app_key'] ?? ''),
            'app_secret'   => (string) ($bkash['app_secret'] ?? ''),
            'username'     => (string) ($bkash['username'] ?? ''),
            'password'     => (string) ($bkash['password'] ?? ''),
        ];

        $defaults = self::defaultNagadSettings();
        $normalized['nagad'] = [
            'enabled'      => (bool) ($nagad['enabled'] ?? $defaults['enabled']),
            'sandbox_mode' => (bool) ($nagad['sandbox_mode'] ?? $defaults['sandbox_mode']),
            'merchant_id'  => (string) ($nagad['merchant_id'] ?? ''),
            'merchant_key' => (string) ($nagad['merchant_key'] ?? ''),
        ];

        $defaults = self::defaultRocketSettings();
        $normalized['rocket'] = [
            'enabled'      => (bool) ($rocket['enabled'] ?? $defaults['enabled']),
            'sandbox_mode' => (bool) ($rocket['sandbox_mode'] ?? $defaults['sandbox_mode']),
            'merchant_id'  => (string) ($rocket['merchant_id'] ?? ''),
            'merchant_key' => (string) ($rocket['merchant_key'] ?? ''),
        ];

        return $normalized;
    }

    public static function getEnabledMethods(): array
    {
        return collect(self::getSettings())
            ->filter(fn ($method) => $method['enabled'])
            ->keys()
            ->values()
            ->all();
    }

    public static function getBkashCredentials(): array
    {
        return self::getSettings()['bkash'];
    }

    public static function getNagadCredentials(): array
    {
        return self::getSettings()['nagad'];
    }

    public static function getRocketCredentials(): array
    {
        return self::getSettings()['rocket'];
    }
}
