<?php

namespace App\Http\Controllers\OrderManagement;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CodCollectionManagementController extends BaseOrderManagementController
{
    protected function resourceKey(): string
    {
        return 'cod-collections';
    }

    protected function resourceDefinition(): array
    {
        return [
            'label' => 'COD Collections',
            'description' => 'Cash collection and settlement records.',
            'table' => 'cod_collections',
            'timestamp_mode' => 'full',
            'order_column' => 'cod_collections.id',
            'search_columns' => [
                'cod_collections.id',
                'orders.order_number',
                'users.name',
                'cod_collections.status',
                'cod_collections.notes',
            ],
            'columns' => [
                ['key' => 'id', 'label' => 'ID'],
                ['key' => 'order_number', 'label' => 'Order #'],
                ['key' => 'rider_name', 'label' => 'Rider'],
                ['key' => 'amount_collected', 'label' => 'Collected'],
                ['key' => 'amount_submitted', 'label' => 'Submitted'],
                ['key' => 'status', 'label' => 'Status'],
                ['key' => 'collected_at', 'label' => 'Collected At'],
            ],
            'fields' => [
                ['name' => 'order_id', 'label' => 'Order', 'type' => 'select', 'options' => 'orders'],
                ['name' => 'rider_id', 'label' => 'Rider', 'type' => 'select', 'options' => 'riders'],
                ['name' => 'amount_collected', 'label' => 'Amount Collected', 'type' => 'decimal'],
                ['name' => 'amount_submitted', 'label' => 'Amount Submitted', 'type' => 'decimal', 'nullable' => true],
                [
                    'name' => 'status',
                    'label' => 'Status',
                    'type' => 'select',
                    'choices' => [
                        ['value' => 'collected', 'label' => 'Collected'],
                        ['value' => 'submitted', 'label' => 'Submitted'],
                        ['value' => 'verified', 'label' => 'Verified'],
                        ['value' => 'shortage', 'label' => 'Shortage'],
                        ['value' => 'excess', 'label' => 'Excess'],
                    ],
                ],
                ['name' => 'collected_at', 'label' => 'Collected At', 'type' => 'datetime', 'nullable' => true],
                ['name' => 'submitted_at', 'label' => 'Submitted At', 'type' => 'datetime', 'nullable' => true],
                ['name' => 'verified_by', 'label' => 'Verified By', 'type' => 'select', 'options' => 'users', 'nullable' => true],
                ['name' => 'verified_at', 'label' => 'Verified At', 'type' => 'datetime', 'nullable' => true],
                ['name' => 'notes', 'label' => 'Notes', 'type' => 'textarea', 'nullable' => true],
            ],
        ];
    }

    protected function buildListQuery()
    {
        return DB::table('cod_collections')
            ->leftJoin('orders', 'orders.id', '=', 'cod_collections.order_id')
            ->leftJoin('riders', 'riders.id', '=', 'cod_collections.rider_id')
            ->leftJoin('users', 'users.id', '=', 'riders.user_id')
            ->select('cod_collections.*', 'orders.order_number', 'users.name as rider_name');
    }

    protected function validationRules(Request $request, ?int $id = null): array
    {
        return [
            'order_id' => ['required', 'exists:orders,id'],
            'rider_id' => ['required', 'exists:riders,id'],
            'amount_collected' => ['required', 'numeric', 'min:0'],
            'amount_submitted' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', 'in:collected,submitted,verified,shortage,excess'],
            'collected_at' => ['nullable', 'date'],
            'submitted_at' => ['nullable', 'date'],
            'verified_by' => ['nullable', 'exists:users,id'],
            'verified_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
