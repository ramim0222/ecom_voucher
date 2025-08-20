<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Review;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
        public function index()
    {
        // Get dashboard statistics
        $stats = $this->getDashboardStats();

        // Get sales chart data
        $salesData = $this->getSalesChartData();

        // Get recent orders
        $recentOrders = $this->getRecentOrders();

        // Get top products
        $topProducts = $this->getTopProducts();

        // Debug logging
        \Log::info('Dashboard data:', [
            'stats' => $stats,
            'salesData' => $salesData,
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
        ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'salesData' => $salesData,
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
        ]);
    }

    /**
     * Get dashboard statistics
     */
    private function getDashboardStats()
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth()->startOfMonth();

        // Total orders and revenue
        $totalOrders = Order::count();
        $totalRevenue = Order::where('payment_status', 'paid')->sum('total_amount');

        // Today's orders and revenue
        $todayOrders = Order::whereDate('created_at', $today)->count();
        $todayRevenue = Order::where('payment_status', 'paid')
            ->whereDate('created_at', $today)
            ->sum('total_amount');

        // This month's orders and revenue
        $monthOrders = Order::where('created_at', '>=', $thisMonth)->count();
        $monthRevenue = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', $thisMonth)
            ->sum('total_amount');

        // Last month's revenue for comparison
        $lastMonthRevenue = Order::where('payment_status', 'paid')
            ->whereBetween('created_at', [$lastMonth, $thisMonth])
            ->sum('total_amount');

        // Calculate month-over-month growth
        $monthGrowth = $lastMonthRevenue > 0
            ? (($monthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100
            : 0;

        // Customer and product counts
        $totalCustomers = User::where('role', 'customer')->count();
        $totalProducts = Product::count();
        $totalReviews = Review::where('status', 'approved')->count();

        return [
            'totalOrders' => $totalOrders,
            'totalRevenue' => round($totalRevenue, 2),
            'todayOrders' => $todayOrders,
            'todayRevenue' => round($todayRevenue, 2),
            'monthOrders' => $monthOrders,
            'monthRevenue' => round($monthRevenue, 2),
            'monthGrowth' => round($monthGrowth, 1),
            'totalCustomers' => $totalCustomers,
            'totalProducts' => $totalProducts,
            'totalReviews' => $totalReviews,
        ];
    }

        /**
     * Get sales chart data for the last 30 days
     */
    private function getSalesChartData()
    {
        $days = collect();
        $sales = collect();

        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $days->push($date->format('M d'));

            $dailyRevenue = Order::where('payment_status', 'paid')
                ->whereDate('created_at', $date)
                ->sum('total_amount');

            $sales->push(round($dailyRevenue, 2));
        }

        $result = [
            'labels' => $days->toArray(),
            'data' => $sales->toArray(),
        ];

        // Debug logging
        \Log::info('Sales chart data generated:', [
            'totalDays' => count($result['labels']),
            'totalSales' => count($result['data']),
            'sampleLabels' => array_slice($result['labels'], 0, 5),
            'sampleData' => array_slice($result['data'], 0, 5),
            'maxValue' => max($result['data']),
            'minValue' => min($result['data']),
        ]);

        return $result;
    }

    /**
     * Get recent orders
     */
    private function getRecentOrders()
    {
        return Order::with(['user:id,first_name,last_name,email'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get(['id', 'order_number', 'user_id', 'total_amount', 'status', 'payment_status', 'created_at'])
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->user->first_name . ' ' . $order->user->last_name,
                    'customer_email' => $order->user->email,
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'created_at' => $order->created_at->format('M d, Y H:i'),
                ];
            });
    }

    /**
     * Get top performing products
     */
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
            ->orderBy('total_revenue', 'desc')
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
}
