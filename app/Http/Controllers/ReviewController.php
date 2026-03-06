<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * Display a listing of reviews
     */
    public function index(Request $request)
    {
        // Mobile paginated JSON request
        if ($request->has('mobile') || ($request->ajax() && $request->get('page'))) {
            return $this->getMobileReviews($request);
        }

        // DataTables AJAX request
        if ($request->ajax() && $request->has('draw')) {
            return $this->getDataTablesReviews($request);
        }

        // Initial Inertia page load (React)
        return Inertia::render('Reviews/Index');
    }

    /**
     * Mobile paginated response
     */
    private function getMobileReviews(Request $request)
    {
        $query = Review::with(['product', 'user']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('title', 'like', "%{$search}%");
        }

        if ($request->filled('rating')) {
            $query->where('rating', $request->rating);
        }

        $perPage = $request->get('per_page', 10);
        $reviews = $query->latest()->paginate($perPage);

        return response()->json($reviews);
    }

    /**
     * DataTables server-side response
     */
    private function getDataTablesReviews(Request $request)
    {
        $query = Review::with(['product', 'user']);

        // Global search
        if ($request->filled('search.value')) {
            $search = $request->input('search.value');
            $query->where('title', 'like', "%{$search}%");
        }

        // Column filters
        if ($request->filled('rating')) {
            $query->where('rating', $request->rating);
        }

        $totalData = $query->count();

        // Sorting
        $orderColumn = $request->input('order.0.column', 5); // Default to created_at
        $orderDir = $request->input('order.0.dir', 'desc');
        $columns = ['id', 'product_id', 'user_id', 'rating', 'title', 'created_at', 'is_verified'];

        if (isset($columns[$orderColumn])) {
            $query->orderBy($columns[$orderColumn], $orderDir);
        }

        // Pagination
        $start = $request->input('start', 0);
        $length = $request->input('length', 10);

        $reviews = $query->skip($start)->take($length)->get();

        $data = $reviews->map(function ($review, $index) use ($start) {
            return [
            'DT_RowIndex' => $start + $index + 1,
            'id' => $review->id,
            'product_name' => $review->product ? $review->product->name : 'Unknown Product',
            'customer_name' => $review->user ? $review->user->name : 'Guest',
            'rating' => $review->rating,
            'title' => $review->title,
            'is_verified' => $review->is_verified ? 'Yes' : 'No',
            'created_at' => $review->created_at->format('M d, Y'),
            'action' => $review->id,
            ];
        });

        return response()->json([
            'draw' => intval($request->input('draw')),
            'recordsTotal' => $totalData,
            'recordsFiltered' => $totalData,
            'data' => $data,
        ]);
    }

    public function show(Review $review)
    {
        return Inertia::render('Reviews/Show', [
            'review' => $review->load(['product', 'user']),
        ]);
    }

    public function update(Request $request, Review $review)
    {
        $validated = $request->validate([
            'is_verified' => 'boolean',
        ]);

        $review->update($validated);

        return back()->with('success', 'Review updated successfully.');
    }

    public function destroy(Review $review)
    {
        $review->delete();

        return back()->with('success', 'Review deleted successfully.');
    }
}


