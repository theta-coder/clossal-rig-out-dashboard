<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SystemSettingController extends Controller
{
    public function index()
    {
        $settings = SystemSetting::orderBy('key')->paginate(100);

        return Inertia::render('System/SystemSettings/Index', compact('settings'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'key'         => ['required', 'string', 'max:100', 'unique:system_settings,key'],
            'value'       => ['nullable', 'string'],
            'description' => ['nullable', 'string', 'max:255'],
            'type'        => ['required', 'in:string,integer,boolean,json'],
        ]);

        SystemSetting::create($validated);

        return back()->with('success', 'System setting created.');
    }

    public function update(Request $request, SystemSetting $systemSetting)
    {
        $validated = $request->validate([
            'key'         => ['required', 'string', 'max:100', Rule::unique('system_settings', 'key')->ignore($systemSetting->id)],
            'value'       => ['nullable', 'string'],
            'description' => ['nullable', 'string', 'max:255'],
            'type'        => ['required', 'in:string,integer,boolean,json'],
        ]);

        $systemSetting->update($validated);

        return back()->with('success', 'System setting updated.');
    }

    public function destroy(SystemSetting $systemSetting)
    {
        $systemSetting->delete();

        return back()->with('success', 'System setting deleted.');
    }

    /**
     * Bulk update multiple settings at once (key => value pairs).
     */
    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'settings'         => ['required', 'array'],
            'settings.*.key'   => ['required', 'string', 'exists:system_settings,key'],
            'settings.*.value' => ['nullable', 'string'],
        ]);

        foreach ($validated['settings'] as $item) {
            SystemSetting::where('key', $item['key'])->update(['value' => $item['value']]);
        }

        return back()->with('success', 'Settings updated successfully.');
    }
}
