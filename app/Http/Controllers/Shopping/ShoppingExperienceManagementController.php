<?php

namespace App\Http\Controllers\Shopping;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Wishlist;
use App\Models\Favorite;
use App\Models\ProductView;
use App\Models\SearchLog;
use App\Models\ProductComparison;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShoppingExperienceManagementController extends Controller
{
    public function carts()
    {
        $carts = Cart::with(['user', 'items'])->latest()->paginate(20);
        return Inertia::render('Shopping/Carts', compact('carts'));
    }

    public function wishlists()
    {
        $wishlists = Wishlist::with(['user', 'items'])->latest()->paginate(20);
        return Inertia::render('Shopping/Wishlists', compact('wishlists'));
    }

    public function searchLogs()
    {
        $logs = SearchLog::with('user')->latest()->paginate(50);
        return Inertia::render('Shopping/SearchLogs', compact('logs'));
    }

    public function productViews()
    {
        $views = ProductView::with(['user', 'product'])->latest()->paginate(50);
        return Inertia::render('Shopping/ProductViews', compact('views'));
    }
}
