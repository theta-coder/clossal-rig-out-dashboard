<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ComplaintController extends Controller
{
    public function index(Request $request)
    {
        $definitions = $this->resourceDefinitions();
        $activeResource = $request->query('resource', 'complaints');

        if (!isset($definitions[$activeResource])) {
            $activeResource = 'complaints';
        }

        $config = $definitions[$activeResource];
        $search = trim((string) $request->query('search', ''));
        $perPage = (int) $request->query('per_page', 15);
        $perPage = max(10, min($perPage, 100));

        if (!Schema::hasTable($config['table'])) {
            return Inertia::render('Complaints/Index', [
                'resources' => collect($definitions)->map(fn ($item, $key) => [
                    'key' => $key,
                    'label' => $item['label'],
                    'description' => $item['description'],
                ])->values(),
                'activeResource' => $activeResource,
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
                'missingTable' => $config['table'],
            ]);
        }

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

        return Inertia::render('Complaints/Index', [
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
            'missingTable' => null,
        ]);
    }

    public function store(Request $request, string $resource)
    {
        $config = $this->resolveResource($resource);

        if (!Schema::hasTable($config['table'])) {
            return back()->with('error', "Table {$config['table']} not found.");
        }

        $validated = $request->validate($this->validationRules($resource, $request));
        $payload = $this->normalizePayload($config, $validated);

        if ($resource === 'complaints' && empty($payload['complaint_number'])) {
            $payload['complaint_number'] = $this->generateComplaintNumber();
        }

        $now = now()->format('Y-m-d H:i:s');
        if ($config['timestamp_mode'] === 'full') {
            $payload['created_at'] = $now;
            $payload['updated_at'] = $now;
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

        if (!Schema::hasTable($config['table'])) {
            return back()->with('error', "Table {$config['table']} not found.");
        }

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

        if (!Schema::hasTable($config['table'])) {
            return back()->with('error', "Table {$config['table']} not found.");
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
            ->filter(fn ($option) => is_string($option) && $option !== '')
            ->unique()
            ->values();

        $lookups = [];

        if ($needed->contains('users') && Schema::hasTable('users')) {
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

        if ($needed->contains('orders') && Schema::hasTable('orders')) {
            $ordersQuery = DB::table('orders')->select('id')->orderByDesc('id')->limit(300);

            if (Schema::hasColumn('orders', 'order_number')) {
                $ordersQuery->addSelect('order_number');
            }

            $lookups['orders'] = $ordersQuery->get()->map(function ($order) {
                $label = isset($order->order_number) && $order->order_number
                    ? $order->order_number
                    : '#' . $order->id;

                return [
                    'id' => $order->id,
                    'label' => $label,
                ];
            })->values();
        }

        if ($needed->contains('complaints') && Schema::hasTable('complaints')) {
            $lookups['complaints'] = DB::table('complaints')
                ->select('id', 'complaint_number', 'subject')
                ->orderByDesc('id')
                ->limit(300)
                ->get()
                ->map(fn ($complaint) => [
                    'id' => $complaint->id,
                    'label' => ($complaint->complaint_number ?: ('#' . $complaint->id)) . ' - ' . Str::limit($complaint->subject, 40),
                ])
                ->values();
        }

        return $lookups;
    }

    private function buildListQuery(string $resource)
    {
        return match ($resource) {
            'complaints' => $this->complaintsQuery(),
            'complaint-replies' => DB::table('complaint_replies')
                ->leftJoin('complaints', 'complaints.id', '=', 'complaint_replies.complaint_id')
                ->leftJoin('users', 'users.id', '=', 'complaint_replies.user_id')
                ->select(
                    'complaint_replies.*',
                    'complaints.complaint_number',
                    'users.name as user_name'
                ),
            'complaint-attachments' => DB::table('complaint_attachments')
                ->leftJoin('complaints', 'complaints.id', '=', 'complaint_attachments.complaint_id')
                ->select(
                    'complaint_attachments.*',
                    'complaints.complaint_number'
                ),
            default => DB::table('complaints')->select('complaints.*'),
        };
    }

    private function complaintsQuery()
    {
        $query = DB::table('complaints')
            ->leftJoin('users as customers', 'customers.id', '=', 'complaints.user_id')
            ->leftJoin('users as admins', 'admins.id', '=', 'complaints.assigned_to')
            ->select(
                'complaints.*',
                'customers.name as user_name',
                'admins.name as assigned_admin_name'
            );

        if (Schema::hasTable('orders')) {
            $query->leftJoin('orders', 'orders.id', '=', 'complaints.order_id');

            if (Schema::hasColumn('orders', 'order_number')) {
                $query->addSelect('orders.order_number as order_reference');
            } else {
                $query->addSelect('orders.id as order_reference');
            }
        }

        return $query;
    }

    private function validationRules(string $resource, Request $request, ?int $id = null): array
    {
        return match ($resource) {
            'complaints' => [
                'complaint_number' => ['nullable', 'string', 'max:255', Rule::unique('complaints', 'complaint_number')->ignore($id)],
                'user_id' => ['nullable', 'exists:users,id'],
                'order_id' => ['nullable', 'exists:orders,id'],
                'type' => ['required', Rule::in(['late_delivery', 'damaged_parcel', 'wrong_item', 'missing_item', 'payment_issue', 'rider_behavior', 'other'])],
                'subject' => ['required', 'string', 'max:255'],
                'description' => ['required', 'string'],
                'status' => ['required', Rule::in(['open', 'in_review', 'resolved', 'closed', 'escalated'])],
                'priority' => ['required', Rule::in(['low', 'medium', 'high', 'urgent'])],
                'assigned_to' => ['nullable', 'exists:users,id'],
                'resolution_notes' => ['nullable', 'string'],
                'resolved_at' => ['nullable', 'date'],
            ],
            'complaint-replies' => [
                'complaint_id' => ['required', 'exists:complaints,id'],
                'user_id' => ['nullable', 'exists:users,id'],
                'message' => ['required', 'string'],
                'is_admin_reply' => ['nullable', 'boolean'],
            ],
            'complaint-attachments' => [
                'complaint_id' => ['required', 'exists:complaints,id'],
                'file_path' => ['required', 'string', 'max:2048'],
                'file_type' => ['nullable', 'string', 'max:255'],
            ],
            default => [],
        };
    }

    private function resourceDefinitions(): array
    {
        return [
            'complaints' => [
                'label' => 'Complaints',
                'description' => 'Customer complaints and dispute records.',
                'table' => 'complaints',
                'timestamp_mode' => 'full',
                'order_column' => 'complaints.id',
                'search_columns' => ['complaints.complaint_number', 'complaints.subject', 'complaints.status', 'complaints.priority', 'customers.name'],
                'columns' => [
                    ['key' => 'id', 'label' => 'ID'],
                    ['key' => 'complaint_number', 'label' => 'Number'],
                    ['key' => 'user_name', 'label' => 'Customer'],
                    ['key' => 'order_reference', 'label' => 'Order'],
                    ['key' => 'type', 'label' => 'Type'],
                    ['key' => 'status', 'label' => 'Status'],
                    ['key' => 'priority', 'label' => 'Priority'],
                    ['key' => 'assigned_admin_name', 'label' => 'Assigned To'],
                ],
                'fields' => [
                    ['name' => 'complaint_number', 'label' => 'Complaint Number', 'type' => 'text', 'nullable' => true],
                    ['name' => 'user_id', 'label' => 'Customer', 'type' => 'select', 'options' => 'users', 'nullable' => true],
                    ['name' => 'order_id', 'label' => 'Order', 'type' => 'select', 'options' => 'orders', 'nullable' => true],
                    ['name' => 'type', 'label' => 'Type', 'type' => 'text'],
                    ['name' => 'subject', 'label' => 'Subject', 'type' => 'text'],
                    ['name' => 'description', 'label' => 'Description', 'type' => 'text'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'text'],
                    ['name' => 'priority', 'label' => 'Priority', 'type' => 'text'],
                    ['name' => 'assigned_to', 'label' => 'Assigned Admin', 'type' => 'select', 'options' => 'users', 'nullable' => true],
                    ['name' => 'resolution_notes', 'label' => 'Resolution Notes', 'type' => 'text', 'nullable' => true],
                    ['name' => 'resolved_at', 'label' => 'Resolved At', 'type' => 'datetime', 'nullable' => true],
                ],
            ],
            'complaint-replies' => [
                'label' => 'Complaint Replies',
                'description' => 'Conversation between customer and admin.',
                'table' => 'complaint_replies',
                'timestamp_mode' => 'full',
                'order_column' => 'complaint_replies.id',
                'search_columns' => ['complaints.complaint_number', 'users.name', 'complaint_replies.message'],
                'columns' => [
                    ['key' => 'id', 'label' => 'ID'],
                    ['key' => 'complaint_number', 'label' => 'Complaint'],
                    ['key' => 'user_name', 'label' => 'User'],
                    ['key' => 'is_admin_reply', 'label' => 'Admin Reply'],
                    ['key' => 'message', 'label' => 'Message'],
                    ['key' => 'created_at', 'label' => 'Created At'],
                ],
                'fields' => [
                    ['name' => 'complaint_id', 'label' => 'Complaint', 'type' => 'select', 'options' => 'complaints'],
                    ['name' => 'user_id', 'label' => 'User', 'type' => 'select', 'options' => 'users', 'nullable' => true],
                    ['name' => 'is_admin_reply', 'label' => 'Is Admin Reply', 'type' => 'checkbox', 'nullable' => true],
                    ['name' => 'message', 'label' => 'Message', 'type' => 'text'],
                ],
            ],
            'complaint-attachments' => [
                'label' => 'Complaint Attachments',
                'description' => 'Evidence files attached with complaints.',
                'table' => 'complaint_attachments',
                'timestamp_mode' => 'full',
                'order_column' => 'complaint_attachments.id',
                'search_columns' => ['complaints.complaint_number', 'complaint_attachments.file_path', 'complaint_attachments.file_type'],
                'columns' => [
                    ['key' => 'id', 'label' => 'ID'],
                    ['key' => 'complaint_number', 'label' => 'Complaint'],
                    ['key' => 'file_type', 'label' => 'Type'],
                    ['key' => 'file_path', 'label' => 'File Path'],
                    ['key' => 'created_at', 'label' => 'Created At'],
                ],
                'fields' => [
                    ['name' => 'complaint_id', 'label' => 'Complaint', 'type' => 'select', 'options' => 'complaints'],
                    ['name' => 'file_type', 'label' => 'File Type', 'type' => 'text', 'nullable' => true],
                    ['name' => 'file_path', 'label' => 'File Path', 'type' => 'text'],
                ],
            ],
        ];
    }

    private function generateComplaintNumber(): string
    {
        do {
            $number = 'CMP-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));
        } while (DB::table('complaints')->where('complaint_number', $number)->exists());

        return $number;
    }
}

