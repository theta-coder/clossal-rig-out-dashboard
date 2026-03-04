<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Size;
use App\Models\Color;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of products
     */
    public function index(Request $request)
    {
        // Mobile paginated JSON request
        if ($request->has('mobile') || ($request->ajax() && $request->get('page'))) {
            return $this->getMobileProducts($request);
        }

        // DataTables AJAX request
        if ($request->ajax() && $request->has('draw')) {
            return $this->getDataTablesProducts($request);
        }

        // Initial Inertia page load (React)
        return Inertia::render('Products/Index');
    }

    /**
     * Mobile paginated response
     */
    private function getMobileProducts(Request $request)
    {
        /** @var \Illuminate\Database\Eloquent\Builder $query */
        $query = Product::with(['category', 'images']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function (\Illuminate\Database\Eloquent\Builder $q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $perPage = $request->get('per_page', 10);
        $products = $query->latest()->paginate($perPage);

        return response()->json($products);
    }

    /**
     * DataTables server-side response
     */
    private function getDataTablesProducts(Request $request)
    {
        /** @var \Illuminate\Database\Eloquent\Builder $query */
        $query = Product::with(['category', 'images']);

        // Global search
        if ($request->filled('search.value')) {
            $search = $request->input('search.value');
            $query->where(function (\Illuminate\Database\Eloquent\Builder $q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        // Column filters
        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $totalData = $query->count();

        // Sorting
        $orderColumn = $request->input('order.0.column', 1);
        $orderDir = $request->input('order.0.dir', 'desc');
        $columns = ['id', 'name', 'slug', 'category_id', 'price', 'is_active'];

        if (isset($columns[$orderColumn])) {
            $query->orderBy($columns[$orderColumn], $orderDir);
        }

        // Pagination
        $start = $request->input('start', 0);
        $length = $request->input('length', 10);

        $products = $query->skip($start)->take($length)->get();

        $data = $products->map(function ($product, $index) use ($start) {
            $firstImage = $product->images->first();
            return [
            'DT_RowIndex' => $start + $index + 1,
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'image' => $firstImage ? asset($firstImage->image_path) : null,
            'category_name' => $product->category ? $product->category->name : '—',
            'price' => $product->price,
            'is_active' => $product->is_active ? 'Active' : 'Inactive',
            'action' => $product->id,
            ];
        });

        return response()->json([
            'draw' => intval($request->input('draw')),
            'recordsTotal' => $totalData,
            'recordsFiltered' => $totalData,
            'data' => $data,
        ]);
    }

    /**
     * Show the form for creating a new product
     */
    public function create()
    {
        return Inertia::render('Products/Create', [
            'categories' => Category::where('is_active', true)->get(['id', 'name']),
            'available_sizes' => Size::orderBy('name')->get(['id', 'name']),
            'available_colors' => Color::orderBy('name')->get(['id', 'name', 'code']),
        ]);
    }

    /**
     * Show the form for editing the specified product
     */
    public function edit(Product $product)
    {
        return Inertia::render('Products/Edit', [
            'product' => $product->load(['images', 'sizeAttributes', 'colorAttributes', 'details']),
            'categories' => Category::where('is_active', true)->get(['id', 'name']),
            'available_sizes' => Size::orderBy('name')->get(['id', 'name']),
            'available_colors' => Color::orderBy('name')->get(['id', 'name', 'code']),
        ]);
    }

    /**
     * Show the specified product
     */
    public function show(Product $product)
    {
        return Inertia::render('Products/Show', [
            'product' => $product->load(['category', 'images', 'sizes', 'colors', 'details', 'reviews.user']),
        ]);
    }

    /**
     * Store a newly created product
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:products,slug',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'badge' => 'nullable|string|max:50',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'images.*' => 'image|max:2048',
            'sizes' => 'nullable|array',
            'sizes.*.size_id' => 'required|exists:sizes,id',
            'sizes.*.stock' => 'required|integer|min:0',
            'colors' => 'nullable|array',
            'colors.*.color_id' => 'required|exists:colors,id',
            'details' => 'nullable|array',
            'details.*.detail' => 'required|string',
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);

        $product = Product::create($validated);

        // Store images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $file) {
                $filename = time() . '_' . $index . '_' . $file->getClientOriginalName();
                $file->move(public_path('assets/products'), $filename);

                $product->images()->create([
                    'image_path' => 'assets/products/' . $filename,
                    'sort_order' => $index,
                ]);
            }
        }

        // Store sizes
        if (!empty($validated['sizes'])) {
            foreach ($validated['sizes'] as $size) {
                $product->sizeAttributes()->create([
                    'size_id' => $size['size_id'],
                    'stock' => $size['stock']
                ]);
            }
        }

        // Store colors
        if (!empty($validated['colors'])) {
            foreach ($validated['colors'] as $color) {
                $product->colorAttributes()->create([
                    'color_id' => $color['color_id']
                ]);
            }
        }

        // Store details
        if (!empty($validated['details'])) {
            foreach ($validated['details'] as $index => $detail) {
                $product->details()->create([
                    'detail' => $detail['detail'],
                    'sort_order' => $index,
                ]);
            }
        }

        return back()->with('success', 'Product created successfully!');
    }

    /**
     * Update the specified product
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:products,slug,' . $product->id,
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'badge' => 'nullable|string|max:50',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'images.*' => 'image|max:2048',
            'sizes' => 'nullable|array',
            'sizes.*.size_id' => 'required|exists:sizes,id',
            'sizes.*.stock' => 'required|integer|min:0',
            'colors' => 'nullable|array',
            'colors.*.color_id' => 'required|exists:colors,id',
            'details' => 'nullable|array',
            'details.*.detail' => 'required|string',
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);

        $product->update($validated);

        // Update images
        if ($request->hasFile('images')) {
            // Delete existing images from disk
            foreach ($product->images as $existingImage) {
                if (file_exists(public_path($existingImage->image_path))) {
                    unlink(public_path($existingImage->image_path));
                }
            }
            $product->images()->delete();

            foreach ($request->file('images') as $index => $file) {
                $filename = time() . '_' . $index . '_' . $file->getClientOriginalName();
                $file->move(public_path('assets/products'), $filename);

                $product->images()->create([
                    'image_path' => 'assets/products/' . $filename,
                    'sort_order' => $index,
                ]);
            }
        }

        // Sync sizes
        if (isset($validated['sizes'])) {
            $product->sizeAttributes()->delete();
            foreach ($validated['sizes'] as $size) {
                $product->sizeAttributes()->create([
                    'size_id' => $size['size_id'],
                    'stock' => $size['stock']
                ]);
            }
        }

        // Sync colors
        if (isset($validated['colors'])) {
            $product->colorAttributes()->delete();
            foreach ($validated['colors'] as $color) {
                $product->colorAttributes()->create([
                    'color_id' => $color['color_id']
                ]);
            }
        }

        // Sync details
        if (isset($validated['details'])) {
            $product->details()->delete();
            foreach ($validated['details'] as $index => $detail) {
                $product->details()->create([
                    'detail' => $detail['detail'],
                    'sort_order' => $index,
                ]);
            }
        }

        return back()->with('success', 'Product updated successfully!');
    }

    /**
     * Remove the specified product
     */
    public function destroy(Product $product)
    {
        // Delete images from disk
        foreach ($product->images as $image) {
            if (file_exists(public_path($image->image_path))) {
                unlink(public_path($image->image_path));
            }
        }

        $product->delete();

        return back()->with('success', 'Product deleted successfully!');
    }

    /**
     * Activate a product
     */
    public function activate(Product $product)
    {
        $product->update(['is_active' => true]);

        return back()->with('success', 'Product activated successfully!');
    }

    /**
     * Dropdown list for selects (API endpoint)
     */
    public function dropdown(Request $request)
    {
        $query = Product::query();

        if (!$request->filled('include_all')) {
            $query->where('is_active', true);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('exclude_id')) {
            $query->where('id', '!=', $request->exclude_id);
        }

        return response()->json(
            $query->select('id', 'name', 'slug', 'category_id', 'price', 'is_active')
            ->orderBy('name')
            ->get()
        );
    }

    /**
     * Quick stats summary
     */
    public function summary()
    {
        return response()->json([
            'total' => Product::count(),
            'active' => Product::where('is_active', true)->count(),
            'inactive' => Product::where('is_active', false)->count(),
            'featured' => Product::where('is_featured', true)->count(),
        ]);
    }
}
