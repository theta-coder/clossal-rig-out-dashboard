<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\Models\Rider;
use App\Models\RiderOrder;
use App\Models\RiderLocation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RiderManagementController extends Controller
{
    public function index()
    {
        $riders = Rider::withCount('orders')->latest()->paginate(20);
        return Inertia::render('Logistics/Riders/Index', compact('riders'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'        => 'required|exists:users,id',
            'vehicle_number' => 'nullable|string|max:50',
            'vehicle_type'   => 'nullable|string|max:50',
            'cnic'           => 'nullable|string|max:15',
            'city'           => 'nullable|string|max:100',
            'status'         => 'required|in:active,inactive,suspended,on_leave',
        ]);

        Rider::create($validated);
        return redirect()->back()->with('success', 'Rider added successfully.');
    }

    public function update(Request $request, Rider $rider)
    {
        $validated = $request->validate([
            'vehicle_number' => 'nullable|string|max:50',
            'vehicle_type'   => 'nullable|string|max:50',
            'status'         => 'required|in:active,inactive,suspended,on_leave',
            'city'           => 'nullable|string|max:100',
        ]);

        $rider->update($validated);
        return redirect()->back()->with('success', 'Rider updated successfully.');
    }

    public function destroy(Rider $rider)
    {
        $rider->delete();
        return redirect()->back()->with('success', 'Rider deleted.');
    }

    public function orders()
    {
        $orders = RiderOrder::with(['order', 'rider'])->latest()->paginate(50);
        return Inertia::render('Logistics/Riders/Orders', compact('orders'));
    }

    public function locations()
    {
        $locations = RiderLocation::with('rider')->latest()->limit(100)->get();
        return Inertia::render('Logistics/Riders/Locations', compact('locations'));
    }
}
