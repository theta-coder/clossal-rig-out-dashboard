<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductReturn;
use App\Models\RefundBankDetail;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductReturnController extends Controller
{
    /**
     * List user's return requests
     */
    public function index(Request $request)
    {
        $returns = $request->user()->returns()->with('items.orderItem.product')->latest()->get();
        return response()->json([
            'success' => true,
            'data' => $returns
        ]);
    }

    /**
     * Store a new return request
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'reason' => 'required|string|max:1000',
            'items' => 'required|array|min:1',
            'items.*.order_item_id' => 'required|exists:order_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.reason' => 'nullable|string',
        ]);

        $order = Order::where('id', $validated['order_id'])
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        // Check if order is eligible for return (e.g., delivered and within 7 days)
        if ($order->status !== 'delivered') {
            return response()->json([
                'success' => false,
                'message' => 'Only delivered orders can be returned.'
            ], 422);
        }

        try {
            return DB::transaction(function () use ($validated, $order) {
                $productReturn = ProductReturn::create([
                    'user_id' => $order->user_id,
                    'order_id' => $order->id,
                    'return_number' => 'RET-' . strtoupper(uniqid()),
                    'status' => 'pending',
                    'reason' => $validated['reason'],
                ]);

                foreach ($validated['items'] as $item) {
                    $productReturn->items()->create([
                        'order_item_id' => $item['order_item_id'],
                        'quantity' => $item['quantity'],
                        'reason' => $item['reason'] ?? $validated['reason'],
                        'status' => 'pending'
                    ]);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Return request submitted successfully.',
                    'data' => $productReturn->load('items')
                ], 201);
            });
        }
        catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit return: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get return details
     */
    public function show(Request $request, $id)
    {
        $return = $request->user()->returns()->with(['items.orderItem.product', 'order'])->findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $return
        ]);
    }

    /**
     * Store bank details for refund
     */
    public function storeBankDetails(Request $request)
    {
        $validated = $request->validate([
            'return_id' => 'required|exists:product_returns,id',
            'bank_name' => 'required|string|max:255',
            'account_holder_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:255',
            'iban' => 'nullable|string|max:255',
            'branch_code' => 'nullable|string|max:255',
        ]);

        $productReturn = ProductReturn::where('id', $validated['return_id'])
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $bankDetail = RefundBankDetail::updateOrCreate(
        ['return_id' => $productReturn->id],
            $validated
        );

        return response()->json([
            'success' => true,
            'message' => 'Bank details saved successfully.',
            'data' => $bankDetail
        ]);
    }
}
