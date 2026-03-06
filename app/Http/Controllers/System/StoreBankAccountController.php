<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Models\StoreBankAccount;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreBankAccountController extends Controller
{
    public function index()
    {
        $accounts = StoreBankAccount::orderByDesc('is_active')
            ->orderBy('bank_name')
            ->paginate(50);

        return Inertia::render('System/BankAccounts/Index', compact('accounts'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'bank_name'      => ['required', 'string', 'max:100'],
            'account_title'  => ['required', 'string', 'max:150'],
            'account_number' => ['required', 'string', 'max:50'],
            'iban'           => ['nullable', 'string', 'max:34'],
            'branch_code'    => ['nullable', 'string', 'max:20'],
            'branch_name'    => ['nullable', 'string', 'max:100'],
            'type'           => ['required', 'in:current,savings,business'],
            'is_active'      => ['boolean'],
        ]);

        StoreBankAccount::create($validated);

        return back()->with('success', 'Bank account added successfully.');
    }

    public function update(Request $request, StoreBankAccount $storeBankAccount)
    {
        $validated = $request->validate([
            'bank_name'      => ['required', 'string', 'max:100'],
            'account_title'  => ['required', 'string', 'max:150'],
            'account_number' => ['required', 'string', 'max:50'],
            'iban'           => ['nullable', 'string', 'max:34'],
            'branch_code'    => ['nullable', 'string', 'max:20'],
            'branch_name'    => ['nullable', 'string', 'max:100'],
            'type'           => ['required', 'in:current,savings,business'],
            'is_active'      => ['boolean'],
        ]);

        $storeBankAccount->update($validated);

        return back()->with('success', 'Bank account updated successfully.');
    }

    public function destroy(StoreBankAccount $storeBankAccount)
    {
        $storeBankAccount->delete();

        return back()->with('success', 'Bank account deleted.');
    }
}
