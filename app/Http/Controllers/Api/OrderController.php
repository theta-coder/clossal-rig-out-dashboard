<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    /**
     * Get user orders
     */
    public function index(Request $request)
    {
        $orders = $request->user()->orders()
            ->with(['items.product', 'statusHistories'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    /**
     * Store a new order
     */
    public function store(Request $request)
    {
        $rules = [
            'subtotal' => 'required|numeric',
            'shipping_cost' => 'required|numeric',
            'discount_amount' => 'nullable|numeric|min:0',
            'coupon_id' => 'nullable|exists:coupons,id',
            'total' => 'required|numeric',
            'payment_method' => 'required|string',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
            'items.*.size' => 'nullable|string',
            'items.*.color' => 'nullable|string',
            'items.*.variant_id' => 'nullable|exists:product_variants,id',
        ];

        if ($request->has('address_id') && !empty($request->address_id)) {
            $rules['address_id'] = 'required|exists:addresses,id';
        }
        else {
            $rules['address'] = 'required|array';
            $rules['address.name'] = 'required|string';
            $rules['address.email'] = 'nullable|email';
            $rules['address.street'] = 'required|string';
            $rules['address.city'] = 'required|string';
            $rules['address.zip'] = 'required|string';
            $rules['address.phone'] = 'required|string';
            $rules['address.type'] = 'nullable|string';
        }

        $validated = $request->validate($rules);

        $user = Auth::guard('sanctum')->user();
        $validated['user_id'] = $user ? $user->id : null;

        // Create address if not provided
        if (!$request->has('address_id') || empty($request->address_id)) {
            $address = \App\Models\UserManagement\Address::create([
                'user_id' => $validated['user_id'],
                'email' => $validated['address']['email'] ?? ($user ? $user->email : null),
                'type' => $validated['address']['type'] ?? 'shipping',
                'name' => $validated['address']['name'],
                'street' => $validated['address']['street'],
                'city' => $validated['address']['city'],
                'zip' => $validated['address']['zip'],
                'phone' => $validated['address']['phone'],
            ]);
            $validated['address_id'] = $address->id;
        }

        try {
            $order = $this->orderService->createOrder($validated);

            if (!empty($validated['coupon_id'])) {
                Coupon::where('id', $validated['coupon_id'])->increment('used_count');
            }

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully',
                'data' => $order->load('items')
            ], 201);
        }
        catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to place order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get order details
     */
    public function show(Request $request, $id)
    {
        $order = $request->user()->orders()
            ->with(['items.product', 'address', 'statusHistories'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }

    /**
     * Track order without login
     */
    public function track(Request $request)
    {
        $request->validate([
            'order_number' => 'required|string',
            'email' => 'required|email',
        ]);

        $orderNumber = ltrim($request->order_number, '#');

        $order = Order::where('order_number', $orderNumber)
            ->with(['items.product', 'address', 'statusHistories'])
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found.'
            ], 404);
        }

        // Verify email (either from user or guest address)
        $orderEmail = $order->user ? $order->user->email : ($order->address ? $order->address->email : null);

        if (strtolower($orderEmail) !== strtolower($request->email)) {
            return response()->json([
                'success' => false,
                'message' => 'Order found, but email does not match our records.'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }
}
