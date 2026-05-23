<?php

namespace App\Services;

use App\Models\Option;

class ContentPagesService
{
    public const PAGE_FAQ = 'faq';

    public const PAGE_REFUND = 'refund';

    public const PAGE_PRIVACY = 'privacy';

    public const PAGE_TERMS = 'terms';

    public static function allowedPages(): array
    {
        return [
            self::PAGE_FAQ,
            self::PAGE_REFUND,
            self::PAGE_PRIVACY,
            self::PAGE_TERMS,
        ];
    }

    public static function getPage(string $page): array
    {
        if (! in_array($page, self::allowedPages(), true)) {
            abort(404);
        }

        $settings = Option::getValue('content_pages_settings', []);
        $settings = is_array($settings) ? $settings : [];
        $defaults = self::defaults()[$page];

        $stored = is_array($settings[$page] ?? null) ? $settings[$page] : [];

        if ($page === self::PAGE_FAQ) {
            $items = is_array($stored['items'] ?? null) ? $stored['items'] : $defaults['items'];

            return [
                'title' => (string) ($stored['title'] ?? $defaults['title']),
                'subtitle' => (string) ($stored['subtitle'] ?? $defaults['subtitle']),
                'items' => collect($items)
                    ->map(function ($item) {
                        return [
                            'question' => (string) ($item['question'] ?? ''),
                            'answer' => (string) ($item['answer'] ?? ''),
                        ];
                    })
                    ->filter(fn ($item) => $item['question'] !== '' || $item['answer'] !== '')
                    ->values()
                    ->all(),
            ];
        }

        return [
            'title' => (string) ($stored['title'] ?? $defaults['title']),
            'subtitle' => (string) ($stored['subtitle'] ?? $defaults['subtitle']),
            'content' => (string) ($stored['content'] ?? $defaults['content']),
        ];
    }

    public static function updatePage(string $page, array $data): void
    {
        if (! in_array($page, self::allowedPages(), true)) {
            abort(404);
        }

        $settings = Option::getValue('content_pages_settings', []);
        $settings = is_array($settings) ? $settings : [];

        if ($page === self::PAGE_FAQ) {
            $settings[$page] = [
                'title' => $data['title'],
                'subtitle' => $data['subtitle'] ?? '',
                'items' => collect($data['items'] ?? [])
                    ->map(function ($item) {
                        return [
                            'question' => trim((string) ($item['question'] ?? '')),
                            'answer' => trim((string) ($item['answer'] ?? '')),
                        ];
                    })
                    ->filter(fn ($item) => $item['question'] !== '' && $item['answer'] !== '')
                    ->values()
                    ->all(),
            ];
        } else {
            $settings[$page] = [
                'title' => $data['title'],
                'subtitle' => $data['subtitle'] ?? '',
                'content' => $data['content'] ?? '',
            ];
        }

        Option::setValue('content_pages_settings', $settings);
    }

    public static function defaults(): array
    {
        return [
            self::PAGE_FAQ => [
                'title' => 'Frequently Asked Questions',
                'subtitle' => 'Find quick answers about voucher delivery, payments, refunds, and account help.',
                'items' => [
                    [
                        'question' => 'How long does it take to receive my voucher code?',
                        'answer' => 'Most voucher codes are delivered instantly after payment confirmation. In rare cases, it may take up to 15 minutes. If you have not received your code after 15 minutes, please contact our support team.',
                    ],
                    [
                        'question' => 'Can I get a refund for my voucher purchase?',
                        'answer' => 'Refunds are available within 24 hours of purchase if the voucher code has not been redeemed. Once a code is activated on the gaming platform, refunds cannot be processed due to platform policies.',
                    ],
                    [
                        'question' => 'What payment methods do you accept?',
                        'answer' => 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and various cryptocurrencies including Bitcoin and Ethereum.',
                    ],
                    [
                        'question' => 'Are your voucher codes region-locked?',
                        'answer' => 'Some voucher codes may have regional restrictions based on the gaming platform policies. We clearly indicate any regional limitations on the product page before purchase.',
                    ],
                    [
                        'question' => 'How do I redeem my voucher code?',
                        'answer' => 'Each voucher comes with detailed redemption instructions specific to the gaming platform. Generally, you will need to log into your gaming account and enter the code in the Redeem Code or Add Funds section.',
                    ],
                    [
                        'question' => 'Can I purchase vouchers as gifts?',
                        'answer' => 'Yes. You can purchase vouchers as gifts and either send them directly to the recipient email or receive the codes yourself to share manually.',
                    ],
                ],
            ],
            self::PAGE_REFUND => [
                'title' => 'Refund & Cancellation Policy',
                'subtitle' => 'Our policy for order cancellations, refunds, and digital voucher returns.',
                'content' => "Digital Voucher Refunds\n\nRefunds may be requested within 24 hours of purchase if the voucher code has not been redeemed or activated on the gaming platform. Once a code has been used, we cannot process a refund because the value has already been delivered.\n\nCancellation Before Delivery\n\nIf your order has not yet been fulfilled, you may cancel it by contacting our support team. Cancellations are processed as soon as possible and any authorized payment will be refunded to the original payment method.\n\nNon-Refundable Situations\n\nWe cannot offer refunds for redeemed voucher codes, incorrect platform or region selection by the customer, or purchases made outside the stated refund window.\n\nHow to Request a Refund\n\nContact our support team with your order number and reason for the request. Approved refunds are returned to the original payment method within 5 to 10 business days.",
            ],
            self::PAGE_PRIVACY => [
                'title' => 'Privacy Policy',
                'subtitle' => 'How we collect, use, and protect your personal information.',
                'content' => "Information We Collect\n\nWe collect information you provide when creating an account, placing an order, or contacting support. This may include your name, email address, billing details, and order history.\n\nHow We Use Your Information\n\nWe use your information to process orders, deliver voucher codes, provide customer support, improve our services, and send important account or order updates.\n\nData Security\n\nWe use industry-standard security measures to protect your personal information and payment data. Access to customer information is limited to authorized personnel only.\n\nThird-Party Services\n\nWe may use trusted third-party providers for payment processing, analytics, and marketing integrations. These providers only receive the data necessary to perform their services.\n\nYour Rights\n\nYou may request access to, correction of, or deletion of your personal data by contacting our support team. We will respond to valid requests in accordance with applicable laws.",
            ],
            self::PAGE_TERMS => [
                'title' => 'Terms & Conditions',
                'subtitle' => 'The rules and conditions for using our store and purchasing digital vouchers.',
                'content' => "Acceptance of Terms\n\nBy accessing our website and placing an order, you agree to these Terms & Conditions and our Privacy Policy.\n\nDigital Products\n\nAll products sold on this store are digital voucher codes delivered electronically. You are responsible for selecting the correct product, platform, and region before completing your purchase.\n\nAccount Responsibility\n\nYou are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.\n\nPricing and Availability\n\nPrices, promotions, and product availability may change at any time. We reserve the right to cancel or refuse any order if a product is unavailable or if an pricing error occurs.\n\nLimitation of Liability\n\nWe are not liable for issues caused by third-party gaming platforms, including redemption failures outside our control, account restrictions, or regional limitations imposed by the platform provider.\n\nChanges to These Terms\n\nWe may update these Terms & Conditions from time to time. Continued use of the website after changes are posted constitutes acceptance of the updated terms.",
            ],
        ];
    }
}
