<?php

namespace App\Http\Controllers\ProductCatalog;

use App\Http\Controllers\Controller;
use App\Models\ProductCatalog\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TagController extends Controller
{
    /**
     * Display a listing of tags
     */
    public function index()
    {
        return Inertia::render('ProductCatalog/Tags/Index', [
            'tags' => Tag::withCount('products')->latest()->get()
        ]);
    }

    /**
     * Store a newly created tag
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:tags,name',
            'slug' => 'nullable|string|max:255|unique:tags,slug',
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);

        Tag::create($validated);

        return back()->with('success', 'Tag created successfully!');
    }

    /**
     * Update the specified tag
     */
    public function update(Request $request, Tag $tag)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:tags,name,' . $tag->id,
            'slug' => 'nullable|string|max:255|unique:tags,slug,' . $tag->id,
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);

        $tag->update($validated);

        return back()->with('success', 'Tag updated successfully!');
    }

    /**
     * Remove the specified tag
     */
    public function destroy(Tag $tag)
    {
        if ($tag->products()->count() > 0) {
            return back()->with('error', 'Cannot delete tag that is associated with products!');
        }

        $tag->delete();

        return back()->with('success', 'Tag deleted successfully!');
    }
}

