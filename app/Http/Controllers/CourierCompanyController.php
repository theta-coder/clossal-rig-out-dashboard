<?php

namespace App\Http\Controllers;

use App\Models\CourierCompany;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CourierCompanyController extends Controller
{
    /**
     * Display a listing of courier companies.
     */
    public function index(Request $request)
    {
        if ($request->has('mobile') || ($request->ajax() && $request->get('page'))) {
            return $this->getMobileCourierCompanies($request);
        }

        if ($request->ajax() && $request->has('draw')) {
            return $this->getDataTablesCourierCompanies($request);
        }

        return Inertia::render('CourierCompanies/Index');
    }

    /**
     * Mobile paginated response.
     */
    private function getMobileCourierCompanies(Request $request)
    {
        $query = CourierCompany::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('contact_number', 'like', "%{$search}%")
                    ->orWhere('contact_email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
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
    private function getDataTablesCourierCompanies(Request $request)
    {
        $query = CourierCompany::query();

        if ($request->filled('search.value')) {
            $search = $request->input('search.value');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('contact_number', 'like', "%{$search}%")
                    ->orWhere('contact_email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $totalData = $query->count();

        $orderColumn = (int) $request->input('order.0.column', 0);
        $orderDir = $request->input('order.0.dir', 'desc');
        $columns = ['id', 'name', 'slug', 'contact_number', 'default_rate', 'is_active', 'created_at'];

        if (isset($columns[$orderColumn])) {
            $query->orderBy($columns[$orderColumn], $orderDir);
        }

        $start = (int) $request->input('start', 0);
        $length = (int) $request->input('length', 10);

        $companies = $query->skip($start)->take($length)->get();

        $data = $companies->map(function ($company, $index) use ($start) {
            return [
                'DT_RowIndex' => $start + $index + 1,
                'id' => $company->id,
                'name' => $company->name,
                'slug' => $company->slug,
                'contact_number' => $company->contact_number ?: '-',
                'contact_email' => $company->contact_email ?: '-',
                'default_rate' => number_format((float) $company->default_rate, 2),
                'is_active' => $company->is_active ? 'Active' : 'Inactive',
                'created_at' => optional($company->created_at)->format('M d, Y'),
                'action' => $company->id,
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
        return Inertia::render('CourierCompanies/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:courier_companies,slug'],
            'logo' => ['nullable', 'string', 'max:2048'],
            'tracking_url_format' => ['nullable', 'string', 'max:2048'],
            'api_key' => ['nullable', 'string', 'max:255'],
            'api_secret' => ['nullable', 'string', 'max:255'],
            'api_url' => ['nullable', 'string', 'max:255'],
            'contact_number' => ['nullable', 'string', 'max:50'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'default_rate' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $validated['slug'] = $this->buildUniqueSlug(
            $validated['name'],
            null,
            $validated['slug'] ?? null
        );
        $validated['default_rate'] = $validated['default_rate'] ?? 0;
        $validated['is_active'] = (bool) ($validated['is_active'] ?? true);

        CourierCompany::create($validated);

        return redirect()->route('courier-companies.index')->with('success', 'Courier company created successfully.');
    }

    public function edit(CourierCompany $courierCompany)
    {
        return Inertia::render('CourierCompanies/Edit', [
            'company' => $courierCompany,
        ]);
    }

    public function update(Request $request, CourierCompany $courierCompany)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:courier_companies,slug,' . $courierCompany->id],
            'logo' => ['nullable', 'string', 'max:2048'],
            'tracking_url_format' => ['nullable', 'string', 'max:2048'],
            'api_key' => ['nullable', 'string', 'max:255'],
            'api_secret' => ['nullable', 'string', 'max:255'],
            'api_url' => ['nullable', 'string', 'max:255'],
            'contact_number' => ['nullable', 'string', 'max:50'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'default_rate' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $validated['slug'] = $this->buildUniqueSlug(
            $validated['name'],
            $courierCompany->id,
            $validated['slug'] ?? null
        );
        $validated['default_rate'] = $validated['default_rate'] ?? 0;
        $validated['is_active'] = (bool) ($validated['is_active'] ?? false);

        $courierCompany->update($validated);

        return redirect()->route('courier-companies.index')->with('success', 'Courier company updated successfully.');
    }

    public function destroy(CourierCompany $courierCompany)
    {
        try {
            $courierCompany->delete();
        } catch (QueryException) {
            return back()->with('error', 'Unable to delete courier company because it is linked with other records.');
        }

        return back()->with('success', 'Courier company deleted successfully.');
    }

    private function buildUniqueSlug(string $name, ?int $ignoreId = null, ?string $providedSlug = null): string
    {
        $baseSlug = Str::slug($providedSlug ?: $name);
        if ($baseSlug === '') {
            $baseSlug = 'courier-company';
        }

        $slug = $baseSlug;
        $counter = 1;

        while (
            CourierCompany::query()
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}

