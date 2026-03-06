<?php

namespace App\Http\Controllers\UserManagement;

use App\Http\Controllers\Controller;
use App\Models\UserManagement\OtpVerification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OtpVerificationController extends Controller
{
    public function index(Request $request)
    {
        if ($request->wantsJson() && $request->has('draw')) {
            $query = OtpVerification::query();

            if ($search = $request->input('search.value')) {
                $query->where(function ($q) use ($search) {
                    $q->where('phone', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('ip_address', 'like', "%{$search}%");
                });
            }

            if ($request->filled('type')) {
                $query->where('type', $request->type);
            }

            if ($request->filled('is_used')) {
                $query->where('is_used', $request->is_used);
            }

            $total    = OtpVerification::count();
            $filtered = $query->count();
            $rows     = $query->orderBy('created_at', 'desc')
                ->skip($request->input('start', 0))
                ->take($request->input('length', 15))
                ->get();

            return response()->json([
                'draw'            => intval($request->draw),
                'recordsTotal'    => $total,
                'recordsFiltered' => $filtered,
                'data'            => $rows->map(function ($o, $i) use ($request) {
                    $expired = \Carbon\Carbon::parse($o->expires_at)->isPast();
                    return [
                        'DT_RowIndex' => $request->input('start', 0) + $i + 1,
                        'id'          => $o->id,
                        'identifier'  => $o->email ?? $o->phone ?? '—',
                        'type'        => str_replace('_', ' ', ucfirst($o->type)),
                        'attempts'    => $o->attempts,
                        'is_used'     => $o->is_used ? 'Used' : ($expired ? 'Expired' : 'Pending'),
                        'ip_address'  => $o->ip_address ?? '—',
                        'expires_at'  => \Carbon\Carbon::parse($o->expires_at)->format('M d, Y H:i'),
                        'created_at'  => \Carbon\Carbon::parse($o->created_at)->format('M d, Y H:i'),
                    ];
                }),
            ]);
        }

        if ($request->wantsJson()) {
            $otps = OtpVerification::orderBy('created_at', 'desc')->paginate(20);
            return response()->json(['success' => true, 'data' => $otps]);
        }

        return Inertia::render('Users/OtpVerifications/Index');
    }

    public function show($id)
    {
        $otp = OtpVerification::findOrFail($id);
        return Inertia::render('Users/OtpVerifications/Show', ['otp' => $otp]);
    }
}
