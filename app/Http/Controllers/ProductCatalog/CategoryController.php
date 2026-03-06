<?php

namespace App\Http\Controllers\ProductCatalog;

use App\Http\Controllers\Controller;
use App\Models\ProductCatalog\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories
     */
    public function index(Request $request)
    {
        // Mobile paginated JSON request
        if ($request->has('mobile') || ($request->ajax() && $request->get('page'))) {
            return $this->getMobileCategories($request);
        }

        // DataTables AJAX request
        if ($request->ajax() && $request->has('draw')) {
            return $this->getDataTablesCategories($request);
        }

        // Initial Inertia page load (React)
        return Inertia::render('ProductCatalog/Categories/Index');
    }

    /**
     * Mobile paginated response
     */
    private function getMobileCategories(Request $request)
    {
        /** @var \Illuminate\Database\Eloquent\Builder $query */
        $query = Category::with('parent')->withCount('products');

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

        if ($request->filled('parent_id')) {
            $query->where('parent_id', $request->parent_id);
        }

        $perPage = $request->get('per_page', 10);
        $categories = $query->latest()->paginate($perPage);

        return response()->json($categories);
    }

    /**
     * DataTables server-side response
     */
    private function getDataTablesCategories(Request $request)
    {
        /** @var \Illuminate\Database\Eloquent\Builder $query */
        $query = Category::with('parent')->withCount('products');

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

        if ($request->filled('parent_id')) {
            $query->where('parent_id', $request->parent_id);
        }

        $totalData = $query->count();

        // Sorting
        $orderColumn = $request->input('order.0.column', 1);
        $orderDir = $request->input('order.0.dir', 'desc');
        $columns = ['id', 'name', 'slug', 'parent_id', 'products_count', 'is_active'];

        if (isset($columns[$orderColumn])) {
            $query->orderBy($columns[$orderColumn], $orderDir);
        }

        // Pagination
        $start = $request->input('start', 0);
        $length = $request->input('length', 10);

        $categories = $query->skip($start)->take($length)->get();

        $data = $categories->map(function ($category, $index) use ($start) {
            return [
            'DT_RowIndex' => $start + $index + 1,
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
            'image' => $category->image ? asset($category->image) : null,
            'parent_name' => $category->parent ? $category->parent->name : '—',
            'products_count' => $category->products_count,
            'is_active' => $category->is_active ? 'Active' : 'Inactive',
            'action' => $category->id,
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
     * Show the form for creating a new category
     */
    public function create()
    {
        $parentCategories = Category::whereNull('parent_id')->get();
        return Inertia::render('ProductCatalog/Categories/Create', [
            'parentCategories' => $parentCategories
        ]);
    }

    /**
     * Show the form for editing the specified category
     */
    public function edit(Category $category)
    {
        $parentCategories = Category::whereNull('parent_id')
            ->where('id', '!=', $category->id)
            ->get();

        return Inertia::render('ProductCatalog/Categories/Edit', [
            'category' => $category,
            'parentCategories' => $parentCategories
        ]);
    }

    /**
     * Store a newly created category
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:categories,slug',
            'image' => 'nullable|image|max:2048',
            'parent_id' => 'nullable|exists:categories,id',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('assets/categories'), $filename);
            $validated['image'] = 'assets/categories/' . $filename;
        }

        Category::create($validated);

        return back()->with('success', 'Category created successfully!');
    }

    /**
     * Update the specified category
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:categories,slug,' . $category->id,
            'image' => 'nullable|image|max:2048',
            'parent_id' => 'nullable|exists:categories,id',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($category->image && file_exists(public_path($category->image))) {
                unlink(public_path($category->image));
            }

            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('assets/categories'), $filename);
            $validated['image'] = 'assets/categories/' . $filename;
        }

        $category->update($validated);

        return back()->with('success', 'Category updated successfully!');
    }

    /**
     * Remove the specified category
     */
    public function destroy(Category $category)
    {
        if ($category->children()->count() > 0) {
            return back()->with('error', 'Cannot delete category that has sub-categories!');
        }

        if ($category->products()->count() > 0) {
            return back()->with('error', 'Cannot delete category with existing products!');
        }

        // Delete image if exists
        if ($category->image && file_exists(public_path($category->image))) {
            unlink(public_path($category->image));
        }

        $category->delete();

        return back()->with('success', 'Category deleted successfully!');
    }

    /**
     * Activate a category
     */
    public function activate(Category $category)
    {
        $category->update(['is_active' => true]);

        return back()->with('success', 'Category activated successfully!');
    }

    /**
     * Dropdown list for selects (API endpoint)
     */
    public function dropdown(Request $request)
    {
        $query = Category::query();

        if (!$request->filled('include_all')) {
            $query->where('is_active', true);
        }

        if ($request->filled('parents_only')) {
            $query->whereNull('parent_id');
        }

        // Edit form ke liye — apni category ko parent se exclude karo
        if ($request->filled('exclude_id')) {
            $query->where('id', '!=', $request->exclude_id);
        }

        return response()->json(
            $query->select('id', 'name', 'slug', 'parent_id', 'is_active')
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
            'total' => Category::count(),
            'active' => Category::where('is_active', true)->count(),
            'inactive' => Category::where('is_active', false)->count(),
            'parents' => Category::whereNull('parent_id')->count(),
            'children' => Category::whereNotNull('parent_id')->count(),
        ]);
    }
}

