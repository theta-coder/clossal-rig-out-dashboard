<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ShoppingExperienceController extends Controller
{
    public function index(Request $request)
    {
        $definitions = $this->resourceDefinitions();
        $activeResource = $request->query('resource', 'carts');

        if (!isset($definitions[$activeResource])) {
            $activeResource = 'carts';
        }

        $config = $definitions[$activeResource];
        $search = trim((string) $request->query('search', ''));
        $perPage = (int) $request->query('per_page', 15);
        $perPage = max(10, min($perPage, 100));

        $query = $this->buildListQuery($activeResource);

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

        return Inertia::render('ShoppingExperience/Index', [
            'resources' => collect($definitions)->map(fn ($item, $key) => [
                'key' => $key,
                'label' => $item['label'],
                'description' => $item['description'],
            ])->values(),
            'activeResource' => $activeResource,
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

    public function store(Request $request, string $resource)
    {
        $config = $this->resolveResource($resource);
        $validated = $request->validate($this->validationRules($resource, $request));
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

    public function update(Request $request, string $resource, int $id)
    {
        $config = $this->resolveResource($resource);

        $exists = DB::table($config['table'])->where('id', $id)->exists();
        if (!$exists) {
            abort(404);
        }

        $validated = $request->validate($this->validationRules($resource, $request, $id));
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

    public function destroy(string $resource, int $id)
    {
        $config = $this->resolveResource($resource);

        try {
            DB::table($config['table'])
                ->where('id', $id)
                ->delete();
        } catch (QueryException) {
            return back()->with('error', 'Unable to delete record because it is linked with other data.');
        }

        return back()->with('success', $config['label'] . ' record deleted successfully.');
    }

    private function resolveResource(string $resource): array
    {
        $definitions = $this->resourceDefinitions();

        if (!isset($definitions[$resource])) {
            abort(404);
        }

        return $definitions[$resource];
    }

    private function normalizePayload(array $config, array $validated): array
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

            if (($field['type'] ?? null) === 'checkbox') {
                $value = (bool) $value;
            }

            if (($field['type'] ?? null) === 'datetime' && $value) {
                $value = Carbon::parse($value)->format('Y-m-d H:i:s');
            }

            if (in_array(($field['type'] ?? ''), ['number', 'select'], true) && $value !== null && is_numeric($value)) {
                $value = (int) $value;
            }

            $payload[$key] = $value;
        }

        return $payload;
    }

    private function normalizeRow(array $config, array $row): array
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

    private function buildLookups(array $fields): array
    {
        $needed = collect($fields)
            ->pluck('options')
            ->filter()
            ->unique()
            ->values();

        $lookups = [];

        if ($needed->contains('users')) {
            $lookups['users'] = DB::table('users')
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

        if ($needed->contains('products')) {
            $lookups['products'] = DB::table('products')
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

        if ($needed->contains('carts')) {
            $lookups['carts'] = DB::table('carts')
                ->select('id', 'session_id')
                ->orderByDesc('id')
                ->limit(300)
                ->get()
                ->map(fn ($cart) => [
                    'id' => $cart->id,
                    'label' => '#' . $cart->id . ($cart->session_id ? " ({$cart->session_id})" : ''),
                ])
                ->values();
        }

        if ($needed->contains('wishlists')) {
            $lookups['wishlists'] = DB::table('wishlists')
                ->select('id', 'name')
                ->orderByDesc('id')
                ->limit(300)
                ->get()
                ->map(fn ($wishlist) => [
                    'id' => $wishlist->id,
                    'label' => $wishlist->name,
                ])
                ->values();
        }

        if ($needed->contains('variants')) {
            $lookups['variants'] = DB::table('product_variants')
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

        return $lookups;
    }

    private function buildListQuery(string $resource)
    {
        return match ($resource) {
            'carts' => DB::table('carts')
                ->leftJoin('users', 'users.id', '=', 'carts.user_id')
                ->select('carts.*', 'users.name as user_name'),

            'cart-items' => DB::table('cart_items')
                ->leftJoin('carts', 'carts.id', '=', 'cart_items.cart_id')
                ->leftJoin('products', 'products.id', '=', 'cart_items.product_id')
                ->select('cart_items.*', 'products.name as product_name', 'carts.session_id as cart_session_id'),

            'wishlists' => DB::table('wishlists')
                ->leftJoin('users', 'users.id', '=', 'wishlists.user_id')
                ->select('wishlists.*', 'users.name as user_name'),

            'wishlist-items' => DB::table('wishlist_items')
                ->leftJoin('wishlists', 'wishlists.id', '=', 'wishlist_items.wishlist_id')
                ->leftJoin('products', 'products.id', '=', 'wishlist_items.product_id')
                ->leftJoin('product_variants', 'product_variants.id', '=', 'wishlist_items.variant_id')
                ->select(
                    'wishlist_items.*',
                    'wishlists.name as wishlist_name',
                    'products.name as product_name',
                    'product_variants.sku as variant_sku'
                ),

            'search-logs' => DB::table('search_logs')
                ->leftJoin('users', 'users.id', '=', 'search_logs.user_id')
                ->select('search_logs.*', 'users.name as user_name'),

            'product-views' => DB::table('product_views')
                ->leftJoin('users', 'users.id', '=', 'product_views.user_id')
                ->leftJoin('products', 'products.id', '=', 'product_views.product_id')
                ->select('product_views.*', 'users.name as user_name', 'products.name as product_name'),

            default => DB::table('carts')->select('carts.*'),
        };
    }

    private function validationRules(string $resource, Request $request, ?int $id = null): array
    {
        return match ($resource) {
            'carts' => [
                'user_id' => ['nullable', 'exists:users,id'],
                'session_id' => ['nullable', 'string', 'max:255'],
            ],

            'cart-items' => [
                'cart_id' => ['required', 'exists:carts,id'],
                'product_id' => ['required', 'exists:products,id'],
                'size' => ['required', 'string', 'max:100'],
                'color' => ['nullable', 'string', 'max:100'],
                'quantity' => ['required', 'integer', 'min:1'],
            ],

            'wishlists' => [
                'user_id' => ['required', 'exists:users,id'],
                'name' => ['required', 'string', 'max:255'],
                'is_public' => ['nullable', 'boolean'],
                'share_token' => ['nullable', 'string', 'max:64', Rule::unique('wishlists', 'share_token')->ignore($id)],
            ],

            'wishlist-items' => [
                'wishlist_id' => ['required', 'exists:wishlists,id'],
                'product_id' => [
                    'required',
                    'exists:products,id',
                    Rule::unique('wishlist_items')
                        ->ignore($id)
                        ->where(function ($query) use ($request) {
                            $query
                                ->where('wishlist_id', $request->input('wishlist_id'))
                                ->where('variant_id', $request->input('variant_id'));
                        }),
                ],
                'variant_id' => ['nullable', 'exists:product_variants,id'],
            ],

            'search-logs' => [
                'user_id' => ['nullable', 'exists:users,id'],
                'query' => ['required', 'string', 'max:255'],
                'results_count' => ['required', 'integer', 'min:0'],
                'ip_address' => ['nullable', 'string', 'max:45'],
                'searched_at' => ['nullable', 'date'],
            ],

            'product-views' => [
                'product_id' => ['required', 'exists:products,id'],
                'user_id' => ['nullable', 'exists:users,id'],
                'session_id' => ['nullable', 'string', 'max:255'],
                'ip_address' => ['nullable', 'string', 'max:45'],
                'source' => ['nullable', 'string', 'max:100'],
                'viewed_at' => ['nullable', 'date'],
            ],

            default => [],
        };
    }

    private function resourceDefinitions(): array
    {
        return [
            'carts' => [
                'label' => 'Carts',
                'description' => 'Customer and guest shopping carts.',
                'table' => 'carts',
                'timestamp_mode' => 'full',
                'order_column' => 'carts.id',
                'search_columns' => ['carts.id', 'carts.session_id', 'users.name'],
                'columns' => [
                    ['key' => 'id', 'label' => 'ID'],
                    ['key' => 'user_name', 'label' => 'User'],
                    ['key' => 'session_id', 'label' => 'Session'],
                    ['key' => 'created_at', 'label' => 'Created At'],
                ],
                'fields' => [
                    ['name' => 'user_id', 'label' => 'User', 'type' => 'select', 'options' => 'users', 'nullable' => true],
                    ['name' => 'session_id', 'label' => 'Session ID', 'type' => 'text', 'nullable' => true],
                ],
            ],

            'cart-items' => [
                'label' => 'Cart Items',
                'description' => 'Products saved inside carts.',
                'table' => 'cart_items',
                'timestamp_mode' => 'full',
                'order_column' => 'cart_items.id',
                'search_columns' => ['cart_items.id', 'products.name', 'cart_items.size', 'cart_items.color'],
                'columns' => [
                    ['key' => 'id', 'label' => 'ID'],
                    ['key' => 'cart_id', 'label' => 'Cart'],
                    ['key' => 'product_name', 'label' => 'Product'],
                    ['key' => 'size', 'label' => 'Size'],
                    ['key' => 'color', 'label' => 'Color'],
                    ['key' => 'quantity', 'label' => 'Qty'],
                ],
                'fields' => [
                    ['name' => 'cart_id', 'label' => 'Cart', 'type' => 'select', 'options' => 'carts'],
                    ['name' => 'product_id', 'label' => 'Product', 'type' => 'select', 'options' => 'products'],
                    ['name' => 'size', 'label' => 'Size', 'type' => 'text'],
                    ['name' => 'color', 'label' => 'Color', 'type' => 'text', 'nullable' => true],
                    ['name' => 'quantity', 'label' => 'Quantity', 'type' => 'number'],
                ],
            ],

            'wishlists' => [
                'label' => 'Wishlists',
                'description' => 'Named lists of products users save.',
                'table' => 'wishlists',
                'timestamp_mode' => 'full',
                'order_column' => 'wishlists.id',
                'search_columns' => ['wishlists.id', 'wishlists.name', 'users.name'],
                'columns' => [
                    ['key' => 'id', 'label' => 'ID'],
                    ['key' => 'user_name', 'label' => 'User'],
                    ['key' => 'name', 'label' => 'Name'],
                    ['key' => 'is_public', 'label' => 'Public'],
                    ['key' => 'share_token', 'label' => 'Share Token'],
                ],
                'fields' => [
                    ['name' => 'user_id', 'label' => 'User', 'type' => 'select', 'options' => 'users'],
                    ['name' => 'name', 'label' => 'Name', 'type' => 'text'],
                    ['name' => 'is_public', 'label' => 'Is Public', 'type' => 'checkbox', 'nullable' => true],
                    ['name' => 'share_token', 'label' => 'Share Token', 'type' => 'text', 'nullable' => true],
                ],
            ],

            'wishlist-items' => [
                'label' => 'Wishlist Items',
                'description' => 'Items assigned to each wishlist.',
                'table' => 'wishlist_items',
                'timestamp_mode' => 'full',
                'order_column' => 'wishlist_items.id',
                'search_columns' => ['wishlist_items.id', 'wishlists.name', 'products.name', 'product_variants.sku'],
                'columns' => [
                    ['key' => 'id', 'label' => 'ID'],
                    ['key' => 'wishlist_name', 'label' => 'Wishlist'],
                    ['key' => 'product_name', 'label' => 'Product'],
                    ['key' => 'variant_sku', 'label' => 'Variant'],
                    ['key' => 'created_at', 'label' => 'Created At'],
                ],
                'fields' => [
                    ['name' => 'wishlist_id', 'label' => 'Wishlist', 'type' => 'select', 'options' => 'wishlists'],
                    ['name' => 'product_id', 'label' => 'Product', 'type' => 'select', 'options' => 'products'],
                    ['name' => 'variant_id', 'label' => 'Variant', 'type' => 'select', 'options' => 'variants', 'nullable' => true],
                ],
            ],

            'search-logs' => [
                'label' => 'Search Logs',
                'description' => 'Queries users search for in store.',
                'table' => 'search_logs',
                'timestamp_mode' => 'created_only',
                'created_column' => 'searched_at',
                'order_column' => 'search_logs.id',
                'search_columns' => ['search_logs.id', 'search_logs.query', 'users.name', 'search_logs.ip_address'],
                'columns' => [
                    ['key' => 'id', 'label' => 'ID'],
                    ['key' => 'user_name', 'label' => 'User'],
                    ['key' => 'query', 'label' => 'Query'],
                    ['key' => 'results_count', 'label' => 'Results'],
                    ['key' => 'searched_at', 'label' => 'Searched At'],
                ],
                'fields' => [
                    ['name' => 'user_id', 'label' => 'User', 'type' => 'select', 'options' => 'users', 'nullable' => true],
                    ['name' => 'query', 'label' => 'Query', 'type' => 'text'],
                    ['name' => 'results_count', 'label' => 'Results Count', 'type' => 'number'],
                    ['name' => 'ip_address', 'label' => 'IP Address', 'type' => 'text', 'nullable' => true],
                    ['name' => 'searched_at', 'label' => 'Searched At', 'type' => 'datetime', 'nullable' => true],
                ],
            ],

            'product-views' => [
                'label' => 'Product Views',
                'description' => 'View events for product pages.',
                'table' => 'product_views',
                'timestamp_mode' => 'created_only',
                'created_column' => 'viewed_at',
                'order_column' => 'product_views.id',
                'search_columns' => ['product_views.id', 'users.name', 'products.name', 'product_views.session_id', 'product_views.ip_address'],
                'columns' => [
                    ['key' => 'id', 'label' => 'ID'],
                    ['key' => 'product_name', 'label' => 'Product'],
                    ['key' => 'user_name', 'label' => 'User'],
                    ['key' => 'session_id', 'label' => 'Session'],
                    ['key' => 'source', 'label' => 'Source'],
                    ['key' => 'viewed_at', 'label' => 'Viewed At'],
                ],
                'fields' => [
                    ['name' => 'product_id', 'label' => 'Product', 'type' => 'select', 'options' => 'products'],
                    ['name' => 'user_id', 'label' => 'User', 'type' => 'select', 'options' => 'users', 'nullable' => true],
                    ['name' => 'session_id', 'label' => 'Session ID', 'type' => 'text', 'nullable' => true],
                    ['name' => 'ip_address', 'label' => 'IP Address', 'type' => 'text', 'nullable' => true],
                    ['name' => 'source', 'label' => 'Source', 'type' => 'text', 'nullable' => true],
                    ['name' => 'viewed_at', 'label' => 'Viewed At', 'type' => 'datetime', 'nullable' => true],
                ],
            ],
        ];
    }
}
