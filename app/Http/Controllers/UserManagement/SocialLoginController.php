<?php

namespace App\Http\Controllers\UserManagement;

use App\Http\Controllers\Controller;
use App\Models\UserManagement\SocialLogin;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SocialLoginController extends Controller
{
    public function index(Request $request)
    {
        if ($request->wantsJson() && $request->has('draw')) {
            $query = SocialLogin::with('user');

            if ($search = $request->input('search.value')) {
                $query->where(function ($q) use ($search) {
                    $q->where('provider_email', 'like', "%{$search}%")
                      ->orWhere('provider', 'like', "%{$search}%")
                      ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$search}%")
                                                        ->orWhere('email', 'like', "%{$search}%"));
                });
            }

            if ($request->filled('provider')) {
                $query->where('provider', $request->provider);
            }

            $total    = SocialLogin::count();
            $filtered = $query->count();
            $rows     = $query->orderBy('created_at', 'desc')
                ->skip($request->input('start', 0))
                ->take($request->input('length', 15))
                ->get();

            return response()->json([
                'draw'            => intval($request->draw),
                'recordsTotal'    => $total,
                'recordsFiltered' => $filtered,
                'data'            => $rows->map(function ($s, $i) use ($request) {
                    return [
                        'DT_RowIndex'      => $request->input('start', 0) + $i + 1,
                        'id'               => $s->id,
                        'user'             => $s->user?->name ?? '—',
                        'user_id'          => $s->user_id,
                        'provider'         => ucfirst($s->provider),
                        'provider_email'   => $s->provider_email ?? '—',
                        'token_expires_at' => $s->token_expires_at
                            ? \Carbon\Carbon::parse($s->token_expires_at)->format('M d, Y H:i')
                            : '—',
                        'created_at'       => $s->created_at->format('M d, Y'),
                    ];
                }),
            ]);
        }

        if ($request->wantsJson()) {
            $logins = SocialLogin::with('user')->orderBy('created_at', 'desc')->paginate(20);
            return response()->json(['success' => true, 'data' => $logins]);
        }

        return Inertia::render('Users/SocialLogins/Index');
    }

    public function show($id)
    {
        $login = SocialLogin::with('user')->findOrFail($id);
        return Inertia::render('Users/SocialLogins/Show', ['login' => $login]);
    }

    public function destroy($id)
    {
        SocialLogin::findOrFail($id)->delete();
        return redirect('/social-logins')->with('success', 'Social login removed.');
    }
}
