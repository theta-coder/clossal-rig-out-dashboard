<?php

namespace App\Http\Controllers;

use App\Models\StockLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockLogController extends Controller
{
    /**
     * Display a listing of stock logs
     */
    public function index(Request $request)
    {
        if ($request->has('mobile') || ($request->ajax() && $request->get('page'))) {
            return $this->getMobileStockLogs($request);
        }

        if ($request->ajax() && $request->has('draw')) {
            return $this->getDataTablesStockLogs($request);
        }

        $query = StockLog::with(['product', 'variant', 'user', 'order']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('product', fn($q) => $q->where('name', 'like', "%{$search}%"));
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $logs = $query->latest()->paginate(50)->withQueryString();

        return Inertia::render('Inventory/StockLogs/Index', compact('logs'));
    }

    /**
     * Mobile paginated response
     */
    private function getMobileStockLogs(Request $request)
    {
        $query = StockLog::with(['product', 'user', 'order']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('product', fn($q) => $q->where('name', 'like', "%{$search}%"));
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $perPage = $request->get('per_page', 10);
        $logs = $query->latest()->paginate($perPage);

        return response()->json($logs);
    }

    /**
     * DataTables server-side response
     */
    private function getDataTablesStockLogs(Request $request)
    {
        $query = StockLog::with(['product', 'user', 'order']);

        if ($request->filled('search.value')) {
            $search = $request->input('search.value');
            $query->whereHas('product', fn($q) => $q->where('name', 'like', "%{$search}%"));
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $totalData = $query->count();

        $orderColumn = $request->input('order.0.column', 0);
        $orderDir    = $request->input('order.0.dir', 'desc');
        $columns     = ['id', 'product_id', 'type', 'quantity_before', 'quantity_change', 'quantity_after', 'created_at'];

        if (isset($columns[$orderColumn])) {
            $query->orderBy($columns[$orderColumn], $orderDir);
        }

        $start  = $request->input('start', 0);
        $length = $request->input('length', 10);

        $logs = $query->skip($start)->take($length)->get();

        $data = $logs->map(function ($log, $index) use ($start) {
            return [
                'DT_RowIndex'       => $start + $index + 1,
                'id'                => $log->id,
                'product'           => $log->product?->name ?? '—',
                'type'              => ucfirst($log->type),
                'quantity_before'   => $log->quantity_before,
                'quantity_change'   => ($log->quantity_change > 0 ? '+' : '') . $log->quantity_change,
                'quantity_after'    => $log->quantity_after,
                'reason'            => $log->reason ?? '—',
                'user'              => $log->user?->name ?? 'System',
                'order'             => $log->order?->order_number ?? '—',
                'created_at'        => $log->created_at->format('M d, Y h:i A'),
                'action'            => $log->id,
            ];
        });

        return response()->json([
            'draw'            => intval($request->input('draw')),
            'recordsTotal'    => $totalData,
            'recordsFiltered' => $totalData,
            'data'            => $data,
        ]);
    }

    /**
     * Display a single stock log entry
     */
    public function show(StockLog $stockLog)
    {
        return Inertia::render('Inventory/StockLogs/Show', [
            'log' => $stockLog->load(['product', 'variant', 'user', 'order']),
        ]);
    }
}
