<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\StockLog;
use App\Models\StockReservation;
use App\Models\ProductCatalog\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockLogController extends Controller
{
    public function index()
    {
        $logs = StockLog::with(['product', 'variant'])->latest()->paginate(50);
        return Inertia::render('Inventory/StockLogs/Index', compact('logs'));
    }

    public function reservations()
    {
        $reservations = StockReservation::with(['product', 'user'])->where('status', 'active')->get();
        return Inertia::render('Inventory/StockLogs/Reservations', compact('reservations'));
    }

    public function adjust(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id',
            'quantity' => 'required|integer',
            'type' => 'required|in:addition,subtraction,correction',
            'reason' => 'required|string',
        ]);

        StockLog::create([
            'product_id' => $validated['product_id'],
            'variant_id' => $validated['variant_id'],
            'quantity' => $validated['quantity'],
            'type' => $validated['type'],
            'reason' => $validated['reason'],
            'user_id' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Stock adjusted successfully.');
    }
}
