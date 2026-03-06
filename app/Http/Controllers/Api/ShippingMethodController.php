<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShippingZone;
use App\Models\ShippingRate;
use App\Models\CourierCompany;
use Illuminate\Http\Request;

class ShippingMethodController extends Controller
{
    /**
     * List active shipping zones
     */
    public function zones()
    {
        $zones = ShippingZone::where('is_active', true)->get();
        return response()->json([
            'success' => true,
            'data' => $zones
        ]);
    }

    /**
     * Get available shipping methods and rates for a city/weight
     */
    public function rates(Request $request)
    {
        $validated = $request->validate([
            'city' => 'required|string|max:255',
            'weight' => 'nullable|numeric|min:0.1',
            'subtotal' => 'nullable|numeric|min:0',
        ]);

        $weight = $validated['weight'] ?? 0.5; // Default 0.5kg
        $subtotal = $validated['subtotal'] ?? 0;

        // Find the zone that includes the city
        $zone = ShippingZone::where('cities', 'LIKE', '%' . $validated['city'] . '%')
            ->where('is_active', true)
            ->first();

        // If city not found in a specific zone, use default zone if exists
        if (!$zone) {
            $zone = ShippingZone::where('is_default', true)->first();
        }

        if (!$zone) {
            return response()->json([
                'success' => false,
                'message' => 'No shipping methods available for this location.'
            ], 404);
        }

        $rates = ShippingRate::where('zone_id', $zone->id)
            ->where('is_active', true)
            ->where('min_weight', '<=', $weight)
            ->where('max_weight', '>=', $weight)
            ->with('courier:id,name,logo_path,tracking_url_prefix')
            ->get();

        // Check for free shipping threshold
        $freeShipping = $zone->free_shipping_threshold > 0 && $subtotal >= $zone->free_shipping_threshold;

        if ($freeShipping) {
            foreach ($rates as $rate) {
                $rate->cost = 0;
            }
        }

        return response()->json([
            'success' => true,
            'data' => $rates
        ]);
    }

    /**
     * List all active courier companies
     */
    public function couriers()
    {
        $couriers = CourierCompany::where('is_active', true)->get(['id', 'name', 'logo_path']);
        return response()->json([
            'success' => true,
            'data' => $couriers
        ]);
    }
}
