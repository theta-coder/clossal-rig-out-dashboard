<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Get all active categories with their active subcategories
     */
    public function index()
    {
        $categories = Category::with(['children' => function ($query) {
            $query->where('is_active', true);
        }])
            ->whereNull('parent_id')
            ->where('is_active', true)
            ->get()
            ->map(function ($category) {
            return [
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
            'image' => $category->image ? url($category->image) : null,
            'subcategories' => $category->children->map(function ($child) {
                    return [
                    'id' => $child->id,
                    'name' => $child->name,
                    'slug' => $child->slug,
                    'image' => $child->image ? url($child->image) : null,
                    ];
                }
                )->values()
                ];
            });

        return response()->json([
            'success' => true,
            'message' => 'Categories fetched successfully',
            'data' => $categories
        ]);
    }
}
