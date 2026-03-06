<?php

namespace App\Http\Controllers\UserManagement;

use App\Http\Controllers\Controller;
use App\Models\UserManagement\Address;
use App\Models\UserManagement\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AddressController extends Controller
{
    /**
     * Display a listing of addresses
     */
    public function index(Request $request)
    {
        // Mobile paginated JSON request
        if ($request->has('mobile') || ($request->ajax() && $request->get('page'))) {
            return $this->getMobileAddresses($request);
        }

        // DataTables AJAX request
        if ($request->ajax() && $request->has('draw')) {
            return $this->getDataTablesAddresses($request);
        }

        // Initial Inertia page load (React)
        return Inertia::render('UserManagement/Addresses/Index');
    }

    /**
     * Mobile paginated response
     */
    private function getMobileAddresses(Request $request)
    {
        $query = Address::with('user');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                    $uq->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                }
                );
            });
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $perPage = $request->get('per_page', 10);
        $addresses = $query->latest()->paginate($perPage);

        return response()->json($addresses);
    }

    /**
     * DataTables server-side response
     */
    private function getDataTablesAddresses(Request $request)
    {
        $query = Address::with('user');

        // Global search
        if ($request->filled('search.value')) {
            $search = $request->input('search.value');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                    $uq->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                }
                );
            });
        }

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $totalData = $query->count();

        // Sorting
        $orderColumn = $request->input('order.0.column', 0);
        $orderDir = $request->input('order.0.dir', 'desc');
        $columns = ['id', 'name', 'city', 'type', 'is_default', 'created_at'];

        if (isset($columns[$orderColumn])) {
            $query->orderBy($columns[$orderColumn], $orderDir);
        }

        // Pagination
        $start = $request->input('start', 0);
        $length = $request->input('length', 10);

        $addresses = $query->skip($start)->take($length)->get();

        $data = $addresses->map(function ($address, $index) use ($start) {
            return [
            'DT_RowIndex' => $start + $index + 1,
            'id' => $address->id,
            'user_name' => $address->user ? $address->user->name : '—',
            'user_email' => $address->user ? $address->user->email : '—',
            'name' => $address->name,
            'street' => $address->street,
            'city' => $address->city,
            'zip' => $address->zip,
            'phone' => $address->phone,
            'type' => $address->type,
            'is_default' => $address->is_default,
            'created_at' => $address->created_at->format('M d, Y'),
            'action' => $address->id,
            ];
        });

        return response()->json([
            'draw' => intval($request->input('draw')),
            'recordsTotal' => $totalData,
            'recordsFiltered' => $totalData,
            'data' => $data,
        ]);
    }

    /**
     * Show the form for creating a new address
     */
    public function create()
    {
        return Inertia::render('UserManagement/Addresses/Create', [
            'users' => User::select('id', 'name', 'email')->orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created address
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'email' => 'nullable|email|max:255',
            'type' => 'required|string|in:shipping,billing',
            'name' => 'required|string|max:255',
            'street' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'zip' => 'nullable|string|max:20',
            'phone' => 'nullable|string|max:20',
            'is_default' => 'boolean',
        ]);

        // If setting as default, unset other defaults for this user + type
        if (!empty($validated['is_default'])) {
            Address::where('user_id', $validated['user_id'])
                ->where('type', $validated['type'])
                ->update(['is_default' => false]);
        }

        Address::create($validated);

        return back()->with('success', 'Address created successfully.');
    }

    /**
     * Display the specified address
     */
    public function show(Address $address)
    {
        return Inertia::render('UserManagement/Addresses/Show', [
            'address' => $address->load(['user', 'orders']),
        ]);
    }

    /**
     * Show the form for editing the specified address
     */
    public function edit(Address $address)
    {
        return Inertia::render('UserManagement/Addresses/Edit', [
            'address' => $address,
            'users' => User::select('id', 'name', 'email')->orderBy('name')->get(),
        ]);
    }

    /**
     * Update the specified address
     */
    public function update(Request $request, Address $address)
    {
        $validated = $request->validate([
            'email' => 'nullable|email|max:255',
            'type' => 'required|string|in:shipping,billing',
            'name' => 'required|string|max:255',
            'street' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'zip' => 'nullable|string|max:20',
            'phone' => 'nullable|string|max:20',
            'is_default' => 'boolean',
        ]);

        // If setting as default, unset other defaults for this user + type
        if (!empty($validated['is_default'])) {
            Address::where('user_id', $address->user_id)
                ->where('type', $validated['type'])
                ->where('id', '!=', $address->id)
                ->update(['is_default' => false]);
        }

        $address->update($validated);

        return back()->with('success', 'Address updated successfully.');
    }

    /**
     * Remove the specified address
     */
    public function destroy(Address $address)
    {
        $address->delete();
        return back()->with('success', 'Address deleted successfully.');
    }

    /**
     * Set address as default
     */
    public function setDefault(Address $address)
    {
        // Unset other defaults for same user + type
        Address::where('user_id', $address->user_id)
            ->where('type', $address->type)
            ->where('id', '!=', $address->id)
            ->update(['is_default' => false]);

        $address->update(['is_default' => true]);

        return back()->with('success', 'Default address updated successfully.');
    }

    /**
     * Quick stats summary
     */
    public function summary()
    {
        return response()->json([
            'total' => Address::count(),
            'shipping' => Address::where('type', 'shipping')->count(),
            'billing' => Address::where('type', 'billing')->count(),
            'default' => Address::where('is_default', true)->count(),
        ]);
    }
}
