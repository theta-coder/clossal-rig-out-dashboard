<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of orders
     */
    public function index(Request $request)
    {
        // Mobile paginated JSON request
        if ($request->has('mobile') || ($request->ajax() && $request->get('page'))) {
            return $this->getMobileOrders($request);
        }

        // DataTables AJAX request
        if ($request->ajax() && $request->has('draw')) {
            return $this->getDataTablesOrders($request);
        }

        // Initial Inertia page load (React)
        return Inertia::render('Orders/Index');
    }

    /**
     * Mobile paginated response
     */
    private function getMobileOrders(Request $request)
    {
        $query = Order::with(['user', 'items']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('order_number', 'like', "%{$search}%");
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $perPage = $request->get('per_page', 10);
        $orders = $query->latest()->paginate($perPage);

        return response()->json($orders);
    }

    /**
     * DataTables server-side response
     */
    private function getDataTablesOrders(Request $request)
    {
        $query = Order::with(['user', 'items']);

        // Global search
        if ($request->filled('search.value')) {
            $search = $request->input('search.value');
            $query->where('order_number', 'like', "%{$search}%");
        }

        // Column filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $totalData = $query->count();

        // Sorting
        $orderColumn = $request->input('order.0.column', 5); // Default to created_at
        $orderDir = $request->input('order.0.dir', 'desc');
        $columns = ['id', 'order_number', 'user_id', 'total_amount', 'status', 'created_at'];

        if (isset($columns[$orderColumn])) {
            $query->orderBy($columns[$orderColumn], $orderDir);
        }

        // Pagination
        $start = $request->input('start', 0);
        $length = $request->input('length', 10);

        $orders = $query->skip($start)->take($length)->get();

        $data = $orders->map(function ($order, $index) use ($start) {
            return [
            'DT_RowIndex' => $start + $index + 1,
            'id' => $order->id,
            'order_number' => $order->order_number,
            'customer_name' => $order->user ? $order->user->name : 'Guest',
            'customer_email' => $order->user ? $order->user->email : 'N/A',
            'items_count' => $order->items->count(),
            'total_amount' => '$' . number_format($order->total_amount, 2),
            'status' => ucfirst($order->status),
            'created_at' => $order->created_at->format('M d, Y h:i A'),
            'action' => $order->id,
            ];
        });

        return response()->json([
            'draw' => intval($request->input('draw')),
            'recordsTotal' => $totalData,
            'recordsFiltered' => $totalData,
            'data' => $data,
        ]);
    }

    public function show(Order $order)
    {
        return Inertia::render('Orders/Show', [
            'order' => $order->load(['user', 'address', 'items.product']),
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:processing,shipped,delivered,cancelled',
            'notes' => 'nullable|string',
        ]);

        $order->update($validated);

        return back()->with('success', 'Order updated successfully.');
    }

    public function destroy(Order $order)
    {
        $order->delete();

        return back()->with('success', 'Order deleted successfully.');
    }
}
