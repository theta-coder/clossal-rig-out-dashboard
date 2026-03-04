<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        return Inertia::render('Roles/Index', [
            'adminCount'    => User::where('role', 'admin')->count(),
            'customerCount' => User::where('role', 'customer')->count(),
            'users'         => User::select('id', 'name', 'email', 'role', 'created_at')
                                   ->latest()
                                   ->get(),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:admin,customer',
        ]);

        $user->update(['role' => $request->role]);

        return back()->with('success', "Role updated to \"{$request->role}\" for {$user->name}.");
    }
}
