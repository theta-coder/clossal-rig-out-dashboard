<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FlashSale;
use App\Models\FlashSaleProduct;
use Illuminate\Http\Request;

class FlashSaleController extends Controller
{
    /**
     * GET /api/flash-sales/active
     * Returns the current active flash sale with its products
     */
    public function active()
    {
        $now  = now();
        $sale = FlashSale::where('is_active', true)
            ->where('starts_at', '<=', $now)
            ->where('ends_at', '>=', $now)
            ->with(['products' => function ($q) {
                $q->with(['product.images'])
                  ->whereHas('product', fn($p) => $p->where('is_active', true));
            }])
            ->first();

        if (!$sale) {
            return response()->json(['success' => true, 'data' => null]);
        }

        return response()->json([
            'success' => true,
            'data'    => [
                'id'             => $sale->id,
                'name'           => $sale->name,
                'discount_type'  => $sale->discount_type,
                'discount_value' => (float) $sale->discount_value,
                'starts_at'      => $sale->starts_at,
                'ends_at'        => $sale->ends_at,
                'products'       => $sale->products->map(fn($fp) => [
                    'id'           => $fp->product->id,
                    'name'         => $fp->product->name,
                    'slug'         => $fp->product->slug,
                    'sale_price'   => (float) $fp->sale_price,
                    'original_price'=> (float) $fp->product->price,
                    'max_quantity' => $fp->max_quantity,
                    'sold_count'   => $fp->sold_count,
                    'image'        => $fp->product->images->first()
                        ? url($fp->product->images->first()->image_path)
                        : null,
                ])->values(),
            ],
        ]);
    }

    /**
     * GET /api/flash-sales/{id}
     */
    public function show($id)
    {
        $sale = FlashSale::where('is_active', true)
            ->with(['products.product.images'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => [
                'id'             => $sale->id,
                'name'           => $sale->name,
                'discount_type'  => $sale->discount_type,
                'discount_value' => (float) $sale->discount_value,
                'starts_at'      => $sale->starts_at,
                'ends_at'        => $sale->ends_at,
                'products'       => $sale->products->map(fn($fp) => [
                    'id'            => $fp->product->id,
                    'name'          => $fp->product->name,
                    'slug'          => $fp->product->slug,
                    'sale_price'    => (float) $fp->sale_price,
                    'original_price'=> (float) $fp->product->price,
                    'max_quantity'  => $fp->max_quantity,
                    'sold_count'    => $fp->sold_count,
                    'image'         => $fp->product->images->first()
                        ? url($fp->product->images->first()->image_path)
                        : null,
                ])->values(),
            ],
        ]);
    }
}
