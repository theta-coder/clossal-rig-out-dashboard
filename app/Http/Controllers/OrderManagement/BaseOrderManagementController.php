<?php

namespace App\Http\Controllers\OrderManagement;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

abstract class BaseOrderManagementController extends Controller
{
    abstract protected function resourceKey(): string;

    abstract protected function resourceDefinition(): array;

    abstract protected function buildListQuery();

    abstract protected function validationRules(Request $request, ?int $id = null): array;

    public function index(Request $request)
    {
        $config = $this->resourceDefinition();
        $search = trim((string) $request->query('search', ''));
        $perPage = (int) $request->query('per_page', 15);
        $perPage = max(10, min($perPage, 100));

        if (!Schema::hasTable($config['table'])) {
            return Inertia::render('OrderManagement/Index', [
                'resources' => $this->resources(),
                'activeResource' => $this->resourceKey(),
                'fields' => $config['fields'],
                'columns' => $config['columns'],
                'records' => [
                    'data' => [],
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => $perPage,
                    'total' => 0,
                    'from' => null,
                    'to' => null,
                ],
                'lookups' => $this->buildLookups($config['fields']),
                'filters' => [
                    'search' => $search,
                    'per_page' => $perPage,
                ],
            ]);
        }

        $query = $this->buildListQuery();

        if ($search !== '') {
            $query->where(function ($q) use ($config, $search) {
                foreach ($config['search_columns'] as $index => $column) {
                    if ($index === 0) {
                        $q->where($column, 'like', "%{$search}%");
                    } else {
                        $q->orWhere($column, 'like', "%{$search}%");
                    }
                }
            });
        }

        $paginator = $query
            ->orderByDesc($config['order_column'])
            ->paginate($perPage)
            ->withQueryString();

        $records = collect($paginator->items())
            ->map(fn ($row) => $this->normalizeRow($config, (array) $row))
            ->values()
            ->all();

        return Inertia::render('OrderManagement/Index', [
            'resources' => $this->resources(),
            'activeResource' => $this->resourceKey(),
            'fields' => $config['fields'],
            'columns' => $config['columns'],
            'records' => [
                'data' => $records,
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
            'lookups' => $this->buildLookups($config['fields']),
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $config = $this->resourceDefinition();

        if (!Schema::hasTable($config['table'])) {
            return back()->with('error', 'Resource table does not exist in database yet.');
        }

        $validated = $request->validate($this->validationRules($request));
        $payload = $this->normalizePayload($config, $validated);

        $now = now()->format('Y-m-d H:i:s');
        if ($config['timestamp_mode'] === 'full') {
            $payload['created_at'] = $now;
            $payload['updated_at'] = $now;
        } elseif ($config['timestamp_mode'] === 'created_only') {
            $createdColumn = $config['created_column'] ?? 'created_at';
            if (empty($payload[$createdColumn])) {
                $payload[$createdColumn] = $now;
            }
        }

        try {
            DB::table($config['table'])->insert($payload);
        } catch (QueryException) {
            return back()->with('error', 'Unable to create record. Please check related IDs and unique values.');
        }

        return back()->with('success', $config['label'] . ' created successfully.');
    }

    public function update(Request $request, int $id)
    {
        $config = $this->resourceDefinition();

        if (!Schema::hasTable($config['table'])) {
            return back()->with('error', 'Resource table does not exist in database yet.');
        }

        $exists = DB::table($config['table'])->where('id', $id)->exists();
        if (!$exists) {
            abort(404);
        }

        $validated = $request->validate($this->validationRules($request, $id));
        $payload = $this->normalizePayload($config, $validated);

        if ($config['timestamp_mode'] === 'full') {
            $payload['updated_at'] = now()->format('Y-m-d H:i:s');
        }

        try {
            DB::table($config['table'])
                ->where('id', $id)
                ->update($payload);
        } catch (QueryException) {
            return back()->with('error', 'Unable to update record. Please check related IDs and unique values.');
        }

        return back()->with('success', $config['label'] . ' updated successfully.');
    }

    public function destroy(int $id)
    {
        $config = $this->resourceDefinition();

        if (!Schema::hasTable($config['table'])) {
            return back()->with('error', 'Resource table does not exist in database yet.');
        }

        try {
            DB::table($config['table'])
                ->where('id', $id)
                ->delete();
        } catch (QueryException) {
            return back()->with('error', 'Unable to delete record because it is linked with other data.');
        }

        return back()->with('success', $config['label'] . ' record deleted successfully.');
    }

    protected function normalizePayload(array $config, array $validated): array
    {
        $payload = [];
        $fields = collect($config['fields'])->keyBy('name');

        foreach ($validated as $key => $value) {
            if (!$fields->has($key)) {
                continue;
            }

            $field = $fields->get($key);

            if ($value === '') {
                $value = null;
            }

            $type = $field['type'] ?? null;

            if ($type === 'checkbox') {
                $value = (bool) $value;
            }

            if ($type === 'datetime' && $value) {
                $value = Carbon::parse($value)->format('Y-m-d H:i:s');
            }

            if ($type === 'date' && $value) {
                $value = Carbon::parse($value)->format('Y-m-d');
            }

            if (in_array($type, ['number', 'select'], true) && $value !== null && is_numeric($value)) {
                $value = (int) $value;
            }

            if ($type === 'decimal' && $value !== null && is_numeric($value)) {
                $value = number_format((float) $value, 2, '.', '');
            }

            $payload[$key] = $value;
        }

        return $payload;
    }

    protected function normalizeRow(array $config, array $row): array
    {
        foreach ($config['fields'] as $field) {
            $name = $field['name'];
            if (!array_key_exists($name, $row)) {
                continue;
            }

            if (($field['type'] ?? null) === 'checkbox') {
                $row[$name] = (bool) $row[$name];
            }
        }

        return $row;
    }

    protected function resources(): array
    {
        return collect([
            [
                'key' => 'order-items',
                'label' => 'Order Items',
                'description' => 'Products linked with each order.',
                'routes' => [
                    'index' => 'order-management.order-items.index',
                    'store' => 'order-management.order-items.store',
                    'update' => 'order-management.order-items.update',
                    'destroy' => 'order-management.order-items.destroy',
                ],
            ],
            [
                'key' => 'order-status-histories',
                'label' => 'Order Status',
                'description' => 'Timeline of order status changes.',
                'routes' => [
                    'index' => 'order-management.order-status-histories.index',
                    'store' => 'order-management.order-status-histories.store',
                    'update' => 'order-management.order-status-histories.update',
                    'destroy' => 'order-management.order-status-histories.destroy',
                ],
            ],
            [
                'key' => 'order-tracking',
                'label' => 'Order Tracking',
                'description' => 'Courier and tracking lifecycle details.',
                'routes' => [
                    'index' => 'order-management.order-tracking.index',
                    'store' => 'order-management.order-tracking.store',
                    'update' => 'order-management.order-tracking.update',
                    'destroy' => 'order-management.order-tracking.destroy',
                ],
            ],
            [
                'key' => 'invoices',
                'label' => 'Invoices',
                'description' => 'Billing documents generated for orders.',
                'routes' => [
                    'index' => 'order-management.invoices.index',
                    'store' => 'order-management.invoices.store',
                    'update' => 'order-management.invoices.update',
                    'destroy' => 'order-management.invoices.destroy',
                ],
            ],
            [
                'key' => 'payment-transactions',
                'label' => 'Payments',
                'description' => 'Gateway payment records and statuses.',
                'routes' => [
                    'index' => 'order-management.payment-transactions.index',
                    'store' => 'order-management.payment-transactions.store',
                    'update' => 'order-management.payment-transactions.update',
                    'destroy' => 'order-management.payment-transactions.destroy',
                ],
            ],
            [
                'key' => 'product-returns',
                'label' => 'Returns',
                'description' => 'Return requests and refund status.',
                'routes' => [
                    'index' => 'order-management.product-returns.index',
                    'store' => 'order-management.product-returns.store',
                    'update' => 'order-management.product-returns.update',
                    'destroy' => 'order-management.product-returns.destroy',
                ],
            ],
            [
                'key' => 'return-items',
                'label' => 'Return Items',
                'description' => 'Line items mapped to each return.',
                'routes' => [
                    'index' => 'order-management.return-items.index',
                    'store' => 'order-management.return-items.store',
                    'update' => 'order-management.return-items.update',
                    'destroy' => 'order-management.return-items.destroy',
                ],
            ],
            [
                'key' => 'refund-bank-details',
                'label' => 'Refund Banks',
                'description' => 'Bank details used for refund transfers.',
                'routes' => [
                    'index' => 'order-management.refund-bank-details.index',
                    'store' => 'order-management.refund-bank-details.store',
                    'update' => 'order-management.refund-bank-details.update',
                    'destroy' => 'order-management.refund-bank-details.destroy',
                ],
            ],
            [
                'key' => 'cod-collections',
                'label' => 'COD Collections',
                'description' => 'Cash collection and settlement entries.',
                'routes' => [
                    'index' => 'order-management.cod-collections.index',
                    'store' => 'order-management.cod-collections.store',
                    'update' => 'order-management.cod-collections.update',
                    'destroy' => 'order-management.cod-collections.destroy',
                ],
            ],
        ])
            ->values()
            ->all();
    }

    protected function buildLookups(array $fields): array
    {
        $needed = collect($fields)
            ->pluck('options')
            ->filter()
            ->unique()
            ->values();

        $lookups = [];

        if ($needed->contains('users')) {
            $lookups['users'] = $this->lookupUsers();
        }

        if ($needed->contains('orders')) {
            $lookups['orders'] = $this->lookupOrders();
        }

        if ($needed->contains('products')) {
            $lookups['products'] = $this->lookupProducts();
        }

        if ($needed->contains('returns')) {
            $lookups['returns'] = $this->lookupReturns();
        }

        if ($needed->contains('order_items')) {
            $lookups['order_items'] = $this->lookupOrderItems();
        }

        if ($needed->contains('courier_companies')) {
            $lookups['courier_companies'] = $this->lookupCourierCompanies();
        }

        if ($needed->contains('riders')) {
            $lookups['riders'] = $this->lookupRiders();
        }

        return $lookups;
    }

    protected function lookupUsers(): Collection
    {
        if (!Schema::hasTable('users')) {
            return collect();
        }

        return DB::table('users')
            ->select('id', 'name', 'email')
            ->orderByDesc('id')
            ->limit(300)
            ->get()
            ->map(fn ($user) => [
                'id' => $user->id,
                'label' => trim(($user->name ?? 'User') . ($user->email ? " ({$user->email})" : '')),
            ])
            ->values();
    }

    protected function lookupOrders(): Collection
    {
        if (!Schema::hasTable('orders')) {
            return collect();
        }

        return DB::table('orders')
            ->select('id', 'order_number')
            ->orderByDesc('id')
            ->limit(300)
            ->get()
            ->map(fn ($order) => [
                'id' => $order->id,
                'label' => '#' . ($order->order_number ?? $order->id),
            ])
            ->values();
    }

    protected function lookupProducts(): Collection
    {
        if (!Schema::hasTable('products')) {
            return collect();
        }

        return DB::table('products')
            ->select('id', 'name')
            ->orderByDesc('id')
            ->limit(300)
            ->get()
            ->map(fn ($product) => [
                'id' => $product->id,
                'label' => $product->name,
            ])
            ->values();
    }

    protected function lookupReturns(): Collection
    {
        if (!Schema::hasTable('returns')) {
            return collect();
        }

        return DB::table('returns')
            ->select('id', 'return_number')
            ->orderByDesc('id')
            ->limit(300)
            ->get()
            ->map(fn ($return) => [
                'id' => $return->id,
                'label' => '#' . ($return->return_number ?? $return->id),
            ])
            ->values();
    }

    protected function lookupOrderItems(): Collection
    {
        if (!Schema::hasTable('order_items')) {
            return collect();
        }

        $query = DB::table('order_items')
            ->leftJoin('orders', 'orders.id', '=', 'order_items.order_id')
            ->select(
                'order_items.id',
                'order_items.product_name',
                'order_items.quantity',
                'orders.order_number'
            )
            ->orderByDesc('order_items.id')
            ->limit(300);

        return $query->get()->map(fn ($item) => [
            'id' => $item->id,
            'label' => '#' . $item->id . ' - ' . ($item->product_name ?? 'Item') .
                ($item->order_number ? " ({$item->order_number})" : ''),
        ])->values();
    }

    protected function lookupCourierCompanies(): Collection
    {
        if (!Schema::hasTable('courier_companies')) {
            return collect();
        }

        return DB::table('courier_companies')
            ->select('id', 'name')
            ->orderBy('name')
            ->limit(300)
            ->get()
            ->map(fn ($courier) => [
                'id' => $courier->id,
                'label' => $courier->name,
            ])
            ->values();
    }

    protected function lookupRiders(): Collection
    {
        if (!Schema::hasTable('riders')) {
            return collect();
        }

        $query = DB::table('riders')
            ->leftJoin('users', 'users.id', '=', 'riders.user_id')
            ->select('riders.id', 'users.name')
            ->orderByDesc('riders.id')
            ->limit(300);

        return $query->get()->map(fn ($rider) => [
            'id' => $rider->id,
            'label' => '#' . $rider->id . ($rider->name ? " ({$rider->name})" : ''),
        ])->values();
    }
}
