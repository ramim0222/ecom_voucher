<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Code;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        try {
            // Get user's orders with items and products
            $recentOrders = $user->orders()
                ->with(['orderItems.product.category'])
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($order) {
                    return [
                        'id' => $order->id, // Use actual order ID for routing
                        'order_number' => $order->order_number, // Keep order number for display
                        'date' => $order->created_at ? $order->created_at->format('Y-m-d') : 'Unknown',
                        'status' => $order->status ?? 'pending',
                        'total' => (float) ($order->total_amount ?? 0),
                        'items' => $order->orderItems->map(function ($item) {
                            // Get assigned codes if they exist
                            $codes = [];
                            if ($item->assigned_codes && is_array($item->assigned_codes)) {
                                try {
                                    $codes = Code::whereIn('id', $item->assigned_codes)
                                        ->pluck('code')
                                        ->toArray();
                                } catch (\Exception $e) {
                                    $codes = [];
                                }
                            }

                            return [
                                'title' => $item->product->title ?? 'Unknown Product',
                                'platform' => $item->product->category->name ?? 'Gaming',
                                'price' => (float) ($item->unit_price ?? 0),
                                'quantity' => (int) ($item->quantity ?? 1),
                                'codes' => $codes,
                            ];
                        })->toArray(),
                    ];
                });

            // Calculate comprehensive stats
            $totalOrders = $user->orders()->count();
            $totalSpent = $user->orders()
                ->where('status', '!=', 'cancelled')
                ->sum('total_amount');

            $pendingOrders = $user->orders()->where('status', 'pending')->count();
            $completedOrders = $user->orders()->where('status', 'completed')->count();

            $stats = [
                ['label' => 'Total Orders', 'value' => (string) $totalOrders, 'icon' => '📦'],
                ['label' => 'Total Spent', 'value' => '$' . number_format($totalSpent, 2), 'icon' => '💰'],
                ['label' => 'Pending Orders', 'value' => (string) $pendingOrders, 'icon' => '⏳'],
                ['label' => 'Completed Orders', 'value' => (string) $completedOrders, 'icon' => '✅'],
            ];

            return Inertia::render('Dashboard/Dashboard', [
                'user' => [
                    'name' => $user->full_name ?? 'Gamer',
                    'email' => $user->email ?? '',
                ],
                'recentOrders' => $recentOrders,
                'stats' => $stats,
            ]);

        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Dashboard error: ' . $e->getMessage());

            // Return a safe fallback
            return Inertia::render('Dashboard/Dashboard', [
                'user' => [
                    'name' => $user->full_name ?? 'Gamer',
                    'email' => $user->email ?? '',
                ],
                'recentOrders' => [],
                'stats' => [
                    ['label' => 'Total Orders', 'value' => '0', 'icon' => '📦'],
                    ['label' => 'Total Spent', 'value' => '$0.00', 'icon' => '💰'],
                    ['label' => 'Pending Orders', 'value' => '0', 'icon' => '⏳'],
                    ['label' => 'Completed Orders', 'value' => '0', 'icon' => '✅'],
                ],
            ]);
        }
    }
}
