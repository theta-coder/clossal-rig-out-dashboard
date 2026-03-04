<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function index(Request $request, Product $product)
    {
        $query = $product->reviews()->with('user')->latest();

        if (!$request->boolean('include_unverified', false)) {
            $query->where('is_verified', true);
        }

        $perPage = min((int) $request->get('per_page', 10), 50);
        $reviews = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $reviews->items(),
            'pagination' => [
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'per_page' => $reviews->perPage(),
                'total' => $reviews->total(),
            ],
        ]);
    }

    public function store(Request $request, Product $product)
    {
        $user = Auth::guard('sanctum')->user();

        $validated = $request->validate([
            'reviewer_name' => $user ? 'nullable|string|max:255' : 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'required|string|max:255',
            'body' => 'required|string|max:5000',
        ]);

        $review = Review::create([
            'product_id' => $product->id,
            'user_id' => $user?->id,
            'reviewer_name' => $user?->name ?? $validated['reviewer_name'],
            'rating' => $validated['rating'],
            'title' => $validated['title'],
            'body' => $validated['body'],
            'is_verified' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Review submitted successfully',
            'data' => $review->load('user'),
        ], 201);
    }

    public function show(Review $review)
    {
        if (!$review->is_verified) {
            return response()->json([
                'success' => false,
                'message' => 'Review not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $review->load(['user', 'product']),
        ]);
    }

    public function update(Request $request, Review $review)
    {
        $user = $request->user();

        if (!$user || $review->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You are not allowed to update this review.',
            ], 403);
        }

        $validated = $request->validate([
            'rating' => 'sometimes|integer|min:1|max:5',
            'title' => 'sometimes|string|max:255',
            'body' => 'sometimes|string|max:5000',
        ]);

        $review->update($validated + ['is_verified' => false]);

        return response()->json([
            'success' => true,
            'message' => 'Review updated successfully',
            'data' => $review->fresh(),
        ]);
    }

    public function destroy(Request $request, Review $review)
    {
        $user = $request->user();

        if (!$user || $review->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You are not allowed to delete this review.',
            ], 403);
        }

        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'Review deleted successfully',
        ]);
    }
}
