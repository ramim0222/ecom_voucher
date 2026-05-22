<?php

namespace App\Services;

use App\Models\Option;
use App\Models\Order;
use App\Models\Product;
use FacebookAds\Api;
use FacebookAds\Object\ServerSide\Content;
use FacebookAds\Object\ServerSide\CustomData;
use FacebookAds\Object\ServerSide\Event;
use FacebookAds\Object\ServerSide\EventRequest;
use FacebookAds\Object\ServerSide\UserData;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class MetaConversionApiService
{
    public static function trackViewContent(Product $product, Request $request, ?int $quantity = null): void
    {
        $settings = self::getSettings();
        if (! $settings['server_enabled']) {
            return;
        }

        $product->loadMissing('category');

        $quantity = $quantity ?? 1;
        $price = (float) ($product->price ?? 0);

        $content = (new Content())
            ->setProductId(self::productId($product))
            ->setTitle($product->title)
            ->setCategory(self::productCategory($product))
            ->setQuantity($quantity)
            ->setItemPrice($price);

        $customData = (new CustomData())
            ->setContentIds([self::productId($product)])
            ->setContents([$content])
            ->setContentType('product')
            ->setContentName($product->title)
            ->setContentCategory(self::productCategory($product))
            ->setValue($price)
            ->setCurrency('BDT');

        $event = self::buildEvent('ViewContent', $customData, $request, uniqid('view_', true));

        self::sendEvent($event, $settings);
    }

    public static function trackAddToCart(Product $product, int $quantity, Request $request): void
    {
        $settings = self::getSettings();
        if (! $settings['server_enabled']) {
            return;
        }

        $product->loadMissing('category');

        $unitPrice = (float) ($product->price ?? 0);

        $content = (new Content())
            ->setProductId(self::productId($product))
            ->setTitle($product->title)
            ->setCategory(self::productCategory($product))
            ->setQuantity($quantity)
            ->setItemPrice($unitPrice);

        $customData = (new CustomData())
            ->setContentIds([self::productId($product)])
            ->setContents([$content])
            ->setContentType('product')
            ->setContentName($product->title)
            ->setContentCategory(self::productCategory($product))
            ->setValue($unitPrice * $quantity)
            ->setCurrency('BDT');

        $event = self::buildEvent('AddToCart', $customData, $request, uniqid('cart_', true));

        self::sendEvent($event, $settings);
    }

    public static function trackInitiateCheckout(Collection $cartItems, Request $request): void
    {
        $settings = self::getSettings();
        if (! $settings['server_enabled']) {
            return;
        }

        $cartItems->loadMissing('product.category');

        $contents = [];
        $contentIds = [];
        $total = 0.0;
        $itemCount = 0;

        foreach ($cartItems as $item) {
            $product = $item->product;
            if (! $product) {
                continue;
            }

            $unitPrice = (float) ($item->price ?? $product->price ?? 0);
            $quantity = (int) $item->quantity;

            $contentIds[] = self::productId($product);
            $contents[] = (new Content())
                ->setProductId(self::productId($product))
                ->setTitle($product->title)
                ->setCategory(self::productCategory($product))
                ->setQuantity($quantity)
                ->setItemPrice($unitPrice);

            $total += $unitPrice * $quantity;
            $itemCount += $quantity;
        }

        if ($itemCount === 0) {
            return;
        }

        $customData = (new CustomData())
            ->setContentIds($contentIds)
            ->setContents($contents)
            ->setContentType('product')
            ->setContentCategory('product')
            ->setValue($total)
            ->setCurrency('BDT')
            ->setNumItems($itemCount);

        $event = self::buildEvent('InitiateCheckout', $customData, $request, uniqid('checkout_', true));

        self::sendEvent($event, $settings);
    }

    public static function trackPurchase(Order $order, Request $request): void
    {
        $settings = self::getSettings();
        if (! $settings['server_enabled']) {
            return;
        }

        $order->loadMissing('orderItems.product.category');

        $contents = [];
        $contentIds = [];
        $itemCount = 0;

        foreach ($order->orderItems as $item) {
            $product = $item->product;
            if (! $product) {
                continue;
            }

            $contentIds[] = self::productId($product);
            $contents[] = (new Content())
                ->setProductId(self::productId($product))
                ->setTitle($product->title)
                ->setCategory(self::productCategory($product))
                ->setQuantity((int) $item->quantity)
                ->setItemPrice((float) $item->unit_price);

            $itemCount += (int) $item->quantity;
        }

        if ($itemCount === 0) {
            return;
        }

        $customData = (new CustomData())
            ->setContentIds($contentIds)
            ->setContents($contents)
            ->setContentType('product')
            ->setContentCategory('product')
            ->setValue((float) $order->total_amount)
            ->setCurrency('BDT')
            ->setNumItems($itemCount)
            ->setOrderId((string) $order->id);

        $event = self::buildEvent('Purchase', $customData, $request, 'order_'.$order->id);

        self::sendEvent($event, $settings);
    }

    private static function productId(Product $product): string
    {
        return (string) $product->id;
    }

    private static function productCategory(Product $product): string
    {
        return $product->category->name ?? 'product';
    }

    private static function getSettings(): array
    {
        $settings = Option::getValue('marketing_meta_settings', []);

        return [
            'pixel_id' => $settings['dataset_id'] ?? null,
            'access_token' => $settings['access_token'] ?? null,
            'test_event_code' => $settings['test_event_code'] ?? null,
            'server_enabled' => (bool) ($settings['server_tracking_enabled'] ?? false),
        ];
    }

    private static function buildEvent(string $name, CustomData $customData, Request $request, string $eventId): Event
    {
        $userData = (new UserData())
            ->setClientIpAddress($request->ip())
            ->setClientUserAgent($request->userAgent())
            ->setFbp($request->cookie('_fbp'))
            ->setFbc($request->cookie('_fbc'));

        if ($request->user()?->email) {
            $userData->setEmail(hash('sha256', strtolower(trim($request->user()->email))));
        }

        return (new Event())
            ->setEventName($name)
            ->setEventTime(time())
            ->setEventSourceUrl($request->fullUrl())
            ->setActionSource('website')
            ->setUserData($userData)
            ->setCustomData($customData)
            ->setEventId($eventId);
    }

    private static function sendEvent(Event $event, array $settings): void
    {
        if (empty($settings['pixel_id']) || empty($settings['access_token'])) {
            return;
        }

        try {
            Api::init(null, null, $settings['access_token']);

            $request = (new EventRequest($settings['pixel_id']))
                ->setEvents([$event]);

            if (! app()->environment('production') && ! empty($settings['test_event_code'])) {
                $request->setTestEventCode($settings['test_event_code']);
            }

            $response = $request->execute();

            Log::info('Meta Conversion API event sent', [
                'event' => $event->getEventName(),
                'event_id' => $event->getEventId(),
                'response' => $response ? json_encode($response->getResponse()) : 'No response',
            ]);
        } catch (\Throwable $throwable) {
            Log::error('Meta Conversion API event failed', [
                'event' => $event->getEventName(),
                'event_id' => $event->getEventId(),
                'error' => $throwable->getMessage(),
            ]);
        }
    }
}
