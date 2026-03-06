<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Models\TaxRate;
use App\Models\ShippingZone;
use App\Models\ProductCatalog\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaxRateController extends Controller
{
    public function index()
    {
        $taxRates = TaxRate::with(['category', 'zone'])
            ->orderBy('name')
            ->paginate(50);

        $categories = Category::select('id', 'name')->orderBy('name')->get();
        $zones      = ShippingZone::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('System/TaxRates/Index', compact('taxRates', 'categories', 'zones'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'         => ['required', 'string', 'max:100'],
            'rate'         => ['required', 'numeric', 'min:0', 'max:100'],
            'applies_to'   => ['required', 'in:all,category,zone'],
            'category_id'  => ['nullable', 'exists:categories,id'],
            'zone_id'      => ['nullable', 'exists:shipping_zones,id'],
            'is_inclusive' => ['boolean'],
            'is_active'    => ['boolean'],
        ]);

        TaxRate::create($validated);

        return back()->with('success', 'Tax rate created successfully.');
    }

    public function update(Request $request, TaxRate $taxRate)
    {
        $validated = $request->validate([
            'name'         => ['required', 'string', 'max:100'],
            'rate'         => ['required', 'numeric', 'min:0', 'max:100'],
            'applies_to'   => ['required', 'in:all,category,zone'],
            'category_id'  => ['nullable', 'exists:categories,id'],
            'zone_id'      => ['nullable', 'exists:shipping_zones,id'],
            'is_inclusive' => ['boolean'],
            'is_active'    => ['boolean'],
        ]);

        $taxRate->update($validated);

        return back()->with('success', 'Tax rate updated successfully.');
    }

    public function destroy(TaxRate $taxRate)
    {
        $taxRate->delete();

        return back()->with('success', 'Tax rate deleted.');
    }
}
