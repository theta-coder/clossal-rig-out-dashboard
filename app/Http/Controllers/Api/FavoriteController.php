<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use App\Models\Wishlist;
use App\Models\WishlistItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FavoriteController extends Controller
{
    /**
     * Get user's favorites
     */
    public function index(Request $request)
    {
        $userId = (int) $request->user()->id;
        $wishlist = Wishlist::with('items.product.images')
            ->where('user_id', $userId)
            ->where('name', 'Favorites')
            ->first();

        $favorites = collect($wishlist?->items ?? [])
            ->map(fn ($item) => $item->product)
            ->filter()
            ->values();

        // Backward compatibility: migrate old favorites records lazily to wishlist_items.
        if ($favorites->isEmpty()) {
            $legacyFavorites = Favorite::with('product.images')
                ->where('user_id', $userId)
                ->latest()
                ->get();

            if ($legacyFavorites->isNotEmpty()) {
                $wishlist = $this->favoritesWishlist($userId);

                foreach ($legacyFavorites as $legacy) {
                    WishlistItem::firstOrCreate([
                        'wishlist_id' => $wishlist->id,
                        'product_id' => $legacy->product_id,
                        'variant_id' => null,
                    ]);
                }

                $favorites = $legacyFavorites
                    ->map(fn ($legacy) => $legacy->product)
                    ->filter()
                    ->values();
            }
        }

        return response()->json([
            'success' => true,
            'data' => $favorites
        ]);
    }

    /**
     * Toggle a favorite
     */
    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id'
        ]);

        $userId = (int) $request->user()->id;
        $productId = $validated['product_id'];
        $wishlist = $this->favoritesWishlist($userId);

        $favorite = WishlistItem::where('wishlist_id', $wishlist->id)
            ->where('product_id', $productId)
            ->first();

        if ($favorite) {
            $favorite->delete();
            Favorite::where('user_id', $userId)->where('product_id', $productId)->delete();
            $isFavorite = false;
        }
        else {
            WishlistItem::create([
                'wishlist_id' => $wishlist->id,
                'product_id' => $productId,
                'variant_id' => null,
            ]);

            Favorite::firstOrCreate([
                'user_id' => $userId,
                'product_id' => $productId,
            ]);
            $isFavorite = true;
        }

        return response()->json([
            'success' => true,
            'message' => $isFavorite ? 'Added to favorites' : 'Removed from favorites',
            'is_favorite' => $isFavorite
        ]);
    }

    /**
     * Check if product is favorited
     */
    public function status(Request $request, $productId)
    {
        $wishlist = Wishlist::where('user_id', $request->user()->id)
            ->where('name', 'Favorites')
            ->first();

        $isFavorite = WishlistItem::query()
            ->when($wishlist, fn ($query) => $query->where('wishlist_id', $wishlist->id), fn ($query) => $query->whereRaw('1 = 0'))
            ->where('product_id', $productId)
            ->exists();

        if (!$isFavorite) {
            $isFavorite = Favorite::where('user_id', $request->user()->id)
                ->where('product_id', $productId)
                ->exists();
        }

        return response()->json([
            'success' => true,
            'is_favorite' => $isFavorite
        ]);
    }

    private function favoritesWishlist(int $userId): Wishlist
    {
        return Wishlist::firstOrCreate(
            [
                'user_id' => $userId,
                'name' => 'Favorites',
            ],
            [
                'is_public' => false,
                'share_token' => Str::random(32),
            ]
        );
    }
}
