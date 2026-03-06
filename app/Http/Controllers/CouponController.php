<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CouponController extends Controller
{
    /**
     * Display a listing of coupons
     */
    public function index(Request $request)
    {
        // Mobile paginated JSON request
        if ($request->has('mobile') || ($request->ajax() && $request->get('page'))) {
            return $this->getMobileCoupons($request);
        }

        // DataTables AJAX request
        if ($request->ajax() && $request->has('draw')) {
            return $this->getDataTablesCoupons($request);
        }

        // Initial Inertia page load (React)
        return Inertia::render('Coupons/Index');
    }

    /**
     * Mobile paginated response
     */
    private function getMobileCoupons(Request $request)
    {
        $query = Coupon::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('code', 'like', "%{$search}%");
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $perPage = $request->get('per_page', 10);
        $coupons = $query->latest()->paginate($perPage);

        return response()->json($coupons);
    }

    /**
     * DataTables server-side response
     */
    private function getDataTablesCoupons(Request $request)
    {
        $query = Coupon::query();

        // Global search
        if ($request->filled('search.value')) {
            $search = $request->input('search.value');
            $query->where('code', 'like', "%{$search}%");
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $totalData = $query->count();

        // Sorting
        $orderColumn = $request->input('order.0.column', 0);
        $orderDir = $request->input('order.0.dir', 'desc');
        $columns = ['id', 'code', 'discount_value', 'min_order_amount', 'expires_at', 'is_active'];

        if (isset($columns[$orderColumn])) {
            $query->orderBy($columns[$orderColumn], $orderDir);
        }

        // Pagination
        $start = $request->input('start', 0);
        $length = $request->input('length', 10);

        $coupons = $query->skip($start)->take($length)->get();

        $data = $coupons->map(function ($coupon, $index) use ($start) {
            return [
            'DT_RowIndex' => $start + $index + 1,
            'id' => $coupon->id,
            'code' => $coupon->code,
            'discount_value' => $coupon->discount_type === 'percentage' ? $coupon->discount_value . '%' : '$' . number_format($coupon->discount_value, 2),
            'min_order_amount' => $coupon->min_order_amount ? '$' . number_format($coupon->min_order_amount, 2) : '—',
            'expires_at' => $coupon->expires_at ? $coupon->expires_at->format('M d, Y') : 'Never',
            'is_active' => $coupon->is_active ? 'Active' : 'Inactive',
            'action' => $coupon->id,
            ];
        });

        return response()->json([
            'draw' => intval($request->input('draw')),
            'recordsTotal' => $totalData,
            'recordsFiltered' => $totalData,
            'data' => $data,
        ]);
    }

    public function create()
    {
        return Inertia::render('Coupons/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:coupons,code',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
            'expires_at' => 'nullable|date|after:now',
        ]);

        Coupon::create($validated);

        return back()->with('success', 'Coupon created successfully.');
    }

    public function edit(Coupon $coupon)
    {
        return Inertia::render('Coupons/Edit', [
            'coupon' => $coupon,
        ]);
    }

    public function update(Request $request, Coupon $coupon)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:coupons,code,' . $coupon->id,
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
            'expires_at' => 'nullable|date',
        ]);

        $coupon->update($validated);

        return back()->with('success', 'Coupon updated successfully.');
    }

    public function destroy(Coupon $coupon)
    {
        $coupon->delete();

        return back()->with('success', 'Coupon deleted successfully.');
    }
}


