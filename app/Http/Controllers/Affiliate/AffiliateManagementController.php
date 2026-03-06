<?php

namespace App\Http\Controllers\Affiliate;

use App\Http\Controllers\Controller;
use App\Models\Affiliate;
use App\Models\AffiliateClick;
use App\Models\AffiliateConversion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AffiliateManagementController extends Controller
{
    public function index()
    {
        $affiliates = Affiliate::withCount(['clicks', 'conversions'])->latest()->paginate(20);
        return Inertia::render('Affiliate/Index', compact('affiliates'));
    }

    public function show(Affiliate $affiliate)
    {
        $clicks = $affiliate->clicks()->latest()->limit(50)->get();
        $conversions = $affiliate->conversions()->with('order')->latest()->limit(50)->get();
        return Inertia::render('Affiliate/Show', compact('affiliate', 'clicks', 'conversions'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'         => ['required', 'exists:users,id'],
            'affiliate_code'  => ['required', 'string', 'max:50', 'unique:affiliates,affiliate_code'],
            'commission_rate' => ['required', 'numeric', 'min:0', 'max:100'],
            'website'         => ['nullable', 'url', 'max:255'],
            'status'          => ['required', 'in:pending,active,suspended'],
        ]);

        Affiliate::create($validated);

        return redirect()->back()->with('success', 'Affiliate created successfully.');
    }

    public function update(Request $request, Affiliate $affiliate)
    {
        $validated = $request->validate([
            'commission_rate' => ['required', 'numeric', 'min:0', 'max:100'],
            'website'         => ['nullable', 'url', 'max:255'],
            'status'          => ['required', 'in:pending,active,suspended'],
        ]);

        $affiliate->update($validated);

        return redirect()->back()->with('success', 'Affiliate updated successfully.');
    }

    public function destroy(Affiliate $affiliate)
    {
        $affiliate->delete();
        return redirect()->back()->with('success', 'Affiliate deleted.');
    }

    public function approve($id)
    {
        $affiliate = Affiliate::findOrFail($id);
        $affiliate->update(['status' => 'active']);
        return redirect()->back()->with('success', 'Affiliate approved successfully.');
    }

    public function clicks()
    {
        $clicks = AffiliateClick::with('affiliate')->latest()->paginate(50);
        return Inertia::render('Affiliate/Clicks', compact('clicks'));
    }

    public function conversions()
    {
        $conversions = AffiliateConversion::with(['affiliate', 'order'])->latest()->paginate(50);
        return Inertia::render('Affiliate/Conversions', compact('conversions'));
    }
}
