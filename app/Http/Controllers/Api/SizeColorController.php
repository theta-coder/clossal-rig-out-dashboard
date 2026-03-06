<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductCatalog\Size;
use App\Models\ProductCatalog\Color;

class SizeColorController extends Controller
{
    /**
     * Get all sizes
     */
    public function sizes()
    {
        $sizes = Size::orderBy('name')->get(['id', 'name']);

        return response()->json([
            'success' => true,
            'data' => $sizes,
        ]);
    }

    /**
     * Get all colors
     */
    public function colors()
    {
        $colors = Color::orderBy('name')->get(['id', 'name', 'code']);

        return response()->json([
            'success' => true,
            'data' => $colors,
        ]);
    }
}



