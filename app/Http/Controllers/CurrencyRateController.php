<?php

namespace App\Http\Controllers;

use App\Models\CurrencyRate;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CurrencyRateController extends Controller
{
    /**
     * Display a listing of currency rates.
     */
    public function index(Request $request)
    {
        if ($request->has('mobile') || ($request->ajax() && $request->get('page'))) {
            return $this->getMobileCurrencyRates($request);
        }

        if ($request->ajax() && $request->has('draw')) {
            return $this->getDataTablesCurrencyRates($request);
        }

        return Inertia::render('CurrencyRates/Index');
    }

    /**
     * Mobile paginated response.
     */
    private function getMobileCurrencyRates(Request $request)
    {
        $query = CurrencyRate::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('base_currency', 'like', "%{$search}%")
                    ->orWhere('target_currency', 'like', "%{$search}%")
                    ->orWhere('source', 'like', "%{$search}%");
            });
        }

        if ($request->filled('base_currency')) {
            $query->where('base_currency', strtoupper($request->input('base_currency')));
        }

        if ($request->filled('target_currency')) {
            $query->where('target_currency', strtoupper($request->input('target_currency')));
        }

        $perPage = (int) $request->input('per_page', 10);
        $perPage = max(10, min($perPage, 100));

        return response()->json(
            $query->latest()->paginate($perPage)
        );
    }

    /**
     * DataTables server-side response.
     */
    private function getDataTablesCurrencyRates(Request $request)
    {
        $query = CurrencyRate::query();

        if ($request->filled('search.value')) {
            $search = $request->input('search.value');
            $query->where(function ($q) use ($search) {
                $q->where('base_currency', 'like', "%{$search}%")
                    ->orWhere('target_currency', 'like', "%{$search}%")
                    ->orWhere('source', 'like', "%{$search}%");
            });
        }

        if ($request->filled('base_currency')) {
            $query->where('base_currency', strtoupper($request->input('base_currency')));
        }

        if ($request->filled('target_currency')) {
            $query->where('target_currency', strtoupper($request->input('target_currency')));
        }

        $totalData = $query->count();

        $orderColumn = (int) $request->input('order.0.column', 0);
        $orderDir = $request->input('order.0.dir', 'desc');
        $columns = ['id', 'base_currency', 'target_currency', 'rate', 'source', 'last_updated_at', 'created_at'];

        if (isset($columns[$orderColumn])) {
            $query->orderBy($columns[$orderColumn], $orderDir);
        }

        $start = (int) $request->input('start', 0);
        $length = (int) $request->input('length', 10);
        $rates = $query->skip($start)->take($length)->get();

        $data = $rates->map(function ($rate, $index) use ($start) {
            return [
                'DT_RowIndex' => $start + $index + 1,
                'id' => $rate->id,
                'base_currency' => $rate->base_currency,
                'target_currency' => $rate->target_currency,
                'rate' => number_format((float) $rate->rate, 6),
                'source' => $rate->source ?: '-',
                'last_updated_at' => optional($rate->last_updated_at)->format('M d, Y h:i A') ?: '-',
                'created_at' => optional($rate->created_at)->format('M d, Y'),
                'action' => $rate->id,
            ];
        });

        return response()->json([
            'draw' => (int) $request->input('draw'),
            'recordsTotal' => $totalData,
            'recordsFiltered' => $totalData,
            'data' => $data,
        ]);
    }

    public function create()
    {
        return Inertia::render('CurrencyRates/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'base_currency' => ['required', 'string', 'size:3', 'alpha'],
            'target_currency' => [
                'required',
                'string',
                'size:3',
                'alpha',
                'different:base_currency',
                Rule::unique('currency_rates', 'target_currency')
                    ->where(fn ($q) => $q->where('base_currency', strtoupper((string) $request->input('base_currency')))),
            ],
            'rate' => ['required', 'numeric', 'gt:0'],
            'source' => ['nullable', 'string', 'max:255'],
            'last_updated_at' => ['nullable', 'date'],
        ]);

        $validated['base_currency'] = strtoupper($validated['base_currency']);
        $validated['target_currency'] = strtoupper($validated['target_currency']);
        $validated['last_updated_at'] = $validated['last_updated_at'] ?? now();

        CurrencyRate::create($validated);

        return redirect()->route('currency-rates.index')->with('success', 'Currency rate created successfully.');
    }

    public function edit(CurrencyRate $currencyRate)
    {
        return Inertia::render('CurrencyRates/Edit', [
            'currencyRate' => $currencyRate,
        ]);
    }

    public function update(Request $request, CurrencyRate $currencyRate)
    {
        $validated = $request->validate([
            'base_currency' => ['required', 'string', 'size:3', 'alpha'],
            'target_currency' => [
                'required',
                'string',
                'size:3',
                'alpha',
                'different:base_currency',
                Rule::unique('currency_rates', 'target_currency')
                    ->ignore($currencyRate->id)
                    ->where(fn ($q) => $q->where('base_currency', strtoupper((string) $request->input('base_currency')))),
            ],
            'rate' => ['required', 'numeric', 'gt:0'],
            'source' => ['nullable', 'string', 'max:255'],
            'last_updated_at' => ['nullable', 'date'],
        ]);

        $validated['base_currency'] = strtoupper($validated['base_currency']);
        $validated['target_currency'] = strtoupper($validated['target_currency']);
        $validated['last_updated_at'] = $validated['last_updated_at'] ?? now();

        $currencyRate->update($validated);

        return redirect()->route('currency-rates.index')->with('success', 'Currency rate updated successfully.');
    }

    public function destroy(CurrencyRate $currencyRate)
    {
        try {
            $currencyRate->delete();
        } catch (QueryException) {
            return back()->with('error', 'Unable to delete currency rate because it is linked with other records.');
        }

        return back()->with('success', 'Currency rate deleted successfully.');
    }
}

