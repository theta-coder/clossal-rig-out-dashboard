<?php

namespace App\Http\Controllers\OrderManagement;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentTransactionManagementController extends BaseOrderManagementController
{
    protected function resourceKey(): string
    {
        return 'payment-transactions';
    }

    protected function resourceDefinition(): array
    {
        return [
            'label' => 'Payment Transactions',
            'description' => 'Gateway payment records and statuses.',
            'table' => 'payment_transactions',
            'timestamp_mode' => 'full',
            'order_column' => 'payment_transactions.id',
            'search_columns' => [
                'payment_transactions.id',
                'orders.order_number',
                'users.name',
                'payment_transactions.transaction_ref',
                'payment_transactions.gateway',
                'payment_transactions.status',
            ],
            'columns' => [
                ['key' => 'id', 'label' => 'ID'],
                ['key' => 'order_number', 'label' => 'Order #'],
                ['key' => 'user_name', 'label' => 'User'],
                ['key' => 'transaction_ref', 'label' => 'Reference'],
                ['key' => 'gateway', 'label' => 'Gateway'],
                ['key' => 'status', 'label' => 'Status'],
                ['key' => 'amount', 'label' => 'Amount'],
                ['key' => 'payment_at', 'label' => 'Payment At'],
            ],
            'fields' => [
                ['name' => 'order_id', 'label' => 'Order', 'type' => 'select', 'options' => 'orders'],
                ['name' => 'user_id', 'label' => 'User', 'type' => 'select', 'options' => 'users', 'nullable' => true],
                ['name' => 'transaction_ref', 'label' => 'Transaction Ref', 'type' => 'text', 'nullable' => true],
                [
                    'name' => 'gateway',
                    'label' => 'Gateway',
                    'type' => 'select',
                    'choices' => [
                        ['value' => 'cod', 'label' => 'COD'],
                        ['value' => 'jazzcash', 'label' => 'JazzCash'],
                        ['value' => 'easypaisa', 'label' => 'Easypaisa'],
                        ['value' => 'stripe', 'label' => 'Stripe'],
                        ['value' => 'bank_transfer', 'label' => 'Bank Transfer'],
                    ],
                ],
                ['name' => 'method', 'label' => 'Method', 'type' => 'text', 'nullable' => true],
                ['name' => 'amount', 'label' => 'Amount', 'type' => 'decimal'],
                [
                    'name' => 'status',
                    'label' => 'Status',
                    'type' => 'select',
                    'choices' => [
                        ['value' => 'pending', 'label' => 'Pending'],
                        ['value' => 'paid', 'label' => 'Paid'],
                        ['value' => 'failed', 'label' => 'Failed'],
                        ['value' => 'refunded', 'label' => 'Refunded'],
                        ['value' => 'partially_refunded', 'label' => 'Partially Refunded'],
                    ],
                ],
                ['name' => 'payment_at', 'label' => 'Payment At', 'type' => 'datetime', 'nullable' => true],
                ['name' => 'gateway_response', 'label' => 'Gateway Response', 'type' => 'textarea', 'nullable' => true],
                ['name' => 'notes', 'label' => 'Notes', 'type' => 'textarea', 'nullable' => true],
            ],
        ];
    }

    protected function buildListQuery()
    {
        return DB::table('payment_transactions')
            ->leftJoin('orders', 'orders.id', '=', 'payment_transactions.order_id')
            ->leftJoin('users', 'users.id', '=', 'payment_transactions.user_id')
            ->select('payment_transactions.*', 'orders.order_number', 'users.name as user_name');
    }

    protected function validationRules(Request $request, ?int $id = null): array
    {
        return [
            'order_id' => ['required', 'exists:orders,id'],
            'user_id' => ['nullable', 'exists:users,id'],
            'transaction_ref' => ['nullable', 'string', 'max:255'],
            'gateway' => ['required', 'in:cod,jazzcash,easypaisa,stripe,bank_transfer'],
            'method' => ['nullable', 'string', 'max:100'],
            'amount' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'in:pending,paid,failed,refunded,partially_refunded'],
            'payment_at' => ['nullable', 'date'],
            'gateway_response' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
