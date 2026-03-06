<?php

namespace App\Http\Controllers\UserManagement;

use App\Models\UserManagement\User;
use App\Models\UserManagement\Address;
use App\Models\UserManagement\SocialLogin;
use App\Models\UserManagement\OtpVerification;
use App\Models\UserManagement\TermsAcceptance;
use App\Models\UserManagement\DeviceToken;
use App\Models\UserManagement\UserActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

use App\Http\Controllers\Controller;

class UserController extends Controller
{
    /**
     * Display a listing of users
     */
    public function index(Request $request)
    {
        // Mobile paginated JSON request
        if ($request->has('mobile') || ($request->ajax() && $request->get('page'))) {
            return $this->getMobileUsers($request);
        }

        // DataTables AJAX request
        if ($request->ajax() && $request->has('draw')) {
            return $this->getDataTablesUsers($request);
        }

        // Initial Inertia page load (React)
        return Inertia::render('UserManagement/Users/Index');
    }

    /**
     * Mobile paginated response
     */
    private function getMobileUsers(Request $request)
    {
        $query = User::withCount(['orders', 'favorites']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->filled('role')) {
            $query->role($request->role);
        }

        if ($request->filled('is_blocked')) {
            $query->where('is_blocked', $request->is_blocked);
        }

        $perPage = $request->get('per_page', 10);
        $users = $query->latest()->paginate($perPage);

        return response()->json($users);
    }

    /**
     * DataTables server-side response
     */
    private function getDataTablesUsers(Request $request)
    {
        $query = User::withCount(['orders', 'favorites', 'socialLogins', 'deviceTokens']);

        // Global search
        if ($request->filled('search.value')) {
            $search = $request->input('search.value');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->filled('role')) {
            $query->role($request->role);
        }

        // Filter by blocked status
        if ($request->filled('is_blocked')) {
            $query->where('is_blocked', $request->is_blocked);
        }

        $totalData = $query->count();

        // Sorting
        $orderColumn = $request->input('order.0.column', 3);
        $orderDir = $request->input('order.0.dir', 'desc');
        $columns = ['id', 'name', 'email', 'created_at', 'total_orders', 'total_spent'];

        if (isset($columns[$orderColumn])) {
            $query->orderBy($columns[$orderColumn], $orderDir);
        }

        // Pagination
        $start = $request->input('start', 0);
        $length = $request->input('length', 10);

        $users = $query->skip($start)->take($length)->get();

        $data = $users->map(function ($user, $index) use ($start) {
            return [
            'DT_RowIndex' => $start + $index + 1,
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->getRoleNames()->first(),
            'is_blocked' => $user->is_blocked,
            'orders_count' => $user->orders_count,
            'favorites_count' => $user->favorites_count,
            'social_logins_count' => $user->social_logins_count,
            'device_tokens_count' => $user->device_tokens_count,
            'total_spent' => $user->total_spent,
            'created_at' => $user->created_at->format('M d, Y'),
            'action' => $user->id,
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
        return Inertia::render('UserManagement/Users/Create', [
            'roles' => \Spatie\Permission\Models\Role::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
            'gender' => 'nullable|string|in:male,female,other',
            'date_of_birth' => 'nullable|date',
            'role' => 'required|string|exists:roles,name',
        ]);

        $roleName = $validated['role'];
        unset($validated['role']);
        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);
        $user->assignRole($roleName);

        return back()->with('success', 'User created successfully.');
    }

    /**
     * Show user detail with all related identity & security data
     */
    public function show(User $user)
    {
        return Inertia::render('UserManagement/Users/Show', [
            'user' => $user->load([
                'orders.items',
                'addresses',
                'favorites.product',
                'reviews',
                'socialLogins',
                'otpVerifications',
                'termsAcceptances',
                'deviceTokens',
                'activityLogs' => function ($query) {
            $query->latest('created_at')->limit(50);
        },
            ]),
            'roles' => $user->getRoleNames(),
        ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('UserManagement/Users/Edit', [
            'user' => $user,
            'userRole' => $user->getRoleNames()->first(),
            'roles' => \Spatie\Permission\Models\Role::all(),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
            'gender' => 'nullable|string|in:male,female,other',
            'date_of_birth' => 'nullable|date',
            'role' => 'required|string|exists:roles,name',
        ]);

        $roleName = $validated['role'];
        unset($validated['role']);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }
        else {
            unset($validated['password']);
        }

        $user->update($validated);
        $user->syncRoles($roleName);

        return back()->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        if ($user->hasRole('admin') && User::role('admin')->count() <= 1) {
            return back()->with('error', 'Cannot delete the last admin user.');
        }
        $user->delete();
        return back()->with('success', 'User deleted successfully.');
    }

    /**
     * Toggle block/unblock user
     */
    public function toggleBlock(User $user)
    {
        if ($user->hasRole('admin')) {
            return back()->with('error', 'Cannot block an admin user.');
        }

        $user->update(['is_blocked' => !$user->is_blocked]);

        $status = $user->is_blocked ? 'blocked' : 'unblocked';
        return back()->with('success', "User {$status} successfully.");
    }

    /**
     * Remove a specific device token for a user
     */
    public function removeDeviceToken(User $user, DeviceToken $deviceToken)
    {
        if ($deviceToken->user_id !== $user->id) {
            return back()->with('error', 'Device token does not belong to this user.');
        }

        $deviceToken->delete();
        return back()->with('success', 'Device token removed successfully.');
    }

    /**
     * Dropdown list for selects (API endpoint)
     */
    public function dropdown(Request $request)
    {
        $query = User::query();

        if ($request->filled('role')) {
            $query->role($request->role);
        }

        if ($request->filled('is_blocked')) {
            $query->where('is_blocked', $request->is_blocked);
        }

        if ($request->filled('exclude_id')) {
            $query->where('id', '!=', $request->exclude_id);
        }

        return response()->json(
            $query->select('id', 'name', 'email', 'phone')
            ->orderBy('name')
            ->get()
        );
    }

    /**
     * Quick stats summary
     */
    public function summary()
    {
        return response()->json([
            'total' => User::count(),
            'active' => User::where('is_blocked', false)->count(),
            'blocked' => User::where('is_blocked', true)->count(),
            'admins' => User::role('admin')->count(),
            'customers' => User::role('customer')->count(),
            'with_social_login' => User::has('socialLogins')->count(),
        ]);
    }
}
