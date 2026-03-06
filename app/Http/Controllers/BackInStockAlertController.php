<?php

namespace App\Http\Controllers;

use App\Models\BackInStockAlert;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BackInStockAlertController extends Controller
{
    /**
     * Display a listing of back-in-stock alerts
     */
    public function index(Request $request)
    {
        if ($request->has('mobile') || ($request->ajax() && $request->get('page'))) {
            return $this->getMobileAlerts($request);
        }

        if ($request->ajax() && $request->has('draw')) {
            return $this->getDataTablesAlerts($request);
        }

        return Inertia::render('Inventory/BackInStockAlerts/Index');
    }

    /**
     * Mobile paginated response
     */
    private function getMobileAlerts(Request $request)
    {
        $query = BackInStockAlert::with(['product', 'user']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('email', 'like', "%{$search}%")
                  ->orWhereHas('product', fn($q) => $q->where('name', 'like', "%{$search}%"));
            });
        }

        if ($request->filled('is_notified')) {
            $query->where('is_notified', $request->boolean('is_notified'));
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
        $query = BackInStockAlert::with(['product', 'user']);

        if ($request->filled('search.value')) {
            $search = $request->input('search.value');
            $query->where(function ($q) use ($search) {
                $q->where('email', 'like', "%{$search}%")
                  ->orWhereHas('product', fn($q) => $q->where('name', 'like', "%{$search}%"));
            });
        }

        if ($request->filled('is_notified')) {
            $query->where('is_notified', $request->boolean('is_notified'));
        }

        $totalData = $query->count();

        $orderColumn = $request->input('order.0.column', 0);
        $orderDir    = $request->input('order.0.dir', 'desc');
        $columns     = ['id', 'product_id', 'email', 'notify_via', 'is_notified', 'notified_at', 'created_at'];

        if (isset($columns[$orderColumn])) {
            $query->orderBy($columns[$orderColumn], $orderDir);
        }

        $start  = $request->input('start', 0);
        $length = $request->input('length', 10);

        $alerts = $query->skip($start)->take($length)->get();

        $data = $alerts->map(function ($alert, $index) use ($start) {
            return [
                'DT_RowIndex'  => $start + $index + 1,
                'id'           => $alert->id,
                'product'      => $alert->product?->name ?? '—',
                'customer'     => $alert->user?->name ?? $alert->email ?? '—',
                'email'        => $alert->email ?? '—',
                'phone'        => $alert->phone ?? '—',
                'notify_via'   => ucfirst($alert->notify_via),
                'is_notified'  => $alert->is_notified ? 'Yes' : 'Pending',
                'notified_at'  => $alert->notified_at?->format('M d, Y h:i A') ?? '—',
                'created_at'   => $alert->created_at->format('M d, Y h:i A'),
                'action'       => $alert->id,
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
     * Display a single back-in-stock alert
     */
    public function show(BackInStockAlert $backInStockAlert)
    {
        return Inertia::render('Inventory/BackInStockAlerts/Show', [
            'alert' => $backInStockAlert->load(['product', 'variant', 'user']),
        ]);
    }

    /**
     * Mark alert as notified
     */
    public function update(Request $request, BackInStockAlert $backInStockAlert)
    {
        $backInStockAlert->update([
            'is_notified' => true,
            'notified_at' => now(),
        ]);

        return back()->with('success', 'Alert marked as notified.');
    }

    /**
     * Delete a back-in-stock alert
     */
    public function destroy(BackInStockAlert $backInStockAlert)
    {
        $backInStockAlert->delete();

        return back()->with('success', 'Back-in-stock alert deleted successfully.');
    }
}
