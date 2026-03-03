<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Category;
use App\Models\ContactMessage;
use App\Models\NewsletterSubscriber;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'stats' => [
                'totalProducts' => Product::count(),
                'totalOrders' => Order::count(),
                'totalUsers' => User::count(),
                'totalCategories' => Category::count(),
                'totalRevenue' => Order::where('status', '!=', 'cancelled')->sum('total'),
                'pendingOrders' => Order::where('status', 'processing')->count(),
                'unreadMessages' => ContactMessage::where('is_read', false)->count(),
                'totalSubscribers' => NewsletterSubscriber::where('is_active', true)->count(),
            ],
            'recentOrders' => Order::with('user')
            ->latest()
            ->take(5)
            ->get(),
        ]);
    }
}
