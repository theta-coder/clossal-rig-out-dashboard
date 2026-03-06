<?php

namespace App\Http\Controllers\UserManagement;

use App\Http\Controllers\Controller;
use App\Models\UserManagement\Blacklist;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlacklistController extends Controller
{
    /**
     * Display a listing of blacklisted entries
     */
    public function index(Request $request)
    {
        // Mobile paginated JSON request
        if ($request->has('mobile') || ($request->ajax() && $request->get('page'))) {
            return $this->getMobileBlacklist($request);
        }

        // DataTables AJAX request
        if ($request->ajax() && $request->has('draw')) {
            return $this->getDataTablesBlacklist($request);
        }

        // Initial Inertia page load (React)
        return Inertia::render('UserManagement/Blacklist/Index');
    }

    /**
     * Mobile paginated response
     */
    private function getMobileBlacklist(Request $request)
    {
        $query = Blacklist::with('admin');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('value', 'like', "%{$search}%")
                    ->orWhere('reason', 'like', "%{$search}%");
            });
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $perPage = $request->get('per_page', 10);
        $entries = $query->latest()->paginate($perPage);

        return response()->json($entries);
    }

    /**
     * DataTables server-side response
     */
    private function getDataTablesBlacklist(Request $request)
    {
        $query = Blacklist::with('admin');

        // Global search
        if ($request->filled('search.value')) {
            $search = $request->input('search.value');
            $query->where(function ($q) use ($search) {
                $q->where('value', 'like', "%{$search}%")
                    ->orWhere('reason', 'like', "%{$search}%");
            });
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter by active status
        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $totalData = $query->count();

        // Sorting
        $orderColumn = $request->input('order.0.column', 0);
        $orderDir = $request->input('order.0.dir', 'desc');
        $columns = ['id', 'type', 'value', 'is_active', 'expires_at', 'created_at'];

        if (isset($columns[$orderColumn])) {
            $query->orderBy($columns[$orderColumn], $orderDir);
        }

        // Pagination
        $start = $request->input('start', 0);
        $length = $request->input('length', 10);

        $entries = $query->skip($start)->take($length)->get();

        $data = $entries->map(function ($entry, $index) use ($start) {
            return [
            'DT_RowIndex' => $start + $index + 1,
            'id' => $entry->id,
            'type' => $entry->type,
            'value' => $entry->value,
            'reason' => $entry->reason,
            'blacklisted_by' => $entry->admin ? $entry->admin->name : '—',
            'is_active' => $entry->is_active,
            'expires_at' => $entry->expires_at ? $entry->expires_at->format('M d, Y H:i') : 'Never',
            'created_at' => $entry->created_at->format('M d, Y'),
            'action' => $entry->id,
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
     * Store a newly created blacklist entry
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|in:email,phone,ip,user',
            'value' => 'required|string|max:255',
            'reason' => 'nullable|string|max:500',
            'is_active' => 'boolean',
            'expires_at' => 'nullable|date|after:now',
        ]);

        // Check for duplicate active entry
        $exists = Blacklist::where('type', $validated['type'])
            ->where('value', $validated['value'])
            ->where('is_active', true)
            ->exists();

        if ($exists) {
            return back()->with('error', 'This entry is already blacklisted.');
        }

        $validated['blacklisted_by'] = auth()->id();
        $validated['is_active'] = $validated['is_active'] ?? true;

        Blacklist::create($validated);

        return back()->with('success', 'Blacklist entry created successfully.');
    }

    /**
     * Update the specified blacklist entry
     */
    public function update(Request $request, Blacklist $blacklist)
    {
        $validated = $request->validate([
            'type' => 'required|string|in:email,phone,ip,user',
            'value' => 'required|string|max:255',
            'reason' => 'nullable|string|max:500',
            'is_active' => 'boolean',
            'expires_at' => 'nullable|date',
        ]);

        $blacklist->update($validated);

        return back()->with('success', 'Blacklist entry updated successfully.');
    }

    /**
     * Remove the specified blacklist entry
     */
    public function destroy(Blacklist $blacklist)
    {
        $blacklist->delete();
        return back()->with('success', 'Blacklist entry removed successfully.');
    }

    /**
     * Toggle active/inactive status
     */
    public function toggleActive(Blacklist $blacklist)
    {
        $blacklist->update(['is_active' => !$blacklist->is_active]);

        $status = $blacklist->is_active ? 'activated' : 'deactivated';
        return back()->with('success', "Blacklist entry {$status} successfully.");
    }

    /**
     * Quick stats summary
     */
    public function summary()
    {
        return response()->json([
            'total' => Blacklist::count(),
            'active' => Blacklist::where('is_active', true)->count(),
            'inactive' => Blacklist::where('is_active', false)->count(),
            'by_type' => [
                'email' => Blacklist::where('type', 'email')->where('is_active', true)->count(),
                'phone' => Blacklist::where('type', 'phone')->where('is_active', true)->count(),
                'ip' => Blacklist::where('type', 'ip')->where('is_active', true)->count(),
                'user' => Blacklist::where('type', 'user')->where('is_active', true)->count(),
            ],
        ]);
    }
}
