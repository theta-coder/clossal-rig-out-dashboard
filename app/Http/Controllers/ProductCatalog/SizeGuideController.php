<?php

namespace App\Http\Controllers\ProductCatalog;

use App\Http\Controllers\Controller;
use App\Models\ProductCatalog\Category;
use App\Models\ProductCatalog\SizeGuide;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SizeGuideController extends Controller
{
    /**
     * Display a listing of size guides
     */
    public function index()
    {
        return Inertia::render('ProductCatalog/SizeGuides/Index', [
            'sizeGuides' => SizeGuide::with('rows')->latest()->get()
        ]);
    }

    /**
     * Show the form for creating a new size guide
     */
    public function create()
    {
        return Inertia::render('ProductCatalog/SizeGuides/Create', [
            'categories' => Category::whereNull('parent_id')->get(['id', 'name'])
        ]);
    }

    /**
     * Store a newly created size guide
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'columns' => 'required|array|min:1',
            'rows' => 'required|array|min:1',
            'rows.*.size_label' => 'required|string',
            'rows.*.measurements' => 'required|array',
        ]);

        $sizeGuide = SizeGuide::create([
            'name' => $validated['name'],
            'category_id' => $validated['category_id'],
            'columns' => $validated['columns'],
        ]);

        foreach ($validated['rows'] as $index => $row) {
            $sizeGuide->rows()->create([
                'size_label' => $row['size_label'],
                'measurements' => $row['measurements'],
                'sort_order' => $index,
            ]);
        }

        return redirect()->route('size-guides.index')->with('success', 'Size guide created successfully!');
    }

    /**
     * Show the form for editing the specified size guide
     */
    public function edit(SizeGuide $sizeGuide)
    {
        return Inertia::render('ProductCatalog/SizeGuides/Edit', [
            'sizeGuide' => $sizeGuide->load('rows'),
            'categories' => Category::all(['id', 'name'])
        ]);
    }

    /**
     * Update the specified size guide
     */
    public function update(Request $request, SizeGuide $sizeGuide)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'columns' => 'required|array|min:1',
            'rows' => 'required|array|min:1',
            'rows.*.size_label' => 'required|string',
            'rows.*.measurements' => 'required|array',
        ]);

        $sizeGuide->update([
            'name' => $validated['name'],
            'category_id' => $validated['category_id'],
            'columns' => $validated['columns'],
        ]);

        $sizeGuide->rows()->delete();
        foreach ($validated['rows'] as $index => $row) {
            $sizeGuide->rows()->create([
                'size_label' => $row['size_label'],
                'measurements' => $row['measurements'],
                'sort_order' => $index,
            ]);
        }

        return redirect()->route('size-guides.index')->with('success', 'Size guide updated successfully!');
    }

    /**
     * Remove the specified size guide
     */
    public function destroy(SizeGuide $sizeGuide)
    {
        $sizeGuide->rows()->delete();
        $sizeGuide->delete();

        return back()->with('success', 'Size guide deleted successfully!');
    }
}
