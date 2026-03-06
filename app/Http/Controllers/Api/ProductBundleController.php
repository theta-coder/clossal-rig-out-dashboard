<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductBundle;
use Illuminate\Http\Request;

class ProductBundleController extends Controller
{
    /**
     * GET /api/bundles
     * Returns all active bundles
     */
    public function index()
    {
        $now     = now();
        $bundles = ProductBundle::where('is_active', true)
            ->where(function ($q) use ($now) {
                $q->whereNull('starts_at')->orWhere('starts_at', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('ends_at')->orWhere('ends_at', '>=', $now);
            })
            ->with(['items.product.images'])
            ->get()
            ->map(fn($b) => $this->format($b));

        return response()->json(['success' => true, 'data' => $bundles]);
    }

    /**
     * GET /api/bundles/{id}
     */
    public function show($id)
    {
        $bundle = ProductBundle::where('is_active', true)
            ->with(['items.product.images', 'items.variant'])
            ->findOrFail($id);

        return response()->json(['success' => true, 'data' => $this->format($bundle, true)]);
    }

    private function format(ProductBundle $b, bool $detailed = false): array
    {
        $data = [
            'id'             => $b->id,
            'name'           => $b->name,
            'slug'           => $b->slug,
            'description'    => $b->description,
            'image'          => $b->image ? url($b->image) : null,
            'price'          => (float) $b->price,
            'original_price' => $b->original_price ? (float) $b->original_price : null,
            'savings'        => $b->original_price ? round((float)$b->original_price - (float)$b->price, 2) : null,
            'ends_at'        => $b->ends_at,
            'items'          => $b->items->map(fn($item) => [
                'id'         => $item->id,
                'product_id' => $item->product_id,
                'quantity'   => $item->quantity,
                'product'    => $item->product ? [
                    'id'    => $item->product->id,
                    'name'  => $item->product->name,
                    'slug'  => $item->product->slug,
                    'price' => (float) $item->product->price,
                    'image' => $item->product->images->first()
                        ? url($item->product->images->first()->image_path)
                        : null,
                ] : null,
            ])->values(),
        ];

        return $data;
    }
}
