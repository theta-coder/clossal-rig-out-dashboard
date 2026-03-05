<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Announcement;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index()
    {
        $announcements = Announcement::latest()->get();
        return Inertia::render('Announcements/Index', [
            'announcements' => $announcements
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:255',
            'link_text' => 'nullable|string|max:50',
            'link_url' => 'nullable|string|max:255',
            'is_active' => 'boolean'
        ]);

        if ($request->boolean('is_active')) {
            Announcement::query()->update(['is_active' => false]);
        }

        Announcement::create($validated);

        return back()->with('success', 'Announcement created successfully.');
    }

    public function update(Request $request, Announcement $announcement)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:255',
            'link_text' => 'nullable|string|max:50',
            'link_url' => 'nullable|string|max:255',
            'is_active' => 'boolean'
        ]);

        if ($request->boolean('is_active')) {
            Announcement::where('id', '!=', $announcement->id)->update(['is_active' => false]);
        }

        $announcement->update($validated);

        return back()->with('success', 'Announcement updated successfully.');
    }

    public function toggle(Announcement $announcement)
    {
        if (!$announcement->is_active) {
            Announcement::query()->update(['is_active' => false]);
            $announcement->update(['is_active' => true]);
        }
        else {
            $announcement->update(['is_active' => false]);
        }

        return back()->with('success', 'Announcement status updated.');
    }

    public function destroy(Announcement $announcement)
    {
        $announcement->delete();
        return back()->with('success', 'Announcement deleted successfully.');
    }
}
