<?php

namespace App\Http\Controllers;

use App\Models\SearchLog;
use App\Models\ProductView;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ActivityReportController extends Controller
{
    /**
     * Display a listing of user activity reports (search logs, views)
     */
    public function index()
    {
        // Popular search queries
        $popularSearches = SearchLog::select('query', DB::raw('count(*) as count'), DB::raw('avg(results_count) as avg_results'))
            ->groupBy('query')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        // Top viewed products
        $topViewedProducts = ProductView::select('product_id', DB::raw('count(*) as count'))
            ->with('product:id,name,price')
            ->groupBy('product_id')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        return Inertia::render('Reports/Activity/Index', [
            'popularSearches' => $popularSearches,
            'topViewedProducts' => $topViewedProducts
        ]);
    }

    /**
     * Show search log details
     */
    public function searchLogs()
    {
        $logs = SearchLog::with('user:id,name,email')
            ->latest('searched_at')
            ->paginate(30);

        return Inertia::render('Reports/Activity/SearchLogs', [
            'logs' => $logs
        ]);
    }

    /**
     * Show detailed product view logs
     */
    public function viewLogs()
    {
        $logs = ProductView::with(['product:id,name', 'user:id,name'])
            ->latest('viewed_at')
            ->paginate(30);

        return Inertia::render('Reports/Activity/ViewLogs', [
            'logs' => $logs
        ]);
    }

    /**
     * Clear old activity logs (e.g., older than 30 days)
     */
    public function clean()
    {
        SearchLog::where('searched_at', '<', now()->subDays(30))->delete();
        ProductView::where('viewed_at', '<', now()->subDays(30))->delete();

        return redirect()->back()->with('success', 'Old logs cleared successfully');
    }
}
