<?php

namespace App\Http\Controllers\OrderManagement;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentFailureManagementController extends BaseOrderManagementController
{
    protected function resourceKey(): string
    {
        return 'payment-failures';
    }

    protected function resourceDefinition(): array
    {
        return [
            'label'          => 'Payment Failures',
            'description'    => 'Failed payment attempts and resolution status.',
            'table'          => 'payment_failures',
            'timestamp_mode' => 'full',
            'order_column'   => 'payment_failures.id',
            'search_columns' => [
                'payment_failures.id',
                'orders.order_number',
                'users.name',
                'payment_failures.payment_method',
                'payment_failures.error_code',
                'payment_failures.failure_reason',
            ],
            'columns' => [
                ['key' => 'id',             'label' => 'ID'],
                ['key' => 'order_number',   'label' => 'Order #'],
                ['key' => 'user_name',      'label' => 'User'],
                ['key' => 'payment_method', 'label' => 'Method'],
                ['key' => 'amount',         'label' => 'Amount'],
                ['key' => 'failure_reason', 'label' => 'Reason'],
                ['key' => 'retry_count',    'label' => 'Retries'],
                ['key' => 'is_resolved',    'label' => 'Resolved'],
                ['key' => 'created_at',     'label' => 'Date'],
            ],
            'fields' => [
                ['name' => 'order_id',        'label' => 'Order',          'type' => 'select',   'options' => 'orders'],
                ['name' => 'user_id',         'label' => 'User',           'type' => 'select',   'options' => 'users', 'nullable' => true],
                ['name' => 'payment_method',  'label' => 'Payment Method', 'type' => 'text'],
                ['name' => 'amount',          'label' => 'Amount',         'type' => 'decimal'],
                ['name' => 'failure_reason',  'label' => 'Failure Reason', 'type' => 'textarea', 'nullable' => true],
                ['name' => 'error_code',      'label' => 'Error Code',     'type' => 'text',     'nullable' => true],
                ['name' => 'retry_count',     'label' => 'Retry Count',    'type' => 'number'],
                ['name' => 'last_retry_at',   'label' => 'Last Retry At',  'type' => 'datetime', 'nullable' => true],
                ['name' => 'is_resolved',     'label' => 'Resolved',       'type' => 'checkbox'],
                ['name' => 'resolved_at',     'label' => 'Resolved At',    'type' => 'datetime', 'nullable' => true],
            ],
        ];
    }

    protected function buildListQuery()
    {
        return DB::table('payment_failures')
            ->leftJoin('orders', 'orders.id', '=', 'payment_failures.order_id')
            ->leftJoin('users', 'users.id', '=', 'payment_failures.user_id')
            ->select(
                'payment_failures.*',
                'orders.order_number',
                'users.name as user_name'
            );
    }

    protected function validationRules(Request $request, ?int $id = null): array
    {
        return [
            'order_id'       => ['nullable', 'exists:orders,id'],
            'user_id'        => ['nullable', 'exists:users,id'],
            'payment_method' => ['required', 'string', 'max:50'],
            'amount'         => ['required', 'numeric', 'min:0'],
            'failure_reason' => ['nullable', 'string'],
            'error_code'     => ['nullable', 'string', 'max:100'],
            'retry_count'    => ['required', 'integer', 'min:0'],
            'last_retry_at'  => ['nullable', 'date'],
            'is_resolved'    => ['boolean'],
            'resolved_at'    => ['nullable', 'date'],
        ];
    }
}
