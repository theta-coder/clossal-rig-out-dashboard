<?php

namespace App\Http\Controllers\OrderManagement;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderStatusHistoryManagementController extends BaseOrderManagementController
{
    protected function resourceKey(): string
    {
        return 'order-status-histories';
    }

    protected function resourceDefinition(): array
    {
        return [
            'label' => 'Order Status Histories',
            'description' => 'Timeline of order status changes.',
            'table' => 'order_status_histories',
            'timestamp_mode' => 'full',
            'order_column' => 'order_status_histories.id',
            'search_columns' => [
                'order_status_histories.id',
                'orders.order_number',
                'order_status_histories.status',
                'order_status_histories.notes',
            ],
            'columns' => [
                ['key' => 'id', 'label' => 'ID'],
                ['key' => 'order_number', 'label' => 'Order #'],
                ['key' => 'status', 'label' => 'Status'],
                ['key' => 'notes', 'label' => 'Notes'],
                ['key' => 'created_at', 'label' => 'Created At'],
            ],
            'fields' => [
                ['name' => 'order_id', 'label' => 'Order', 'type' => 'select', 'options' => 'orders'],
                [
                    'name' => 'status',
                    'label' => 'Status',
                    'type' => 'select',
                    'choices' => [
                        ['value' => 'pending', 'label' => 'Pending'],
                        ['value' => 'confirmed', 'label' => 'Confirmed'],
                        ['value' => 'ready_to_ship', 'label' => 'Ready To Ship'],
                        ['value' => 'shipped', 'label' => 'Shipped'],
                        ['value' => 'delivered', 'label' => 'Delivered'],
                        ['value' => 'cancelled', 'label' => 'Cancelled'],
                    ],
                ],
                ['name' => 'notes', 'label' => 'Notes', 'type' => 'textarea', 'nullable' => true],
            ],
        ];
    }

    protected function buildListQuery()
    {
        return DB::table('order_status_histories')
            ->leftJoin('orders', 'orders.id', '=', 'order_status_histories.order_id')
            ->select('order_status_histories.*', 'orders.order_number');
    }

    protected function validationRules(Request $request, ?int $id = null): array
    {
        return [
            'order_id' => ['required', 'exists:orders,id'],
            'status' => ['required', 'in:pending,confirmed,ready_to_ship,shipped,delivered,cancelled'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
