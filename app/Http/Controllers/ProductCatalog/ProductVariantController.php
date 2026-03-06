<?php

namespace App\Http\Controllers\ProductCatalog;

use App\Http\Controllers\Controller;
use App\Models\ProductCatalog\Product;
use App\Models\ProductCatalog\ProductVariant;
use App\Models\ProductCatalog\ProductVariantImage;
use App\Models\ProductCatalog\Size;
use App\Models\ProductCatalog\Color;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductVariantController extends Controller
{
    /**
     * Display all variants for a product
     */
    public function index(Request $request, Product $product)
    {
        if ($request->ajax() && $request->has('draw')) {
            return $this->getDataTablesVariants($request, $product);
        }

        return Inertia::render('ProductCatalog/Variants/Index', [
            'product'          => $product->load(['images']),
            'available_sizes'  => Size::orderBy('name')->get(['id', 'name']),
            'available_colors' => Color::orderBy('name')->get(['id', 'name', 'code']),
        ]);
    }

    /**
     * DataTables server-side response
     */
    private function getDataTablesVariants(Request $request, Product $product)
    {
        $query = $product->variants()->with(['size', 'color', 'variantImages']);

        if ($request->filled('search.value')) {
            $search = $request->input('search.value');
            $query->where(function ($q) use ($search) {
                $q->where('sku', 'like', "%{$search}%")
                  ->orWhere('barcode', 'like', "%{$search}%");
            });
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $totalData = $query->count();

        $orderColumn = $request->input('order.0.column', 0);
        $orderDir    = $request->input('order.0.dir', 'asc');
        $columns     = ['id', 'sku', 'stock', 'price', 'is_active'];

        if (isset($columns[$orderColumn])) {
            $query->orderBy($columns[$orderColumn], $orderDir);
        }

        $start  = $request->input('start', 0);
        $length = $request->input('length', 10);

        $variants = $query->skip($start)->take($length)->get();

        $data = $variants->map(function ($variant, $index) use ($start) {
            $primaryImage = $variant->variantImages->firstWhere('is_primary', true)
                ?? $variant->variantImages->first();

            return [
                'DT_RowIndex' => $start + $index + 1,
                'id'          => $variant->id,
                'image'       => $primaryImage ? asset($primaryImage->image_path) : null,
                'sku'         => $variant->sku ?? '—',
                'barcode'     => $variant->barcode ?? '—',
                'size'        => $variant->size?->name ?? '—',
                'color'       => $variant->color?->name ?? '—',
                'color_code'  => $variant->color?->code ?? null,
                'stock'       => $variant->stock,
                'price'       => $variant->price ? '$' . number_format($variant->price, 2) : '—',
                'weight'      => $variant->weight ? $variant->weight . ' kg' : '—',
                'is_active'   => $variant->is_active ? 'Active' : 'Inactive',
                'action'      => $variant->id,
            ];
        });

        return response()->json([
            'draw'            => intval($request->input('draw')),
            'recordsTotal'    => $totalData,
            'recordsFiltered' => $totalData,
            'data'            => $data,
        ]);
    }

    /**
     * Store a new variant for a product
     */
    public function store(Request $request, Product $product)
    {
        $validated = $request->validate([
            'size_id'   => 'nullable|exists:sizes,id',
            'color_id'  => 'nullable|exists:colors,id',
            'sku'       => 'nullable|string|max:255|unique:product_variants,sku',
            'barcode'   => 'nullable|string|max:255',
            'stock'     => 'required|integer|min:0',
            'price'     => 'nullable|numeric|min:0',
            'weight'    => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
            'images.*'  => 'image|max:2048',
        ]);

        $variant = $product->variants()->create($validated);

        // Store variant images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $file) {
                $filename = 'variant_' . time() . '_' . $index . '_' . $file->getClientOriginalName();
                $file->move(public_path('assets/variants'), $filename);

                $variant->variantImages()->create([
                    'product_id' => $product->id,
                    'color_id'   => $validated['color_id'] ?? null,
                    'image_path' => 'assets/variants/' . $filename,
                    'is_primary' => $index === 0,
                    'sort_order' => $index,
                ]);
            }
        }

        return back()->with('success', 'Variant created successfully.');
    }

    /**
     * Update an existing variant
     */
    public function update(Request $request, Product $product, ProductVariant $variant)
    {
        $validated = $request->validate([
            'size_id'   => 'nullable|exists:sizes,id',
            'color_id'  => 'nullable|exists:colors,id',
            'sku'       => 'nullable|string|max:255|unique:product_variants,sku,' . $variant->id,
            'barcode'   => 'nullable|string|max:255',
            'stock'     => 'required|integer|min:0',
            'price'     => 'nullable|numeric|min:0',
            'weight'    => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
            'images.*'  => 'image|max:2048',
        ]);

        $variant->update($validated);

        // Append new images if uploaded
        if ($request->hasFile('images')) {
            $existingCount = $variant->variantImages()->count();
            foreach ($request->file('images') as $index => $file) {
                $filename = 'variant_' . time() . '_' . $index . '_' . $file->getClientOriginalName();
                $file->move(public_path('assets/variants'), $filename);

                $variant->variantImages()->create([
                    'product_id' => $product->id,
                    'color_id'   => $validated['color_id'] ?? null,
                    'image_path' => 'assets/variants/' . $filename,
                    'is_primary' => $existingCount === 0 && $index === 0,
                    'sort_order' => $existingCount + $index,
                ]);
            }
        }

        return back()->with('success', 'Variant updated successfully.');
    }

    /**
     * Delete a variant and its images
     */
    public function destroy(Product $product, ProductVariant $variant)
    {
        foreach ($variant->variantImages as $image) {
            if (file_exists(public_path($image->image_path))) {
                unlink(public_path($image->image_path));
            }
        }

        $variant->variantImages()->delete();
        $variant->delete();

        return back()->with('success', 'Variant deleted successfully.');
    }

    /**
     * Toggle active status
     */
    public function toggleActive(Product $product, ProductVariant $variant)
    {
        $variant->update(['is_active' => !$variant->is_active]);

        return back()->with('success', 'Variant status updated.');
    }

    /**
     * Delete a specific variant image
     */
    public function destroyImage(Product $product, ProductVariant $variant, ProductVariantImage $image)
    {
        if (file_exists(public_path($image->image_path))) {
            unlink(public_path($image->image_path));
        }

        $image->delete();

        return back()->with('success', 'Variant image deleted.');
    }
}
