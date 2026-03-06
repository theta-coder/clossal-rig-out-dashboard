<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QuantityDiscount;

class QuantityDiscountController extends Controller
{
    /**
     * GET /api/products/{id}/discounts
     * Returns active quantity discount tiers for a product (or its category)
     */
    public function forProduct($productId)
    {
        $now = now();

        $discounts = QuantityDiscount::where('is_active', true)
            ->where(function ($q) use ($now) {
                $q->whereNull('starts_at')->orWhere('starts_at', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('ends_at')->orWhere('ends_at', '>=', $now);
            })
            ->where(function ($q) use ($productId) {
                $q->where('product_id', $productId)->orWhereNull('product_id');
            })
            ->orderBy('min_quantity')
            ->get()
            ->map(fn($d) => [
                'id'             => $d->id,
                'min_quantity'   => $d->min_quantity,
                'discount_type'  => $d->discount_type,   // 'percentage' | 'fixed'
                'discount_value' => (float) $d->discount_value,
            ]);

        return response()->json(['success' => true, 'data' => $discounts]);
    }
}
