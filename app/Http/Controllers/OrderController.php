<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Code;
use App\Services\MetaConversionApiService;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

        /**
     * Display a listing of user's orders
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        $orders = Order::where('user_id', $user->id)
            ->with(['orderItems.product.category'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Add assigned codes as actual code values for completed orders
        $orders->getCollection()->transform(function ($order) {
            $order->orderItems->transform(function ($item) {
                if ($item->assigned_codes && count($item->assigned_codes) > 0) {
                    $item->actual_codes = Code::whereIn('id', $item->assigned_codes)
                        ->pluck('code')
                        ->toArray();
                } else {
                    $item->actual_codes = [];
                }
                return $item;
            });
            return $order;
        });

                // This method is only used for dashboard orders now
        return Inertia::render('Dashboard/Orders', [
            'orders' => $orders,
        ]);
    }

    /**
     * Show the order details
     */
    public function show(Order $order)
    {
        // Check if user owns the order or is admin
        if ($order->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403, 'Unauthorized access to order.');
        }

        // Load relationships and add actual codes
        $order->load(['orderItems.product', 'user']);

        // Add assigned codes as actual code values
        $order->orderItems->transform(function ($item) {
            if ($item->assigned_codes && count($item->assigned_codes) > 0) {
                $item->actual_codes = Code::whereIn('id', $item->assigned_codes)
                    ->pluck('code')
                    ->toArray();
            } else {
                $item->actual_codes = [];
            }
            return $item;
        });

        return Inertia::render('Orders/Show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'subtotal' => $order->subtotal,
                'discount_amount' => $order->discount_amount,
                'tax_amount' => $order->tax_amount,
                'total_amount' => $order->total_amount,
                'created_at' => $order->created_at,
                'payment_completed_at' => $order->payment_completed_at,
                'customer' => [
                    'name' => $order->user->full_name,
                    'email' => $order->user->email,
                ],
                'items' => $order->orderItems->map(function ($item) {
                    return [
                        'product_id' => $item->product_id,
                        'product_title' => $item->product->title,
                        'quantity' => $item->quantity,
                        'unit_price' => $item->unit_price,
                        'total_price' => $item->total_price,
                        'assigned_codes' => $item->actual_codes,
                    ];
                }),
            ],
        ]);
    }

    /**
     * Create order from cart
     */
    public function createFromCart(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'payment_method' => 'required|string',
            'billing_address' => 'required|array',
            'billing_address.first_name' => 'required|string|max:255',
            'billing_address.last_name' => 'required|string|max:255',
            'billing_address.email' => 'required|email',
            'billing_address.phone' => 'required|string',
            'billing_address.address' => 'required|string',
            'billing_address.city' => 'required|string',
            'billing_address.state' => 'required|string',
            'billing_address.zip' => 'required|string',
            'billing_address.country' => 'required|string',
            'discount_amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            $user = Auth::user();
            $orderData = $request->only([
                'payment_method',
                'billing_address',
                'discount_amount',
                'notes'
            ]);

            $order = $this->orderService->createOrderFromCart($user, $orderData);

            MetaConversionApiService::trackPurchase($order, $request);

            return redirect()->route('orders.show', $order->id)
                ->with('success', 'Order created successfully!');

        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Create order from products directly
     */
    public function createFromProducts(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|integer|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|string',
            'billing_address' => 'required|array',
            'discount_amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $user = Auth::user();
            $products = $request->input('products');
            $orderData = $request->only([
                'payment_method',
                'billing_address',
                'discount_amount',
                'notes'
            ]);

            $order = $this->orderService->createOrderFromProducts($user, $products, $orderData);

            MetaConversionApiService::trackPurchase($order, $request);

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully!',
                'order' => $this->orderService->getOrderSummary($order),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Process payment for order
     */
    public function processPayment(Request $request, Order $order)
    {
        // Check if user owns the order
        if ($order->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to order.');
        }

        $validator = Validator::make($request->all(), [
            'payment_method' => 'required|string',
            'payment_reference' => 'nullable|string',
            'payment_details' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $success = $this->orderService->processPayment(
                $order,
                $request->input('payment_method'),
                $request->only(['payment_reference', 'payment_details'])
            );

            if ($success) {
                MetaConversionApiService::trackPurchase($order->fresh(), $request);

                return response()->json([
                    'success' => true,
                    'message' => 'Payment processed successfully!',
                    'order' => $this->orderService->getOrderSummary($order),
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment processing failed.',
                ], 400);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Simulate payment completion for testing (remove in production)
     */
    public function simulatePayment(Request $request, Order $order)
    {
        // Check if user owns the order
        if ($order->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to order.');
        }

        try {
            $success = $this->orderService->processPayment(
                $order,
                $order->payment_method ?? 'test',
                [
                    'payment_reference' => 'TEST-' . time(),
                    'payment_details' => ['test' => true, 'simulated' => true]
                ]
            );

            if ($success) {
                return redirect()->route('orders.show', $order->id)
                    ->with('success', 'Payment simulated successfully! Order completed and codes assigned.');
            } else {
                return back()->with('error', 'Payment simulation failed.');
            }

        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Cancel order
     */
    public function cancel(Request $request, Order $order)
    {
        // Check if user owns the order or is admin
        if ($order->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403, 'Unauthorized access to order.');
        }

        $validator = Validator::make($request->all(), [
            'reason' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        try {
            $success = $this->orderService->cancelOrder(
                $order,
                $request->input('reason')
            );

            if ($success) {
                return back()->with('success', 'Order cancelled successfully!');
            } else {
                return back()->with('error', 'Failed to cancel order.');
            }

        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Check product availability
     */
    public function checkAvailability(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|integer|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $products = $request->input('products');
            $availability = $this->orderService->checkProductAvailability($products);

            return response()->json([
                'success' => true,
                'availability' => $availability,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Admin: View all orders
     */
    public function adminIndex(Request $request)
    {
        if (!Auth::user()->isAdmin()) {
            abort(403, 'Admin access required.');
        }

        $query = Order::with(['user', 'orderItems.product']);

        // Filter by status
        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        // Filter by payment status
        if ($request->has('payment_status') && $request->payment_status !== '') {
            $query->where('payment_status', $request->payment_status);
        }

        // Search by order number or customer email
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('email', 'like', "%{$search}%")
                                ->orWhere('first_name', 'like', "%{$search}%")
                                ->orWhere('last_name', 'like', "%{$search}%");
                  });
            });
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'payment_status', 'search']),
        ]);
    }

    /**
     * Admin: Show specific order details
     */
    public function adminShow(Order $order)
    {
        if (!Auth::user()->isAdmin()) {
            abort(403, 'Admin access required.');
        }

        // Load relationships and add actual codes
        $order->load(['orderItems.product.category', 'user']);

        // Add assigned codes as actual code values
        $order->orderItems->transform(function ($item) {
            if ($item->assigned_codes && count($item->assigned_codes) > 0) {
                $item->actual_codes = Code::whereIn('id', $item->assigned_codes)
                    ->pluck('code')
                    ->toArray();
            } else {
                $item->actual_codes = [];
            }
            return $item;
        });

        return Inertia::render('Admin/Orders/Page', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'payment_method' => $order->payment_method,
                'payment_reference' => $order->payment_reference,
                'subtotal' => $order->subtotal,
                'discount_amount' => $order->discount_amount,
                'tax_amount' => $order->tax_amount,
                'total_amount' => $order->total_amount,
                'created_at' => $order->created_at,
                'payment_completed_at' => $order->payment_completed_at,
                'billing_address' => $order->billing_address,
                'notes' => $order->notes,
                'customer' => [
                    'id' => $order->user->id,
                    'name' => $order->user->full_name,
                    'email' => $order->user->email,
                    'phone' => $order->user->phone_number,
                    'first_name' => $order->user->first_name,
                    'last_name' => $order->user->last_name,
                ],
                'items' => $order->orderItems->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_id' => $item->product_id,
                        'product_title' => $item->product->title,
                        'product_image' => $item->product->product_image,
                        'sku' => 'SKU-' . $item->product_id,
                        'quantity' => $item->quantity,
                        'unit_price' => $item->unit_price,
                        'total_price' => $item->total_price,
                        'assigned_codes' => $item->actual_codes,
                        'category' => $item->product->category->name ?? 'Uncategorized',
                    ];
                }),
            ],
        ]);
    }

    /**
     * Admin: Update order status
     */
    public function updateStatus(Request $request, Order $order)
    {
        if (!Auth::user()->isAdmin()) {
            abort(403, 'Admin access required.');
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:pending,processing,completed,cancelled,refunded',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        try {
            $newStatus = $request->input('status');

            // Handle special status changes
            if ($newStatus === 'completed' && $order->status !== 'completed') {
                // If marking as completed, ensure payment is also completed
                if ($order->payment_status !== 'paid') {
                    return back()->with('error', 'Cannot mark order as completed unless payment is completed.');
                }
                $order->markAsCompleted();
            } elseif ($newStatus === 'cancelled') {
                // Use the existing cancel method logic
                $success = $this->orderService->cancelOrder($order);
                if (!$success) {
                    return back()->with('error', 'Failed to cancel order.');
                }
            } else {
                // Regular status update
                $order->update(['status' => $newStatus]);
            }

            return back()->with('success', 'Order status updated successfully.');

        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Admin: Update payment status
     */
    public function updatePaymentStatus(Request $request, Order $order)
    {
        if (!Auth::user()->isAdmin()) {
            abort(403, 'Admin access required.');
        }

        $validator = Validator::make($request->all(), [
            'payment_status' => 'required|string|in:pending,paid,failed,refunded',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        try {
            $newPaymentStatus = $request->input('payment_status');

            $updateData = ['payment_status' => $newPaymentStatus];

            if ($newPaymentStatus === 'paid') {
                // Mark as paid and auto-process
                $order->markAsPaid(null, [
                    'admin_updated' => true,
                    'updated_by' => Auth::user()->full_name,
                    'updated_at' => now()->toISOString(),
                ]);

                // Auto-assign codes if payment is completed
                if ($order->status === 'processing') {
                    $this->orderService->assignCodesToOrder($order);
                }
            } elseif ($newPaymentStatus === 'refunded') {
                $updateData['payment_completed_at'] = null;
                $updateData['status'] = 'refunded';
                $order->update($updateData);
            } else {
                // Failed or pending
                $updateData['payment_completed_at'] = null;
                $order->update($updateData);
            }

            return back()->with('success', 'Payment status updated successfully.');

        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
