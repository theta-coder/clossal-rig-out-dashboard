<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AbandonedCartController extends Controller
{
    /**
     * Display a listing of abandoned carts (carts older than 24h with items)
     */
    public function index()
    {
        $carts = Cart::with(['user', 'items.product'])
            ->whereHas('items')
            ->where('updated_at', '<', now()->subHours(24))
            ->latest('updated_at')
            ->paginate(15);

        return Inertia::render('Shopping/AbandonedCarts/Index', [
            'carts' => $carts
        ]);
    }

    /**
     * Display details of a specific cart
     */
    public function show($id)
    {
        $cart = Cart::with(['user', 'items.product.images', 'items.product.category'])
            ->findOrFail($id);

        return Inertia::render('Shopping/AbandonedCarts/Show', [
            'cart' => $cart
        ]);
    }

    /**
     * Delete a cart
     */
    public function destroy($id)
    {
        $cart = Cart::findOrFail($id);
        $cart->items()->delete();
        $cart->delete();

        return redirect()->back()->with('success', 'Cart deleted successfully');
    }
}
