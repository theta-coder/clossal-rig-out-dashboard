<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Get all active products with images, sizes, colors, details, and category
     */
    public function index(Request $request)
    {
        $query = Product::with(['category', 'images', 'sizes', 'colors', 'details'])
            ->where('is_active', true);

        // Filter by category name (supports comma-separated values)
        if ($request->filled('category')) {
            $categoryNames = collect(explode(',', (string) $request->category))
                ->map(fn ($name) => trim($name))
                ->filter()
                ->values()
                ->all();

            $query->whereHas('category', function ($q) use ($categoryNames) {
                $q->whereIn('name', $categoryNames);
            });
        }

        // Filter by category_id
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by sizes (supports comma-separated values)
        if ($request->filled('size')) {
            $sizes = collect(explode(',', (string) $request->size))
                ->map(fn ($size) => trim($size))
                ->filter()
                ->values()
                ->all();

            $query->whereHas('sizes', function ($q) use ($sizes) {
                $q->whereIn('name', $sizes);
            });
        }

        // Price range filter
        if ($request->filled('min_price')) {
            $query->where('price', '>=', (float) $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', (float) $request->max_price);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Featured only
        if ($request->filled('featured')) {
            $query->where('is_featured', true);
        }

        // Sorting
        $sortBy = $request->get('sort', 'latest');
        switch ($sortBy) {
            case 'new':
            case 'latest':
            case 'default':
                $query->latest();
                break;
            case 'price-low':
                $query->orderBy('price', 'asc');
                break;
            case 'price-high':
                $query->orderBy('price', 'desc');
                break;
            case 'name':
                $query->orderBy('name', 'asc');
                break;
            default:
                $query->latest();
                break;
        }

        $perPage = $request->get('per_page', 12);
        $products = $query->paginate($perPage);

        $products->getCollection()->transform(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'price' => (float) $product->price,
                'original_price' => $product->original_price ? (float) $product->original_price : null,
                'badge' => $product->badge,
                'is_featured' => $product->is_featured,
                'category' => $product->category ? $product->category->name : null,
                'category_id' => $product->category_id,
                'images' => $product->images->map(function ($img) {
                    return [
                        'id' => $img->id,
                        'url' => url($img->image_path),
                        'sort_order' => $img->sort_order,
                    ];
                })->values(),
                'sizes' => $product->sizes->map(function ($size) {
                    return [
                        'id' => $size->id,
                        'size' => $size->name,
                        'name' => $size->name,
                        'stock' => $size->pivot->stock ?? null,
                    ];
                })->values(),
                'colors' => $product->colors->map(function ($color) {
                    return [
                        'id' => $color->id,
                        'color_name' => $color->name,
                        'name' => $color->name,
                        'color_code' => $color->code,
                        'code' => $color->code,
                    ];
                })->values(),
                'details' => $product->details->pluck('detail')->values(),
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Products fetched successfully',
            'data' => $products->items(),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ]
        ]);
    }

    /**
     * Get single product detail by ID or slug
     */
    public function show($identifier)
    {
        $product = Product::with([
            'category',
            'images',
            'sizes',
            'colors',
            'details',
            'reviews' => function ($q) {
                $q->where('is_verified', true)->with('user')->latest();
            }
        ])
            ->where('is_active', true)
            ->where(function ($q) use ($identifier) {
                $q->where('id', $identifier)
                  ->orWhere('slug', $identifier);
            })
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'price' => (float) $product->price,
                'original_price' => $product->original_price ? (float) $product->original_price : null,
                'badge' => $product->badge,
                'is_featured' => $product->is_featured,
                'category' => $product->category ? $product->category->name : null,
                'category_id' => $product->category_id,
                'images' => $product->images->map(function ($img) {
                    return [
                        'id' => $img->id,
                        'url' => url($img->image_path),
                        'sort_order' => $img->sort_order,
                    ];
                })->values(),
                'sizes' => $product->sizes->map(function ($size) {
                    return [
                        'id' => $size->id,
                        'size' => $size->name,
                        'name' => $size->name,
                        'stock' => $size->pivot->stock ?? null,
                    ];
                })->values(),
                'colors' => $product->colors->map(function ($color) {
                    return [
                        'id' => $color->id,
                        'color_name' => $color->name,
                        'name' => $color->name,
                        'color_code' => $color->code,
                        'code' => $color->code,
                    ];
                })->values(),
                'details' => $product->details->pluck('detail')->values(),
                'reviews' => $product->reviews->map(function ($review) {
                    return [
                        'id' => $review->id,
                        'reviewer_name' => $review->user ? $review->user->name : $review->reviewer_name,
                        'rating' => $review->rating,
                        'title' => $review->title,
                        'body' => $review->body,
                        'is_verified' => (bool) $review->is_verified,
                        'created_at' => $review->created_at->format('M d, Y'),
                    ];
                })->values(),
            ]
        ]);
    }
}
