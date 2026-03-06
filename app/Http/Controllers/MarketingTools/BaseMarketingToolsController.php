<?php

namespace App\Http\Controllers\MarketingTools;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

abstract class BaseMarketingToolsController extends Controller
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
            return Inertia::render('MarketingTools/Index', [
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

        return Inertia::render('MarketingTools/Index', [
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
                'key' => 'coupons',
                'label' => 'Coupons',
                'description' => 'Discount code setup and limits.',
                'routes' => [
                    'index' => 'marketing-tools.coupons.index',
                    'store' => 'marketing-tools.coupons.store',
                    'update' => 'marketing-tools.coupons.update',
                    'destroy' => 'marketing-tools.coupons.destroy',
                ],
            ],
            [
                'key' => 'coupon-usages',
                'label' => 'Coupon Usages',
                'description' => 'Track coupon usage per order/user.',
                'routes' => [
                    'index' => 'marketing-tools.coupon-usages.index',
                    'store' => 'marketing-tools.coupon-usages.store',
                    'update' => 'marketing-tools.coupon-usages.update',
                    'destroy' => 'marketing-tools.coupon-usages.destroy',
                ],
            ],
            [
                'key' => 'flash-sales',
                'label' => 'Flash Sales',
                'description' => 'Limited-time sale campaigns.',
                'routes' => [
                    'index' => 'marketing-tools.flash-sales.index',
                    'store' => 'marketing-tools.flash-sales.store',
                    'update' => 'marketing-tools.flash-sales.update',
                    'destroy' => 'marketing-tools.flash-sales.destroy',
                ],
            ],
            [
                'key' => 'flash-sale-products',
                'label' => 'Flash Sale Products',
                'description' => 'Products linked to each flash sale.',
                'routes' => [
                    'index' => 'marketing-tools.flash-sale-products.index',
                    'store' => 'marketing-tools.flash-sale-products.store',
                    'update' => 'marketing-tools.flash-sale-products.update',
                    'destroy' => 'marketing-tools.flash-sale-products.destroy',
                ],
            ],
            [
                'key' => 'quantity-discounts',
                'label' => 'Quantity Discounts',
                'description' => 'Bulk and buy-more discount rules.',
                'routes' => [
                    'index' => 'marketing-tools.quantity-discounts.index',
                    'store' => 'marketing-tools.quantity-discounts.store',
                    'update' => 'marketing-tools.quantity-discounts.update',
                    'destroy' => 'marketing-tools.quantity-discounts.destroy',
                ],
            ],
            [
                'key' => 'product-bundles',
                'label' => 'Product Bundles',
                'description' => 'Bundle offers with fixed pricing.',
                'routes' => [
                    'index' => 'marketing-tools.product-bundles.index',
                    'store' => 'marketing-tools.product-bundles.store',
                    'update' => 'marketing-tools.product-bundles.update',
                    'destroy' => 'marketing-tools.product-bundles.destroy',
                ],
            ],
            [
                'key' => 'bundle-items',
                'label' => 'Bundle Items',
                'description' => 'Products assigned inside bundles.',
                'routes' => [
                    'index' => 'marketing-tools.bundle-items.index',
                    'store' => 'marketing-tools.bundle-items.store',
                    'update' => 'marketing-tools.bundle-items.update',
                    'destroy' => 'marketing-tools.bundle-items.destroy',
                ],
            ],
            [
                'key' => 'promotional-banners',
                'label' => 'Promotional Banners',
                'description' => 'Hero, sidebar, popup campaign banners.',
                'routes' => [
                    'index' => 'marketing-tools.promotional-banners.index',
                    'store' => 'marketing-tools.promotional-banners.store',
                    'update' => 'marketing-tools.promotional-banners.update',
                    'destroy' => 'marketing-tools.promotional-banners.destroy',
                ],
            ],
            [
                'key' => 'announcements',
                'label' => 'Announcements',
                'description' => 'Site-wide notification banners.',
                'routes' => [
                    'index' => 'marketing-tools.announcements.index',
                    'store' => 'marketing-tools.announcements.store',
                    'update' => 'marketing-tools.announcements.update',
                    'destroy' => 'marketing-tools.announcements.destroy',
                ],
            ],
            [
                'key' => 'newsletter-subscribers',
                'label' => 'Subscribers',
                'description' => 'Newsletter subscription list.',
                'routes' => [
                    'index' => 'marketing-tools.newsletter-subscribers.index',
                    'store' => 'marketing-tools.newsletter-subscribers.store',
                    'update' => 'marketing-tools.newsletter-subscribers.update',
                    'destroy' => 'marketing-tools.newsletter-subscribers.destroy',
                ],
            ],
            [
                'key' => 'newsletter-campaigns',
                'label' => 'Campaigns',
                'description' => 'Email campaign records and stats.',
                'routes' => [
                    'index' => 'marketing-tools.newsletter-campaigns.index',
                    'store' => 'marketing-tools.newsletter-campaigns.store',
                    'update' => 'marketing-tools.newsletter-campaigns.update',
                    'destroy' => 'marketing-tools.newsletter-campaigns.destroy',
                ],
            ],
        ])->values()->all();
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

        if ($needed->contains('categories')) {
            $lookups['categories'] = $this->lookupCategories();
        }

        if ($needed->contains('coupons')) {
            $lookups['coupons'] = $this->lookupCoupons();
        }

        if ($needed->contains('flash_sales')) {
            $lookups['flash_sales'] = $this->lookupFlashSales();
        }

        if ($needed->contains('product_bundles')) {
            $lookups['product_bundles'] = $this->lookupProductBundles();
        }

        if ($needed->contains('product_variants')) {
            $lookups['product_variants'] = $this->lookupProductVariants();
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

    protected function lookupCategories(): Collection
    {
        if (!Schema::hasTable('categories')) {
            return collect();
        }

        return DB::table('categories')
            ->select('id', 'name')
            ->orderBy('name')
            ->limit(300)
            ->get()
            ->map(fn ($category) => [
                'id' => $category->id,
                'label' => $category->name,
            ])
            ->values();
    }

    protected function lookupCoupons(): Collection
    {
        if (!Schema::hasTable('coupons')) {
            return collect();
        }

        return DB::table('coupons')
            ->select('id', 'code')
            ->orderByDesc('id')
            ->limit(300)
            ->get()
            ->map(fn ($coupon) => [
                'id' => $coupon->id,
                'label' => $coupon->code,
            ])
            ->values();
    }

    protected function lookupFlashSales(): Collection
    {
        if (!Schema::hasTable('flash_sales')) {
            return collect();
        }

        return DB::table('flash_sales')
            ->select('id', 'name')
            ->orderByDesc('id')
            ->limit(300)
            ->get()
            ->map(fn ($sale) => [
                'id' => $sale->id,
                'label' => $sale->name,
            ])
            ->values();
    }

    protected function lookupProductBundles(): Collection
    {
        if (!Schema::hasTable('product_bundles')) {
            return collect();
        }

        return DB::table('product_bundles')
            ->select('id', 'name')
            ->orderByDesc('id')
            ->limit(300)
            ->get()
            ->map(fn ($bundle) => [
                'id' => $bundle->id,
                'label' => $bundle->name,
            ])
            ->values();
    }

    protected function lookupProductVariants(): Collection
    {
        if (!Schema::hasTable('product_variants')) {
            return collect();
        }

        return DB::table('product_variants')
            ->select('id', 'sku')
            ->orderByDesc('id')
            ->limit(300)
            ->get()
            ->map(fn ($variant) => [
                'id' => $variant->id,
                'label' => '#' . $variant->id . ($variant->sku ? " ({$variant->sku})" : ''),
            ])
            ->values();
    }
}
