<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Models\SmsTemplate;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SmsTemplateController extends Controller
{
    public function index()
    {
        $templates = SmsTemplate::orderBy('category')
            ->orderBy('name')
            ->paginate(50);

        return Inertia::render('System/SmsTemplates/Index', compact('templates'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'            => ['required', 'string', 'max:100'],
            'slug'            => ['required', 'string', 'max:100', 'unique:sms_templates,slug'],
            'message'         => ['required', 'string'],
            'variables'       => ['nullable', 'array'],
            'variables.*'     => ['string'],
            'is_active'       => ['boolean'],
            'category'        => ['nullable', 'string', 'max:50'],
            'character_count' => ['nullable', 'integer', 'min:0'],
        ]);

        SmsTemplate::create($validated);

        return back()->with('success', 'SMS template created successfully.');
    }

    public function update(Request $request, SmsTemplate $smsTemplate)
    {
        $validated = $request->validate([
            'name'            => ['required', 'string', 'max:100'],
            'slug'            => ['required', 'string', 'max:100', Rule::unique('sms_templates', 'slug')->ignore($smsTemplate->id)],
            'message'         => ['required', 'string'],
            'variables'       => ['nullable', 'array'],
            'variables.*'     => ['string'],
            'is_active'       => ['boolean'],
            'category'        => ['nullable', 'string', 'max:50'],
            'character_count' => ['nullable', 'integer', 'min:0'],
        ]);

        $smsTemplate->update($validated);

        return back()->with('success', 'SMS template updated successfully.');
    }

    public function destroy(SmsTemplate $smsTemplate)
    {
        $smsTemplate->delete();

        return back()->with('success', 'SMS template deleted.');
    }
}
