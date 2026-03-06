<?php

namespace App\Http\Controllers\OrderManagement;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ProductReturnManagementController extends BaseOrderManagementController
{
    protected function resourceKey(): string
    {
        return 'product-returns';
    }

    protected function resourceDefinition(): array
    {
        return [
            'label' => 'Product Returns',
            'description' => 'Return requests and refund status.',
            'table' => 'returns',
            'timestamp_mode' => 'full',
            'order_column' => 'returns.id',
            'search_columns' => [
                'returns.id',
                'returns.return_number',
                'orders.order_number',
                'users.name',
                'returns.status',
                'returns.reason',
            ],
            'columns' => [
                ['key' => 'id', 'label' => 'ID'],
                ['key' => 'return_number', 'label' => 'Return #'],
                ['key' => 'order_number', 'label' => 'Order #'],
                ['key' => 'user_name', 'label' => 'User'],
                ['key' => 'status', 'label' => 'Status'],
                ['key' => 'reason', 'label' => 'Reason'],
                ['key' => 'refund_amount', 'label' => 'Refund'],
                ['key' => 'refunded_at', 'label' => 'Refunded At'],
            ],
            'fields' => [
                ['name' => 'order_id', 'label' => 'Order', 'type' => 'select', 'options' => 'orders'],
                ['name' => 'user_id', 'label' => 'User', 'type' => 'select', 'options' => 'users', 'nullable' => true],
                ['name' => 'return_number', 'label' => 'Return Number', 'type' => 'text'],
                [
                    'name' => 'status',
                    'label' => 'Status',
                    'type' => 'select',
                    'choices' => [
                        ['value' => 'requested', 'label' => 'Requested'],
                        ['value' => 'approved', 'label' => 'Approved'],
                        ['value' => 'rejected', 'label' => 'Rejected'],
                        ['value' => 'received', 'label' => 'Received'],
                        ['value' => 'refunded', 'label' => 'Refunded'],
                    ],
                ],
                [
                    'name' => 'reason',
                    'label' => 'Reason',
                    'type' => 'select',
                    'choices' => [
                        ['value' => 'defective', 'label' => 'Defective'],
                        ['value' => 'wrong_item', 'label' => 'Wrong Item'],
                        ['value' => 'not_as_described', 'label' => 'Not As Described'],
                        ['value' => 'changed_mind', 'label' => 'Changed Mind'],
                        ['value' => 'other', 'label' => 'Other'],
                    ],
                ],
                ['name' => 'notes', 'label' => 'Notes', 'type' => 'textarea', 'nullable' => true],
                ['name' => 'refund_amount', 'label' => 'Refund Amount', 'type' => 'decimal', 'nullable' => true],
                [
                    'name' => 'refund_method',
                    'label' => 'Refund Method',
                    'type' => 'select',
                    'nullable' => true,
                    'choices' => [
                        ['value' => 'original_payment', 'label' => 'Original Payment'],
                        ['value' => 'store_credit', 'label' => 'Store Credit'],
                        ['value' => 'bank_transfer', 'label' => 'Bank Transfer'],
                    ],
                ],
                ['name' => 'refunded_at', 'label' => 'Refunded At', 'type' => 'datetime', 'nullable' => true],
            ],
        ];
    }

    protected function buildListQuery()
    {
        return DB::table('returns')
            ->leftJoin('orders', 'orders.id', '=', 'returns.order_id')
            ->leftJoin('users', 'users.id', '=', 'returns.user_id')
            ->select('returns.*', 'orders.order_number', 'users.name as user_name');
    }

    protected function validationRules(Request $request, ?int $id = null): array
    {
        return [
            'order_id' => ['required', 'exists:orders,id'],
            'user_id' => ['nullable', 'exists:users,id'],
            'return_number' => ['required', 'string', 'max:120', Rule::unique('returns', 'return_number')->ignore($id)],
            'status' => ['required', 'in:requested,approved,rejected,received,refunded'],
            'reason' => ['required', 'in:defective,wrong_item,not_as_described,changed_mind,other'],
            'notes' => ['nullable', 'string'],
            'refund_amount' => ['nullable', 'numeric', 'min:0'],
            'refund_method' => ['nullable', 'in:original_payment,store_credit,bank_transfer'],
            'refunded_at' => ['nullable', 'date'],
        ];
    }
}
