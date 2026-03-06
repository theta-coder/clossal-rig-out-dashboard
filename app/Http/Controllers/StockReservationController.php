<?php

namespace App\Http\Controllers;

use App\Models\StockReservation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockReservationController extends Controller
{
    /**
     * Display a listing of stock reservations
     */
    public function index(Request $request)
    {
        if ($request->has('mobile') || ($request->ajax() && $request->get('page'))) {
            return $this->getMobileReservations($request);
        }

        if ($request->ajax() && $request->has('draw')) {
            return $this->getDataTablesReservations($request);
        }

        return Inertia::render('Inventory/StockReservations/Index');
    }

    /**
     * Mobile paginated response
     */
    private function getMobileReservations(Request $request)
    {
        $query = StockReservation::with(['product', 'cart', 'order']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $perPage       = $request->get('per_page', 10);
        $reservations  = $query->latest()->paginate($perPage);

        return response()->json($reservations);
    }

    /**
     * DataTables server-side response
     */
    private function getDataTablesReservations(Request $request)
    {
        $query = StockReservation::with(['product', 'cart', 'order']);

        if ($request->filled('search.value')) {
            $search = $request->input('search.value');
            $query->whereHas('product', fn($q) => $q->where('name', 'like', "%{$search}%"));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $totalData = $query->count();

        $orderColumn = $request->input('order.0.column', 0);
        $orderDir    = $request->input('order.0.dir', 'desc');
        $columns     = ['id', 'product_id', 'quantity', 'status', 'expires_at', 'created_at'];

        if (isset($columns[$orderColumn])) {
            $query->orderBy($columns[$orderColumn], $orderDir);
        }

        $start  = $request->input('start', 0);
        $length = $request->input('length', 10);

        $reservations = $query->skip($start)->take($length)->get();

        $data = $reservations->map(function ($reservation, $index) use ($start) {
            return [
                'DT_RowIndex' => $start + $index + 1,
                'id'          => $reservation->id,
                'product'     => $reservation->product?->name ?? '—',
                'quantity'    => $reservation->quantity,
                'status'      => ucfirst($reservation->status),
                'order'       => $reservation->order?->order_number ?? '—',
                'expires_at'  => $reservation->expires_at?->format('M d, Y h:i A') ?? '—',
                'created_at'  => $reservation->created_at->format('M d, Y h:i A'),
                'action'      => $reservation->id,
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
     * Display a single stock reservation
     */
    public function show(StockReservation $stockReservation)
    {
        return Inertia::render('Inventory/StockReservations/Show', [
            'reservation' => $stockReservation->load(['product', 'variant', 'cart', 'order']),
        ]);
    }

    /**
     * Release (cancel) a reservation
     */
    public function destroy(StockReservation $stockReservation)
    {
        $stockReservation->delete();

        return back()->with('success', 'Stock reservation released successfully.');
    }
}
