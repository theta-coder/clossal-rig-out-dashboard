<?php

namespace App\Http\Controllers\UserManagement;

use App\Http\Controllers\Controller;
use App\Models\UserManagement\CustomerSegment;
use App\Models\UserManagement\CustomerNote;
use App\Models\UserManagement\CustomerTag;
use App\Models\UserManagement\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerSegmentController extends Controller
{
    public function index()
    {
        $segments = CustomerSegment::withCount('mappings as users_count')->get();
        return Inertia::render('UserManagement/Segments/Index', compact('segments'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'               => 'required|string|max:255',
            'description'        => 'nullable|string',
            'min_spending'       => 'nullable|numeric|min:0',
            'max_spending'       => 'nullable|numeric|min:0',
            'min_orders'         => 'nullable|integer|min:0',
            'max_orders'         => 'nullable|integer|min:0',
            'days_since_purchase'=> 'nullable|integer|min:0',
        ]);

        CustomerSegment::create($validated);
        return redirect()->back()->with('success', 'Segment created successfully.');
    }

    public function update(Request $request, CustomerSegment $segment)
    {
        $validated = $request->validate([
            'name'               => 'required|string|max:255',
            'description'        => 'nullable|string',
            'min_spending'       => 'nullable|numeric|min:0',
            'max_spending'       => 'nullable|numeric|min:0',
            'min_orders'         => 'nullable|integer|min:0',
            'max_orders'         => 'nullable|integer|min:0',
            'days_since_purchase'=> 'nullable|integer|min:0',
        ]);

        $segment->update($validated);
        return redirect()->back()->with('success', 'Segment updated successfully.');
    }

    public function destroy(CustomerSegment $segment)
    {
        $segment->delete();
        return redirect()->back()->with('success', 'Segment deleted.');
    }

    public function notes($userId)
    {
        $user = User::findOrFail($userId);
        $notes = CustomerNote::where('user_id', $userId)->with('admin')->latest()->get();
        return Inertia::render('UserManagement/Customers/Notes', compact('user', 'notes'));
    }

    public function tags()
    {
        $tags = CustomerTag::all();
        return Inertia::render('UserManagement/Customers/Tags', compact('tags'));
    }

    public function storeNote(Request $request, $userId)
    {
        $validated = $request->validate([
            'note' => 'required|string',
        ]);

        CustomerNote::create([
            'user_id' => $userId,
            'admin_id' => auth()->id(),
            'note' => $validated['note'],
        ]);

        return redirect()->back()->with('success', 'Note added successfully.');
    }
}
