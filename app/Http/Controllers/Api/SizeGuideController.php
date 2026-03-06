<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductCatalog\SizeGuide;
use Illuminate\Http\Request;

class SizeGuideController extends Controller
{
    /**
     * Get all active size guides
     */
    public function index()
    {
        $sizeGuides = SizeGuide::with(['rows' => function ($q) {
            $q->orderBy('sort_order');
        }])
            ->where('is_active', true)
            ->get()
            ->map(function ($guide) {
            return [
            'id' => $guide->id,
            'name' => $guide->name,
            'columns' => $guide->columns,
            'measurements' => $guide->rows->map(function ($row) {
                    return array_merge(['Size' => $row->size_label], $row->measurements);
                }
                ),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $sizeGuides
        ]);
    }

    /**
     * Get a single size guide
     */
    public function show($id)
    {
        $guide = SizeGuide::with(['rows' => function ($q) {
            $q->orderBy('sort_order');
        }])
            ->where('is_active', true)
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $guide->id,
                'name' => $guide->name,
                'columns' => $guide->columns,
                'measurements' => $guide->rows->map(function ($row) {
            return array_merge(['Size' => $row->size_label], $row->measurements);
        }),
            ]
        ]);
    }
}
