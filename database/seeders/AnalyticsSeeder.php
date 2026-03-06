<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Analytics\DailySalesSummary;
use App\Models\Analytics\MonthlySalesSummary;
use App\Models\Analytics\ConversionFunnel;
use App\Models\Analytics\TopProduct;
use App\Models\Analytics\TopCustomer;
use App\Models\Analytics\TrafficSource;
use App\Models\UserManagement\User;
use App\Models\ProductCatalog\Product;
use Carbon\Carbon;

class AnalyticsSeeder extends Seeder
{
    public function run(): void
    {
        DailySalesSummary::truncate();
        MonthlySalesSummary::truncate();
        ConversionFunnel::truncate();
        TopProduct::truncate();
        TopCustomer::truncate();
        TrafficSource::truncate();

        // Daily Sales for last 30 days
        for ($i = 29; $i >= 0; $i--) {
            DailySalesSummary::create([
                'date' => Carbon::today()->subDays($i),
                'total_orders' => rand(10, 50),
                'total_revenue' => rand(5000, 25000),
                'total_customers' => rand(8, 40),
                'average_order_value' => rand(400, 600),
                'total_items_sold' => rand(20, 100),
            ]);
        }

        // Monthly Sales for last 12 months
        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::today()->subMonths($i);
            MonthlySalesSummary::create([
                'year' => $date->year,
                'month' => $date->month,
                'total_orders' => rand(300, 1000),
                'total_revenue' => rand(150000, 500000),
                'total_customers' => rand(200, 800),
                'average_order_value' => rand(450, 550),
                'total_items_sold' => rand(600, 2000),
            ]);
        }

        // Conversion Funnel for last 7 days
        for ($i = 6; $i >= 0; $i--) {
            $visitors = rand(1000, 5000);
            $views = $visitors * 0.7;
            $carts = $views * 0.15;
            $checkouts = $carts * 0.6;
            $orders = $checkouts * 0.8;

            ConversionFunnel::create([
                'date' => Carbon::today()->subDays($i),
                'visitors' => $visitors,
                'product_views' => $views,
                'add_to_cart' => $carts,
                'checkout_start' => $checkouts,
                'orders_completed' => $orders,
                'visitor_to_view_rate' => 70,
                'view_to_cart_rate' => 15,
                'cart_to_checkout_rate' => 60,
                'checkout_to_order_rate' => 80,
                'overall_conversion_rate' => ($orders / $visitors) * 100,
            ]);
        }

        // Top Products (if products exist)
        $products = Product::limit(10)->get();
        if ($products->isNotEmpty()) {
            foreach ($products as $index => $product) {
                TopProduct::create([
                    'product_id' => $product->id,
                    'period' => 'all_time',
                    'period_date' => Carbon::today(),
                    'units_sold' => rand(100, 500),
                    'total_revenue' => rand(50000, 200000),
                    'views' => rand(1000, 5000),
                    'conversion_rate' => rand(2, 8),
                    'rank' => $index + 1,
                ]);
            }
        }

        // Top Customers (if users exist)
        $users = User::limit(10)->get();
        if ($users->isNotEmpty()) {
            foreach ($users as $user) {
                TopCustomer::create([
                    'user_id' => $user->id,
                    'total_orders' => rand(5, 20),
                    'total_spent' => rand(10000, 50000),
                    'average_order_value' => rand(1500, 3000),
                    'customer_since' => Carbon::now()->subMonths(rand(1, 24)),
                    'is_vip' => rand(0, 1),
                    'lifetime_value' => rand(10000, 100000),
                ]);
            }
        }

        // Traffic Sources
        $sources = ['Direct', 'Google/CPC', 'Facebook', 'Instagram', 'Email', 'Referral'];
        foreach ($sources as $sourceName) {
            $sessions = rand(500, 2000);
            TrafficSource::create([
                'date' => Carbon::today(),
                'source' => $sourceName,
                'visitors' => $sessions * 0.8,
                'sessions' => $sessions,
                'bounces' => $sessions * 0.4,
                'bounce_rate' => 40.00,
                'conversions' => $sessions * 0.02,
                'conversion_rate' => 2.00,
                'revenue' => rand(1000, 5000),
            ]);
        }
    }
}
