<?php

namespace App\Services;

use App\Models\Option;

class BrandingService
{
    public static function getSettings(): array
    {
        $settings = Option::getValue('branding_settings', []);
        $settings = is_array($settings) ? $settings : [];

        return [
            'logo_path' => (string) ($settings['logo_path'] ?? ''),
            'favicon_path' => (string) ($settings['favicon_path'] ?? ''),
            'brand_name' => (string) ($settings['brand_name'] ?? 'GameVault'),
            'brand_description' => (string) ($settings['brand_description'] ?? 'Premium Gaming Vouchers'),
            'hero_title' => (string) ($settings['hero_title'] ?? 'Unlock Your Next Adventure'),
            'hero_description' => (string) ($settings['hero_description'] ?? 'Seamless purchases for gamers, by gamers. Get instant access to your favorite gaming platforms.'),
            'products_title' => (string) ($settings['products_title'] ?? 'Gaming Vouchers'),
            'products_description' => (string) ($settings['products_description'] ?? 'Discover the best deals on gaming vouchers for all your favorite platforms'),
            'featured_title' => (string) ($settings['featured_title'] ?? 'Top Picks for You'),
            'featured_description' => (string) ($settings['featured_description'] ?? 'Limited-time deals on the most popular gaming vouchers'),
            'discounts_title' => (string) ($settings['discounts_title'] ?? 'Biggest Discounts'),
            'discounts_description' => (string) ($settings['discounts_description'] ?? 'Save more on these top discounted vouchers'),
            'categories_title' => (string) ($settings['categories_title'] ?? 'Browse by Platform'),
            'auth_panel_title' => (string) ($settings['auth_panel_title'] ?? 'Join the Gaming Revolution'),
            'auth_panel_description' => (string) ($settings['auth_panel_description'] ?? 'Access thousands of gaming vouchers and unlock your next adventure.'),
            'auth_background_path' => (string) ($settings['auth_background_path'] ?? ''),
        ];
    }
}
