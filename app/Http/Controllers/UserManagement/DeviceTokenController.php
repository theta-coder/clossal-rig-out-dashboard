<?php

namespace App\Http\Controllers\UserManagement;

use App\Http\Controllers\Controller;
use App\Models\UserManagement\DeviceToken;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeviceTokenController extends Controller
{
    public function index(Request $request)
    {
        if ($request->wantsJson() && $request->has('draw')) {
            $query = DeviceToken::with('user');

            if ($search = $request->input('search.value')) {
                $query->where(function ($q) use ($search) {
                    $q->where('device_name', 'like', "%{$search}%")
                      ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$search}%")
                                                        ->orWhere('email', 'like', "%{$search}%"));
                });
            }

            if ($request->filled('platform')) {
                $query->where('platform', $request->platform);
            }

            if ($request->filled('is_active')) {
                $query->where('is_active', $request->is_active);
            }

            $total    = DeviceToken::count();
            $filtered = $query->count();
            $rows     = $query->orderBy('created_at', 'desc')
                ->skip($request->input('start', 0))
                ->take($request->input('length', 15))
                ->get();

            return response()->json([
                'draw'            => intval($request->draw),
                'recordsTotal'    => $total,
                'recordsFiltered' => $filtered,
                'data'            => $rows->map(function ($d, $i) use ($request) {
                    return [
                        'DT_RowIndex'  => $request->input('start', 0) + $i + 1,
                        'id'           => $d->id,
                        'user'         => $d->user?->name ?? '—',
                        'user_id'      => $d->user_id,
                        'platform'     => ucfirst($d->platform),
                        'device_name'  => $d->device_name ?? '—',
                        'is_active'    => $d->is_active ? 'Active' : 'Inactive',
                        'last_used_at' => $d->last_used_at
                            ? \Carbon\Carbon::parse($d->last_used_at)->format('M d, Y H:i')
                            : '—',
                        'created_at'   => $d->created_at->format('M d, Y'),
                    ];
                }),
            ]);
        }

        if ($request->wantsJson()) {
            $tokens = DeviceToken::with('user')->orderBy('created_at', 'desc')->paginate(20);
            return response()->json(['success' => true, 'data' => $tokens]);
        }

        return Inertia::render('Users/DeviceTokens/Index');
    }

    public function show($id)
    {
        $token = DeviceToken::with('user')->findOrFail($id);
        return Inertia::render('Users/DeviceTokens/Show', ['token' => $token]);
    }

    public function update(Request $request, $id)
    {
        $token = DeviceToken::findOrFail($id);
        $token->is_active = !$token->is_active;
        $token->save();
        return back()->with('success', $token->is_active ? 'Token activated.' : 'Token deactivated.');
    }

    public function destroy($id)
    {
        DeviceToken::findOrFail($id)->delete();
        return redirect('/device-tokens')->with('success', 'Device token removed.');
    }
}
