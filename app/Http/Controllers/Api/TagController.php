<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductCatalog\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    /**
     * Get all tags
     */
    public function index()
    {
        $tags = Tag::withCount('products')->get()->map(function ($tag) {
            return [
            'id' => $tag->id,
            'name' => $tag->name,
            'slug' => $tag->slug,
            'products_count' => $tag->products_count,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $tags
        ]);
    }
}
