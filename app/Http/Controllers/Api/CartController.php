<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductCatalog\Product;
use App\Models\ProductCatalog\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    /**
     * Get the current cart for the session or user.
     */
    public function index(Request $request)
    {
        $sessionId = $request->query('session_id');
        $user = $request->user('sanctum');

        if (!$sessionId && !$user) {
            return response()->json([
                'success' => false,
                'message' => 'Session ID or Data is required'
            ], 400);
        }

        $cart = Cart::with(['items.product'])->where(function (\Illuminate\Database\Eloquent\Builder $query) use ($sessionId, $user) {
            if ($user) {
                $query->where('user_id', $user->id);
            }
            else {
                $query->where('session_id', $sessionId);
            }
        })->first();

        if (!$cart) {
            return response()->json([
                'success' => true,
                'message' => 'Cart is empty',
                'data' => [
                    'items' => [],
                    'total' => 0
                ]
            ]);
        }

        $total = $cart->items->sum(function ($item) {
            return $item->quantity * ($item->product->price ?? 0);
        });

        // Format items to include necessary product details for frontend
        $formattedItems = $cart->items->map(function ($item) {
            $image = $item->product->images->first();
            return [
            'id' => $item->id,
            'cart_id' => $item->cart_id,
            'product_id' => $item->product_id,
            'name' => $item->product->name ?? 'Unknown Product',
            'price' => $item->product->price ?? 0,
            'size' => $item->size,
            'color' => $item->color,
            'variant_id' => $item->variant_id,
            'quantity' => $item->quantity,
            'image' => $image ? url($image->image_path) : null,
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Cart fetched successfully',
            'data' => [
                'cart_id' => $cart->id,
                'session_id' => $cart->session_id,
                'items' => $formattedItems,
                'total' => $total
            ]
        ]);
    }

    /**
     * Add an item to the cart.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'session_id' => 'required|string',
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id',
            'size' => 'required|string',
            'color' => 'nullable|string',
            'quantity' => 'nullable|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $sessionId = $request->session_id;
        $user = $request->user('sanctum');

        // Find or create cart
        $cart = Cart::firstOrCreate(
        ['session_id' => $sessionId],
        ['user_id' => $user ? $user->id : null]
        );

        // If user logged in after creating session cart, link it
        if ($user && !$cart->user_id) {
            $cart->user_id = $user->id;
            $cart->save();
        }

        // Check if item already exists in cart with same variant or (size and color)
        $query = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $request->product_id);

        if ($request->filled('variant_id')) {
            $query->where('variant_id', $request->variant_id);
        }
        else {
            $query->where('size', $request->size)
                ->where('color', $request->color);
        }

        $cartItem = $query->first();

        $quantity = $request->quantity ?? 1;

        if ($cartItem) {
            $cartItem->quantity += $quantity;
            $cartItem->save();
        }
        else {
            $cartItem = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $request->product_id,
                'variant_id' => $request->variant_id,
                'size' => $request->size,
                'color' => $request->color,
                'quantity' => $quantity
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Item added to cart successfully',
            'data' => $cartItem
        ], 201);
    }

    /**
     * Update a cart item (quantity).
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $cartItem = CartItem::find($id);

        if (!$cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'Cart item not found'
            ], 404);
        }

        $cartItem->quantity = $request->quantity;
        $cartItem->save();

        return response()->json([
            'success' => true,
            'message' => 'Cart item updated successfully',
            'data' => $cartItem
        ]);
    }

    /**
     * Remove an item from the cart.
     */
    public function destroy($id)
    {
        $cartItem = CartItem::find($id);

        if (!$cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'Cart item not found'
            ], 404);
        }

        $cartItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cart item removed successfully'
        ]);
    }

    /**
     * Clear the whole cart.
     */
    public function clear(Request $request)
    {
        $sessionId = $request->query('session_id');

        if (!$sessionId) {
            return response()->json([
                'success' => false,
                'message' => 'Session ID is required'
            ], 400);
        }

        $cart = Cart::where('session_id', $sessionId)->first();

        if ($cart) {
            $cart->items()->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared successfully'
        ]);
    }
}
