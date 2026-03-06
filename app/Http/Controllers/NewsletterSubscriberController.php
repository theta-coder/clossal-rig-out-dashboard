<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsletterSubscriberController extends Controller
{
    /**
     * Display a listing of subscribers
     */
    public function index(Request $request)
    {
        // Mobile paginated JSON request
        if ($request->has('mobile') || ($request->ajax() && $request->get('page'))) {
            return $this->getMobileSubscribers($request);
        }

        // DataTables AJAX request
        if ($request->ajax() && $request->has('draw')) {
            return $this->getDataTablesSubscribers($request);
        }

        // Initial Inertia page load (React)
        return Inertia::render('Subscribers/Index');
    }

    /**
     * Mobile paginated response
     */
    private function getMobileSubscribers(Request $request)
    {
        $query = NewsletterSubscriber::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('email', 'like', "%{$search}%");
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $perPage = $request->get('per_page', 10);
        $subscribers = $query->latest()->paginate($perPage);

        return response()->json($subscribers);
    }

    /**
     * DataTables server-side response
     */
    private function getDataTablesSubscribers(Request $request)
    {
        $query = NewsletterSubscriber::query();

        // Global search
        if ($request->filled('search.value')) {
            $search = $request->input('search.value');
            $query->where('email', 'like', "%{$search}%");
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $totalData = $query->count();

        // Sorting
        $orderColumn = $request->input('order.0.column', 2); // Default to created_at
        $orderDir = $request->input('order.0.dir', 'desc');
        $columns = ['id', 'email', 'created_at', 'is_active'];

        if (isset($columns[$orderColumn])) {
            $query->orderBy($columns[$orderColumn], $orderDir);
        }

        // Pagination
        $start = $request->input('start', 0);
        $length = $request->input('length', 10);

        $subscribers = $query->skip($start)->take($length)->get();

        $data = $subscribers->map(function ($subscriber, $index) use ($start) {
            return [
            'DT_RowIndex' => $start + $index + 1,
            'id' => $subscriber->id,
            'email' => $subscriber->email,
            'created_at' => $subscriber->created_at->format('M d, Y'),
            'is_active' => $subscriber->is_active ? 'Active' : 'Inactive',
            'action' => $subscriber->id,
            ];
        });

        return response()->json([
            'draw' => intval($request->input('draw')),
            'recordsTotal' => $totalData,
            'recordsFiltered' => $totalData,
            'data' => $data,
        ]);
    }

    public function update(Request $request, NewsletterSubscriber $subscriber)
    {
        $validated = $request->validate([
            'is_active' => 'boolean',
        ]);

        $subscriber->update($validated);

        return back()->with('success', 'Subscriber updated successfully.');
    }

    public function destroy(NewsletterSubscriber $subscriber)
    {
        $subscriber->delete();

        return back()->with('success', 'Subscriber deleted successfully.');
    }
}


