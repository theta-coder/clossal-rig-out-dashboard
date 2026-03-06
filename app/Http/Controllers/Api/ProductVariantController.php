<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductCatalog\Product;
use App\Models\ProductCatalog\ProductVariant;
use Illuminate\Http\Request;

class ProductVariantController extends Controller
{
    /**
     * Get all active variants for a product
     * GET /api/products/{product}/variants
     *
     * Optional filters: ?size_id=1 &color_id=2 &in_stock=true
     */
    public function index(Request $request, $productId)
    {
        $product = Product::where('is_active', true)
            ->where(function ($q) use ($productId) {
                $q->where('id', $productId)->orWhere('slug', $productId);
            })
            ->firstOrFail();

        $query = ProductVariant::with(['size', 'color', 'variantImages'])
            ->where('product_id', $product->id)
            ->where('is_active', true);

        if ($request->filled('size_id')) {
            $query->where('size_id', $request->size_id);
        }

        if ($request->filled('color_id')) {
            $query->where('color_id', $request->color_id);
        }

        if ($request->filled('in_stock') && $request->boolean('in_stock')) {
            $query->where('stock', '>', 0);
        }

        $variants = $query->get()->map(fn ($v) => $this->formatVariant($v));

        return response()->json([
            'success' => true,
            'data'    => $variants,
        ]);
    }

    /**
     * Get a single variant by ID
     * GET /api/variants/{id}
     */
    public function show($id)
    {
        $variant = ProductVariant::with(['size', 'color', 'variantImages', 'product'])
            ->where('is_active', true)
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $this->formatVariant($variant, true),
        ]);
    }

    /**
     * Check stock availability for a specific variant
     * GET /api/variants/{id}/stock
     */
    public function stock($id)
    {
        $variant = ProductVariant::where('is_active', true)->findOrFail($id);

        return response()->json([
            'success'      => true,
            'variant_id'   => $variant->id,
            'stock'        => $variant->stock,
            'in_stock'     => $variant->stock > 0,
            'low_stock'    => $variant->stock > 0 && $variant->stock <= 5,
        ]);
    }

    /**
     * Format a variant for API response
     */
    private function formatVariant(ProductVariant $variant, bool $includeProduct = false): array
    {
        $primaryImage = $variant->variantImages
            ->firstWhere('is_primary', true) ?? $variant->variantImages->first();

        $data = [
            'id'         => $variant->id,
            'product_id' => $variant->product_id,
            'sku'        => $variant->sku,
            'barcode'    => $variant->barcode,
            'stock'      => $variant->stock,
            'in_stock'   => $variant->stock > 0,
            'low_stock'  => $variant->stock > 0 && $variant->stock <= 5,
            'price'      => $variant->price ? (float) $variant->price : null,
            'weight'     => $variant->weight ? (float) $variant->weight : null,
            'size'       => $variant->size ? [
                'id'   => $variant->size->id,
                'name' => $variant->size->name,
            ] : null,
            'color'      => $variant->color ? [
                'id'   => $variant->color->id,
                'name' => $variant->color->name,
                'code' => $variant->color->code,
            ] : null,
            'images'     => $variant->variantImages->map(fn ($img) => [
                'id'         => $img->id,
                'url'        => url($img->image_path),
                'is_primary' => (bool) $img->is_primary,
                'sort_order' => $img->sort_order,
            ])->values(),
            'primary_image' => $primaryImage ? url($primaryImage->image_path) : null,
        ];

        if ($includeProduct && $variant->relationLoaded('product')) {
            $data['product'] = [
                'id'   => $variant->product->id,
                'name' => $variant->product->name,
                'slug' => $variant->product->slug,
            ];
        }

        return $data;
    }
}
