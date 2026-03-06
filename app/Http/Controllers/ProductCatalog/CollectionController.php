<?php

namespace App\Http\Controllers\ProductCatalog;

use App\Http\Controllers\Controller;
use App\Models\ProductCatalog\Collection;
use App\Models\ProductCatalog\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CollectionController extends Controller
{
    /**
     * Display a listing of collections
     */
    public function index()
    {
        return Inertia::render('ProductCatalog/Collections/Index', [
            'collections' => Collection::withCount('products')->orderBy('sort_order')->get()
        ]);
    }

    /**
     * Show the form for creating a new collection
     */
    public function create()
    {
        return Inertia::render('ProductCatalog/Collections/Create', [
            'products' => Product::where('is_active', true)->get(['id', 'name'])
        ]);
    }

    /**
     * Store a newly created collection
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:collections,slug',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date|after_or_equal:starts_at',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'product_ids' => 'nullable|array',
            'product_ids.*' => 'exists:products,id',
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('assets/collections'), $filename);
            $validated['image'] = 'assets/collections/' . $filename;
        }

        $collection = Collection::create($validated);

        if (!empty($request->product_ids)) {
            $collection->products()->sync($request->product_ids);
        }

        return redirect()->route('collections.index')->with('success', 'Collection created successfully!');
    }

    /**
     * Show the form for editing the specified collection
     */
    public function edit(Collection $collection)
    {
        return Inertia::render('ProductCatalog/Collections/Edit', [
            'collection' => $collection->load('products'),
            'products' => Product::where('is_active', true)->get(['id', 'name'])
        ]);
    }

    /**
     * Update the specified collection
     */
    public function update(Request $request, Collection $collection)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:collections,slug,' . $collection->id,
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date|after_or_equal:starts_at',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'product_ids' => 'nullable|array',
            'product_ids.*' => 'exists:products,id',
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);

        if ($request->hasFile('image')) {
            if ($collection->image && file_exists(public_path($collection->image))) {
                unlink(public_path($collection->image));
            }
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('assets/collections'), $filename);
            $validated['image'] = 'assets/collections/' . $filename;
        }

        $collection->update($validated);

        if (isset($request->product_ids)) {
            $collection->products()->sync($request->product_ids);
        }

        return redirect()->route('collections.index')->with('success', 'Collection updated successfully!');
    }

    /**
     * Remove the specified collection
     */
    public function destroy(Collection $collection)
    {
        if ($collection->image && file_exists(public_path($collection->image))) {
            unlink(public_path($collection->image));
        }

        $collection->products()->detach();
        $collection->delete();

        return back()->with('success', 'Collection deleted successfully!');
    }
}

