<?php

namespace App\Http\Controllers\UserManagement;

use App\Http\Controllers\Controller;
use App\Models\UserManagement\TermsAcceptance;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TermsAcceptanceController extends Controller
{
    public function index(Request $request)
    {
        if ($request->wantsJson() && $request->has('draw')) {
            $query = TermsAcceptance::with('user');

            if ($search = $request->input('search.value')) {
                $query->where(function ($q) use ($search) {
                    $q->where('email', 'like', "%{$search}%")
                      ->orWhere('terms_version', 'like', "%{$search}%")
                      ->orWhere('ip_address', 'like', "%{$search}%")
                      ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$search}%"));
                });
            }

            if ($request->filled('type')) {
                $query->where('type', $request->type);
            }

            $total    = TermsAcceptance::count();
            $filtered = $query->count();
            $rows     = $query->orderBy('accepted_at', 'desc')
                ->skip($request->input('start', 0))
                ->take($request->input('length', 15))
                ->get();

            return response()->json([
                'draw'            => intval($request->draw),
                'recordsTotal'    => $total,
                'recordsFiltered' => $filtered,
                'data'            => $rows->map(function ($t, $i) use ($request) {
                    return [
                        'DT_RowIndex'   => $request->input('start', 0) + $i + 1,
                        'id'            => $t->id,
                        'user'          => $t->user?->name ?? 'Guest',
                        'email'         => $t->email ?? '—',
                        'terms_version' => $t->terms_version,
                        'type'          => str_replace('_', ' ', ucfirst($t->type)),
                        'ip_address'    => $t->ip_address ?? '—',
                        'accepted_at'   => \Carbon\Carbon::parse($t->accepted_at)->format('M d, Y H:i'),
                    ];
                }),
            ]);
        }

        if ($request->wantsJson()) {
            $terms = TermsAcceptance::with('user')->orderBy('accepted_at', 'desc')->paginate(20);
            return response()->json(['success' => true, 'data' => $terms]);
        }

        return Inertia::render('Users/TermsAcceptances/Index');
    }

    public function show($id)
    {
        $record = TermsAcceptance::with('user')->findOrFail($id);
        return Inertia::render('Users/TermsAcceptances/Show', ['record' => $record]);
    }
}
