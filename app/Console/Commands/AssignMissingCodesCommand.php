<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Code;
use Illuminate\Support\Facades\DB;

class AssignMissingCodesCommand extends Command
{
    protected $signature = 'orders:assign-missing-codes {--dry-run : Only show what would be assigned without making changes}';
    protected $description = 'Assign codes to completed orders that are missing them';

    public function handle()
    {
        $dryRun = $this->option('dry-run');

        if ($dryRun) {
            $this->info('DRY RUN MODE - No changes will be made');
        }

        $this->info('Finding completed orders with missing codes...');

        $completedOrders = Order::where('status', 'completed')
            ->with(['orderItems.product'])
            ->get();

        $itemsToFix = collect();

        foreach ($completedOrders as $order) {
            foreach ($order->orderItems as $item) {
                if (is_null($item->assigned_codes) || empty($item->assigned_codes)) {
                    // Check if codes are available for this product
                    $availableCodes = $item->product->codes()
                        ->where('status', 'available')
                        ->limit($item->quantity)
                        ->get();

                    if ($availableCodes->count() >= $item->quantity) {
                        $itemsToFix->push([
                            'order_item' => $item,
                            'available_codes' => $availableCodes,
                        ]);

                        $this->info("Order #{$order->order_number}: {$item->product->title} x{$item->quantity} - {$availableCodes->count()} codes available");
                    } else {
                        $this->warn("Order #{$order->order_number}: {$item->product->title} x{$item->quantity} - Only {$availableCodes->count()} codes available (need {$item->quantity})");
                    }
                }
            }
        }

        if ($itemsToFix->isEmpty()) {
            $this->info('No items need code assignment.');
            return 0;
        }

        $this->info("\nFound {$itemsToFix->count()} items that can have codes assigned.");

        if ($dryRun) {
            $this->info('Run without --dry-run to make the actual assignments.');
            return 0;
        }

        if (!$this->confirm('Do you want to assign codes to these items?', true)) {
            $this->info('Cancelled.');
            return 0;
        }

        $assigned = 0;

        DB::transaction(function () use ($itemsToFix, &$assigned) {
            foreach ($itemsToFix as $itemData) {
                $item = $itemData['order_item'];
                $codes = $itemData['available_codes'];

                $codeIds = [];
                foreach ($codes as $code) {
                    $code->update(['status' => 'sold']);
                    $codeIds[] = $code->id;
                }

                $item->update(['assigned_codes' => $codeIds]);

                // Update product sold_codes count
                $item->product->increment('sold_codes', $item->quantity);

                $this->info("✓ Assigned {$codes->count()} codes to {$item->product->title} in order #{$item->order->order_number}");
                $assigned++;
            }
        });

        $this->info("\nSuccessfully assigned codes to {$assigned} items!");

        return 0;
    }
}
