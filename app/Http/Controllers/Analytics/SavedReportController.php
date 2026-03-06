<?php

namespace App\Http\Controllers\Analytics;

use App\Http\Controllers\Controller;
use App\Models\SavedReport;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SavedReportController extends Controller
{
    public function index()
    {
        $reports = SavedReport::with('admin')
            ->latest()
            ->paginate(50);

        return Inertia::render('Analytics/SavedReports/Index', compact('reports'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'               => ['required', 'string', 'max:150'],
            'type'               => ['required', 'string', 'max:50'],
            'filters'            => ['nullable', 'array'],
            'columns'            => ['nullable', 'array'],
            'format'             => ['required', 'in:csv,pdf,excel'],
            'is_scheduled'       => ['boolean'],
            'schedule_frequency' => ['nullable', 'in:daily,weekly,monthly'],
            'schedule_email'     => ['nullable', 'email', 'max:150'],
        ]);

        $validated['admin_id'] = auth()->id();

        SavedReport::create($validated);

        return back()->with('success', 'Report saved successfully.');
    }

    public function update(Request $request, SavedReport $savedReport)
    {
        $validated = $request->validate([
            'name'               => ['required', 'string', 'max:150'],
            'type'               => ['required', 'string', 'max:50'],
            'filters'            => ['nullable', 'array'],
            'columns'            => ['nullable', 'array'],
            'format'             => ['required', 'in:csv,pdf,excel'],
            'is_scheduled'       => ['boolean'],
            'schedule_frequency' => ['nullable', 'in:daily,weekly,monthly'],
            'schedule_email'     => ['nullable', 'email', 'max:150'],
        ]);

        $savedReport->update($validated);

        return back()->with('success', 'Report updated successfully.');
    }

    public function destroy(SavedReport $savedReport)
    {
        $savedReport->delete();

        return back()->with('success', 'Report deleted.');
    }
}
