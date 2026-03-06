<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function validate(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'subtotal' => 'required|numeric|min:0',
        ]);

        $coupon = Coupon::where('code', strtoupper($request->code))
            ->where('is_active', true)
            ->first();

        if (!$coupon) {
            return response()->json(['success' => false, 'message' => 'Invalid coupon code.'], 404);
        }

        if ($coupon->expires_at && $coupon->expires_at->isPast()) {
            return response()->json(['success' => false, 'message' => 'This coupon has expired.'], 422);
        }

        if ($coupon->max_uses && $coupon->used_count >= $coupon->max_uses) {
            return response()->json(['success' => false, 'message' => 'This coupon has reached its usage limit.'], 422);
        }

        if ($coupon->min_order_amount && $request->subtotal < $coupon->min_order_amount) {
            return response()->json([
                'success' => false,
                'message' => 'Minimum order of PKR ' . number_format($coupon->min_order_amount, 0) . ' required for this coupon.',
            ], 422);
        }

        $discount = $coupon->discount_type === 'percentage'
            ? round(($request->subtotal * $coupon->discount_value) / 100, 2)
            : min($coupon->discount_value, $request->subtotal);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $coupon->id,
                'code' => $coupon->code,
                'discount_type' => $coupon->discount_type,
                'discount_value' => $coupon->discount_value,
                'discount_amount' => $discount,
            ],
        ]);
    }
}



