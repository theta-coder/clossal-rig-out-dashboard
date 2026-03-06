<?php

namespace App\Http\Controllers\Analytics;

use App\Http\Controllers\Controller;
use App\Models\Analytics\ConversionFunnel;
use App\Models\Analytics\DailySalesSummary;
use App\Models\Analytics\MonthlySalesSummary;
use App\Models\Analytics\TopCustomer;
use App\Models\Analytics\TopProduct;
use App\Models\Analytics\TrafficSource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index()
    {
        $dailySales = DailySalesSummary::latest()->limit(30)->get();
        $monthlySales = MonthlySalesSummary::latest()->limit(12)->get();
        $topProducts = TopProduct::with('product')->orderBy('units_sold', 'desc')->limit(10)->get();
        $topCustomers = TopCustomer::with('user')->orderBy('total_spent', 'desc')->limit(10)->get();

        return Inertia::render('Analytics/Index', compact('dailySales', 'monthlySales', 'topProducts', 'topCustomers'));
    }

    public function funnel()
    {
        $funnel = ConversionFunnel::latest()->first();
        return Inertia::render('Analytics/Funnel', compact('funnel'));
    }

    public function traffic()
    {
        $traffic = TrafficSource::orderBy('sessions', 'desc')->get();
        return Inertia::render('Analytics/Traffic', compact('traffic'));
    }
}
