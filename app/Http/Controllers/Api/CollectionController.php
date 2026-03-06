<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductCatalog\Collection;
use Illuminate\Http\Request;

class CollectionController extends Controller
{
    /**
     * Get all currently active collections for shop/home sections.
     */
    public function index(Request $request)
    {
        $query = Collection::withCount('products')
            ->with([
                'products' => function ($q) {
                    $q->where('is_active', true)
                        ->with('images')
                        ->orderBy('collection_product.sort_order')
                        ->take(12);
                }
            ])
            ->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('starts_at')->orWhereDate('starts_at', '<=', now()->toDateString());
            })
            ->where(function ($q) {
                $q->whereNull('ends_at')->orWhereDate('ends_at', '>=', now()->toDateString());
            })
            ->orderBy('sort_order');

        if ($request->filled('search')) {
            $search = trim((string) $request->search);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $collections = $query->get()->map(function ($collection) {
            return [
                'id' => $collection->id,
                'name' => $collection->name,
                'slug' => $collection->slug,
                'description' => $collection->description,
                'image' => $collection->image ? url($collection->image) : null,
                'image_url' => $collection->image ? url($collection->image) : null,
                'banner' => $collection->image ? url($collection->image) : null,
                'products_count' => (int) $collection->products_count,
                'starts_at' => $collection->starts_at?->toDateString(),
                'ends_at' => $collection->ends_at?->toDateString(),
                'products' => $collection->products->map(function ($product) {
                    $firstImage = $product->images->sortBy('sort_order')->first();

                    return [
                        'id' => $product->id,
                        'name' => $product->name,
                        'slug' => $product->slug,
                        'price' => (float) $product->price,
                        'original_price' => $product->original_price ? (float) $product->original_price : null,
                        'badge' => $product->badge,
                        'image' => $firstImage ? url($firstImage->image_path) : null,
                    ];
                })->values(),
            ];
        })->values();

        return response()->json([
            'success' => true,
            'message' => 'Collections fetched successfully',
            'data' => $collections,
        ]);
    }

    /**
     * Get a single collection by id or slug.
     */
    public function show($identifier)
    {
        $collection = Collection::with([
            'products' => function ($q) {
                $q->where('is_active', true)
                    ->with(['images', 'category', 'tags'])
                    ->orderBy('collection_product.sort_order');
            }
        ])
            ->withCount('products')
            ->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('starts_at')->orWhereDate('starts_at', '<=', now()->toDateString());
            })
            ->where(function ($q) {
                $q->whereNull('ends_at')->orWhereDate('ends_at', '>=', now()->toDateString());
            })
            ->where(function ($q) use ($identifier) {
                $q->where('id', $identifier)->orWhere('slug', $identifier);
            })
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $collection->id,
                'name' => $collection->name,
                'slug' => $collection->slug,
                'description' => $collection->description,
                'image' => $collection->image ? url($collection->image) : null,
                'image_url' => $collection->image ? url($collection->image) : null,
                'banner' => $collection->image ? url($collection->image) : null,
                'products_count' => (int) $collection->products_count,
                'starts_at' => $collection->starts_at?->toDateString(),
                'ends_at' => $collection->ends_at?->toDateString(),
                'products' => $collection->products->map(function ($product) {
                    $firstImage = $product->images->sortBy('sort_order')->first();

                    return [
                        'id' => $product->id,
                        'name' => $product->name,
                        'slug' => $product->slug,
                        'description' => $product->description,
                        'price' => (float) $product->price,
                        'original_price' => $product->original_price ? (float) $product->original_price : null,
                        'badge' => $product->badge,
                        'category' => $product->category?->name,
                        'image' => $firstImage ? url($firstImage->image_path) : null,
                        'tags' => $product->tags->map(function ($tag) {
                            return [
                                'id' => $tag->id,
                                'name' => $tag->name,
                                'slug' => $tag->slug,
                            ];
                        })->values(),
                    ];
                })->values(),
            ],
        ]);
    }
}
