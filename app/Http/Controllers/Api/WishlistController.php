<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use App\Models\WishlistItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class WishlistController extends Controller
{
    /**
     * Get user's wishlists
     */
    public function index(Request $request)
    {
        $wishlists = Wishlist::with('items.product.images')
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $wishlists
        ]);
    }

    /**
     * Create or update a wishlist
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'is_public' => 'boolean'
        ]);

        $wishlist = Wishlist::updateOrCreate(
        ['user_id' => $request->user()->id, 'name' => $validated['name']],
        [
            'is_public' => $validated['is_public'] ?? false,
            'share_token' => Str::random(32)
        ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Wishlist saved successfully',
            'data' => $wishlist
        ]);
    }

    /**
     * Add item to wishlist
     */
    public function addItem(Request $request)
    {
        $validated = $request->validate([
            'wishlist_id' => 'required|exists:wishlists,id',
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id'
        ]);

        $wishlist = Wishlist::where('id', $validated['wishlist_id'])
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $item = WishlistItem::updateOrCreate(
        ['wishlist_id' => $wishlist->id, 'product_id' => $validated['product_id']],
        ['variant_id' => $validated['variant_id']]
        );

        return response()->json([
            'success' => true,
            'message' => 'Item added to wishlist',
            'data' => $item
        ]);
    }

    /**
     * Remove item from wishlist
     */
    public function removeItem(Request $request, $itemId)
    {
        $item = WishlistItem::whereHas('wishlist', function ($q) use ($request) {
            $q->where('user_id', $request->user()->id);
        })->findOrFail($itemId);

        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Item removed from wishlist'
        ]);
    }

    /**
     * Delete wishlist
     */
    public function destroy(Request $request, $id)
    {
        $wishlist = Wishlist::where('user_id', $request->user()->id)->findOrFail($id);
        $wishlist->items()->delete();
        $wishlist->delete();

        return response()->json([
            'success' => true,
            'message' => 'Wishlist deleted successfully'
        ]);
    }
}
