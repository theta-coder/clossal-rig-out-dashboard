<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\Models\ShippingZone;
use App\Models\ShippingRate;
use App\Models\CourierCompany;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShippingManagementController extends Controller
{
    public function zones()
    {
        $zones = ShippingZone::withCount('rates')->get();
        return Inertia::render('Logistics/Shipping/Zones', compact('zones'));
    }

    public function rates()
    {
        $rates = ShippingRate::with(['zone', 'courier'])->latest()->get();
        return Inertia::render('Logistics/Shipping/Rates', compact('rates'));
    }

    public function storeZone(Request $request)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'cities'    => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        ShippingZone::create($validated);
        return redirect()->back()->with('success', 'Shipping zone created successfully.');
    }

    public function updateZone(Request $request, ShippingZone $shippingZone)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'cities'    => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $shippingZone->update($validated);
        return redirect()->back()->with('success', 'Shipping zone updated successfully.');
    }

    public function destroyZone(ShippingZone $shippingZone)
    {
        $shippingZone->delete();
        return redirect()->back()->with('success', 'Shipping zone deleted.');
    }

    public function storeRate(Request $request)
    {
        $validated = $request->validate([
            'zone_id' => 'required|exists:shipping_zones,id',
            'courier_id' => 'required|exists:courier_companies,id',
            'min_weight' => 'required|numeric|min:0',
            'max_weight' => 'required|numeric|gt:min_weight',
            'cost' => 'required|numeric|min:0',
        ]);

        ShippingRate::create($validated);
        return redirect()->back()->with('success', 'Shipping rate created successfully.');
    }
}
