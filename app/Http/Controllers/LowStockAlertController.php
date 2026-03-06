<?php

namespace App\Http\Controllers;

use App\Models\LowStockAlert;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LowStockAlertController extends Controller
{
    /**
     * Display a listing of low stock alerts
     */
    public function index(Request $request)
    {
        if ($request->has('mobile') || ($request->ajax() && $request->get('page'))) {
            return $this->getMobileAlerts($request);
        }

        if ($request->ajax() && $request->has('draw')) {
            return $this->getDataTablesAlerts($request);
        }

        return Inertia::render('Inventory/LowStockAlerts/Index');
    }

    /**
     * Mobile paginated response
     */
    private function getMobileAlerts(Request $request)
    {
        $query = LowStockAlert::with(['product', 'variant']);

        if ($request->filled('is_alerted')) {
            $query->where('is_alerted', $request->boolean('is_alerted'));
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('product', fn($q) => $q->where('name', 'like', "%{$search}%"));
        }

        $perPage = $request->get('per_page', 10);
        $alerts  = $query->latest()->paginate($perPage);

        return response()->json($alerts);
    }

    /**
     * DataTables server-side response
     */
    private function getDataTablesAlerts(Request $request)
    {
        $query = LowStockAlert::with(['product', 'variant']);

        if ($request->filled('search.value')) {
            $search = $request->input('search.value');
            $query->whereHas('product', fn($q) => $q->where('name', 'like', "%{$search}%"));
        }

        if ($request->filled('is_alerted')) {
            $query->where('is_alerted', $request->boolean('is_alerted'));
        }

        $totalData = $query->count();

        $orderColumn = $request->input('order.0.column', 0);
        $orderDir    = $request->input('order.0.dir', 'desc');
        $columns     = ['id', 'product_id', 'threshold', 'is_alerted', 'last_alerted_at'];

        if (isset($columns[$orderColumn])) {
            $query->orderBy($columns[$orderColumn], $orderDir);
        }

        $start  = $request->input('start', 0);
        $length = $request->input('length', 10);

        $alerts = $query->skip($start)->take($length)->get();

        $data = $alerts->map(function ($alert, $index) use ($start) {
            return [
                'DT_RowIndex'     => $start + $index + 1,
                'id'              => $alert->id,
                'product'         => $alert->product?->name ?? '—',
                'variant'         => $alert->variant?->name ?? '—',
                'threshold'       => $alert->threshold,
                'is_alerted'      => $alert->is_alerted ? 'Yes' : 'No',
                'last_alerted_at' => $alert->last_alerted_at?->format('M d, Y h:i A') ?? 'Never',
                'action'          => $alert->id,
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
     * Show form to create a new low stock alert
     */
    public function create()
    {
        return Inertia::render('Inventory/LowStockAlerts/Create');
    }

    /**
     * Store a newly created low stock alert
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id',
            'threshold'  => 'required|integer|min:1',
        ]);

        LowStockAlert::create($validated);

        return back()->with('success', 'Low stock alert created successfully.');
    }

    /**
     * Show form to edit a low stock alert
     */
    public function edit(LowStockAlert $lowStockAlert)
    {
        return Inertia::render('Inventory/LowStockAlerts/Edit', [
            'alert' => $lowStockAlert->load(['product', 'variant']),
        ]);
    }

    /**
     * Update the low stock alert threshold
     */
    public function update(Request $request, LowStockAlert $lowStockAlert)
    {
        $validated = $request->validate([
            'threshold'  => 'required|integer|min:1',
            'is_alerted' => 'boolean',
        ]);

        $lowStockAlert->update($validated);

        return back()->with('success', 'Low stock alert updated successfully.');
    }

    /**
     * Delete a low stock alert
     */
    public function destroy(LowStockAlert $lowStockAlert)
    {
        $lowStockAlert->delete();

        return back()->with('success', 'Low stock alert deleted successfully.');
    }
}
