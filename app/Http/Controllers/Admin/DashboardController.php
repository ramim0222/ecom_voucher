<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Code;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => $this->getDashboardStats(),
            'salesData' => $this->getSalesChartData(),
            'orderStatusBreakdown' => $this->getOrderStatusBreakdown(),
            'recentOrders' => $this->getRecentOrders(),
            'topProducts' => $this->getTopProducts(),
            'lowStockProducts' => $this->getLowStockProducts(),
        ]);
    }

    private function getDashboardStats(): array
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth()->startOfMonth();
        $lastMonthEnd = Carbon::now()->subMonth()->endOfMonth();

        $totalOrders = Order::count();
        $totalRevenue = Order::where('payment_status', 'paid')->sum('total_amount');

        $todayOrders = Order::whereDate('created_at', $today)->count();
        $todayRevenue = Order::where('payment_status', 'paid')
            ->whereDate('created_at', $today)
            ->sum('total_amount');

        $monthOrders = Order::where('created_at', '>=', $thisMonth)->count();
        $monthRevenue = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', $thisMonth)
            ->sum('total_amount');

        $lastMonthRevenue = Order::where('payment_status', 'paid')
            ->whereBetween('created_at', [$lastMonth, $lastMonthEnd])
            ->sum('total_amount');

        $lastMonthOrders = Order::whereBetween('created_at', [$lastMonth, $lastMonthEnd])->count();

        $monthGrowth = $lastMonthRevenue > 0
            ? (($monthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100
            : ($monthRevenue > 0 ? 100 : 0);

        $monthOrdersGrowth = $lastMonthOrders > 0
            ? (($monthOrders - $lastMonthOrders) / $lastMonthOrders) * 100
            : ($monthOrders > 0 ? 100 : 0);

        $newCustomersThisMonth = User::where('role', 'customer')
            ->where('created_at', '>=', $thisMonth)
            ->count();

        return [
            'totalOrders' => $totalOrders,
            'totalRevenue' => round($totalRevenue, 2),
            'todayOrders' => $todayOrders,
            'todayRevenue' => round($todayRevenue, 2),
            'monthOrders' => $monthOrders,
            'monthRevenue' => round($monthRevenue, 2),
            'monthGrowth' => round($monthGrowth, 1),
            'monthOrdersGrowth' => round($monthOrdersGrowth, 1),
            'totalCustomers' => User::where('role', 'customer')->count(),
            'newCustomersThisMonth' => $newCustomersThisMonth,
            'totalProducts' => Product::count(),
            'activeProducts' => Product::where('status', 'active')->count(),
            'totalReviews' => Review::where('status', 'approved')->count(),
            'pendingReviews' => Review::where('status', 'pending')->count(),
            'pendingOrders' => Order::where('status', 'pending')->count(),
            'processingOrders' => Order::where('status', 'processing')->count(),
            'availableCodes' => Code::where('status', 'available')->count(),
        ];
    }

    private function getSalesChartData(): array
    {
        $days = collect();
        $sales = collect();
        $orders = collect();

        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $days->push($date->format('M d'));

            $dailyRevenue = Order::where('payment_status', 'paid')
                ->whereDate('created_at', $date)
                ->sum('total_amount');

            $dailyOrders = Order::whereDate('created_at', $date)->count();

            $sales->push(round($dailyRevenue, 2));
            $orders->push($dailyOrders);
        }

        return [
            'labels' => $days->toArray(),
            'revenue' => $sales->toArray(),
            'orders' => $orders->toArray(),
        ];
    }

    private function getOrderStatusBreakdown(): array
    {
        $statuses = ['pending', 'processing', 'completed', 'cancelled', 'refunded'];

        $counts = Order::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        return collect($statuses)->map(function ($status) use ($counts) {
            return [
                'status' => $status,
                'count' => (int) ($counts[$status] ?? 0),
            ];
        })->values()->all();
    }

    private function getRecentOrders()
    {
        return Order::with(['user:id,first_name,last_name,email'])
            ->orderByDesc('created_at')
            ->take(8)
            ->get(['id', 'order_number', 'user_id', 'total_amount', 'status', 'payment_status', 'created_at', 'billing_address'])
            ->map(function ($order) {
                $billingAddress = is_array($order->billing_address) ? $order->billing_address : [];
                $customerName = $order->user
                    ? trim($order->user->first_name . ' ' . $order->user->last_name)
                    : trim(($billingAddress['first_name'] ?? '') . ' ' . ($billingAddress['last_name'] ?? ''));
                $customerEmail = $order->user?->email ?? ($billingAddress['email'] ?? '');

                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $customerName !== '' ? $customerName : 'Guest Customer',
                    'customer_email' => $customerEmail !== '' ? $customerEmail : 'N/A',
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'created_at' => $order->created_at->format('M d, Y H:i'),
                ];
            });
    }

    private function getTopProducts()
    {
        return Product::with(['category:id,name'])
            ->withCount(['orderItems as total_orders' => function ($query) {
                $query->whereHas('order', function ($orderQuery) {
                    $orderQuery->where('payment_status', 'paid');
                });
            }])
            ->withSum(['orderItems as total_revenue' => function ($query) {
                $query->whereHas('order', function ($orderQuery) {
                    $orderQuery->where('payment_status', 'paid');
                });
            }], 'total_price')
            ->orderByDesc('total_revenue')
            ->take(5)
            ->get(['id', 'title', 'product_image', 'category_id', 'price'])
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'title' => $product->title,
                    'image' => $product->product_image ? "/storage/{$product->product_image}" : "/placeholder.svg",
                    'category' => $product->category->name ?? 'Uncategorized',
                    'price' => $product->price,
                    'total_orders' => $product->total_orders ?? 0,
                    'total_revenue' => round($product->total_revenue ?? 0, 2),
                ];
            });
    }

    private function getLowStockProducts()
    {
        return Product::with(['category:id,name'])
            ->withCount(['codes as available_codes' => function ($query) {
                $query->where('status', 'available');
            }])
            ->having('available_codes', '<=', 5)
            ->orderBy('available_codes')
            ->take(5)
            ->get(['id', 'title', 'product_image', 'category_id', 'status'])
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'title' => $product->title,
                    'image' => $product->product_image ? "/storage/{$product->product_image}" : "/placeholder.svg",
                    'category' => $product->category->name ?? 'Uncategorized',
                    'available_codes' => $product->available_codes ?? 0,
                    'status' => $product->status,
                ];
            });
    }
}
