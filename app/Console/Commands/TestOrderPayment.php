<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Order;
use App\Services\OrderService;

class TestOrderPayment extends Command
{
    protected $signature = 'order:test-payment {order_id}';
    protected $description = 'Test payment processing for an order';

    public function handle()
    {
        $orderId = $this->argument('order_id');
        $order = Order::with(['orderItems.product', 'user'])->find($orderId);

        if (!$order) {
            $this->error("Order with ID {$orderId} not found.");
            return;
        }

        $this->info("Processing payment for Order #{$order->order_number}");
        $this->info("Status: {$order->status}, Payment: {$order->payment_status}");

        if ($order->status === 'completed') {
            $this->info("Order is already completed.");

            // Show assigned codes
            foreach ($order->orderItems as $item) {
                $this->info("Product: {$item->product->title}");
                if ($item->assigned_codes) {
                    $codes = \App\Models\Code::whereIn('id', $item->assigned_codes)->pluck('code')->toArray();
                    $this->info("Assigned codes: " . implode(', ', $codes));
                } else {
                    $this->error("No codes assigned to this item");
                }
            }
            return;
        }

        $orderService = new OrderService();

        try {
            $success = $orderService->processPayment($order, 'test', [
                'payment_reference' => 'TEST-' . time(),
                'payment_details' => ['test' => true, 'simulated' => true]
            ]);

            if ($success) {
                $this->info("Payment processed successfully!");
                $this->info("Order status updated to: completed");

                // Reload order to get updated data
                $order->refresh();

                // Show assigned codes
                foreach ($order->orderItems as $item) {
                    $this->info("Product: {$item->product->title}");
                    if ($item->assigned_codes) {
                        $codes = \App\Models\Code::whereIn('id', $item->assigned_codes)->pluck('code')->toArray();
                        $this->info("Assigned codes: " . implode(', ', $codes));
                    } else {
                        $this->error("No codes assigned to this item");
                    }
                }
            } else {
                $this->error("Payment processing failed");
            }

        } catch (\Exception $e) {
            $this->error("Error: " . $e->getMessage());
        }
    }
}
