<?php

namespace App\Http\Controllers\UserManagement;

use App\Http\Controllers\Controller;
use App\Models\UserManagement\UserActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class UserActivityLogController extends Controller
{
    public function index(Request $request)
    {
        if ($request->wantsJson() && $request->has('draw')) {
            $query = UserActivityLog::with('user');

            if ($search = $request->input('search.value')) {
                $query->where(function ($q) use ($search) {
                    $q->where('action', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhere('ip_address', 'like', "%{$search}%")
                      ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$search}%")
                                                        ->orWhere('email', 'like', "%{$search}%"));
                });
            }

            if ($request->filled('action')) {
                $query->where('action', $request->action);
            }

            if ($request->filled('user_id')) {
                $query->where('user_id', $request->user_id);
            }

            $total    = UserActivityLog::count();
            $filtered = $query->count();
            $rows     = $query->orderBy('created_at', 'desc')
                ->skip($request->input('start', 0))
                ->take($request->input('length', 15))
                ->get();

            return response()->json([
                'draw'            => intval($request->draw),
                'recordsTotal'    => $total,
                'recordsFiltered' => $filtered,
                'data'            => $rows->map(function ($l, $i) use ($request) {
                    return [
                        'DT_RowIndex' => $request->input('start', 0) + $i + 1,
                        'id'          => $l->id,
                        'user'        => $l->user?->name ?? 'Guest',
                        'user_id'     => $l->user_id,
                        'action'      => $l->action,
                        'description' => $l->description ? Str::limit($l->description, 60) : '—',
                        'ip_address'  => $l->ip_address ?? '—',
                        'created_at'  => \Carbon\Carbon::parse($l->created_at)->format('M d, Y H:i'),
                    ];
                }),
            ]);
        }

        if ($request->wantsJson()) {
            $logs = UserActivityLog::with('user')->orderBy('created_at', 'desc')->paginate(20);
            return response()->json(['success' => true, 'data' => $logs]);
        }

        return Inertia::render('Users/ActivityLogs/Index');
    }

    public function show($id)
    {
        $log = UserActivityLog::with('user')->findOrFail($id);
        return Inertia::render('Users/ActivityLogs/Show', ['log' => $log]);
    }
}
