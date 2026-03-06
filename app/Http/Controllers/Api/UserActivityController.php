<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SearchLog;
use App\Models\ProductView;
use Illuminate\Http\Request;

class UserActivityController extends Controller
{
    /**
     * Log a search query
     */
    public function logSearch(Request $request)
    {
        $validated = $request->validate([
            'query' => 'required|string|max:255',
            'results_count' => 'required|integer',
            'ip_address' => 'nullable|string'
        ]);

        $user = $request->user('sanctum');

        $log = SearchLog::create([
            'user_id' => $user ? $user->id : null,
            'query' => $validated['query'],
            'results_count' => $validated['results_count'],
            'ip_address' => $validated['ip_address'] ?? $request->ip()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Search query logged'
        ]);
    }

    /**
     * Log a product view
     */
    public function logProductView(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'session_id' => 'required|string',
            'source' => 'nullable|string',
            'viewed_at' => 'nullable|date'
        ]);

        $user = $request->user('sanctum');

        $view = ProductView::create([
            'product_id' => $validated['product_id'],
            'user_id' => $user ? $user->id : null,
            'session_id' => $validated['session_id'],
            'ip_address' => $request->ip(),
            'source' => $validated['source'] ?? 'organic',
            'viewed_at' => $validated['viewed_at'] ?? now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product view logged'
        ]);
    }
}
