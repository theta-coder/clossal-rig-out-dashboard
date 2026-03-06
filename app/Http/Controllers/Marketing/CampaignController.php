<?php

namespace App\Http\Controllers\Marketing;

use App\Http\Controllers\Controller;
use App\Models\Marketing\Campaign;
use App\Models\Marketing\CampaignMetrics;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CampaignController extends Controller
{
    public function index()
    {
        $campaigns = Campaign::with('metrics')->latest()->get();
        return Inertia::render('Marketing/Campaigns/Index', compact('campaigns'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'budget' => 'nullable|numeric',
        ]);

        Campaign::create($validated);

        return redirect()->back()->with('success', 'Campaign created successfully.');
    }

    public function show(Campaign $campaign)
    {
        $metrics = $campaign->metrics;
        return Inertia::render('Marketing/Campaigns/Show', compact('campaign', 'metrics'));
    }

    public function update(Request $request, Campaign $campaign)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'type'        => 'required|string',
            'status'      => 'required|in:draft,active,paused,completed',
            'start_date'  => 'required|date',
            'end_date'    => 'required|date|after:start_date',
            'budget'      => 'nullable|numeric|min:0',
        ]);

        $campaign->update($validated);

        return redirect()->back()->with('success', 'Campaign updated successfully.');
    }

    public function destroy(Campaign $campaign)
    {
        $campaign->delete();
        return redirect()->back()->with('success', 'Campaign deleted.');
    }
}
