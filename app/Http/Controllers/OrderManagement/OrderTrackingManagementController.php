<?php

namespace App\Http\Controllers\OrderManagement;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class OrderTrackingManagementController extends BaseOrderManagementController
{
    protected function resourceKey(): string
    {
        return 'order-tracking';
    }

    protected function resourceDefinition(): array
    {
        return [
            'label' => 'Order Tracking',
            'description' => 'Courier and tracking lifecycle details.',
            'table' => 'order_tracking',
            'timestamp_mode' => 'full',
            'order_column' => 'order_tracking.id',
            'search_columns' => [
                'order_tracking.id',
                'orders.order_number',
                'order_tracking.tracking_number',
                'order_tracking.courier_name',
                'order_tracking.notes',
            ],
            'columns' => [
                ['key' => 'id', 'label' => 'ID'],
                ['key' => 'order_number', 'label' => 'Order #'],
                ['key' => 'courier_display', 'label' => 'Courier'],
                ['key' => 'tracking_number', 'label' => 'Tracking #'],
                ['key' => 'estimated_delivery', 'label' => 'ETA'],
                ['key' => 'actual_delivery', 'label' => 'Delivered'],
            ],
            'fields' => [
                ['name' => 'order_id', 'label' => 'Order', 'type' => 'select', 'options' => 'orders'],
                ['name' => 'courier_id', 'label' => 'Courier Company', 'type' => 'select', 'options' => 'courier_companies', 'nullable' => true],
                ['name' => 'courier_name', 'label' => 'Courier Name', 'type' => 'text', 'nullable' => true],
                ['name' => 'tracking_number', 'label' => 'Tracking Number', 'type' => 'text', 'nullable' => true],
                ['name' => 'tracking_url', 'label' => 'Tracking URL', 'type' => 'text', 'nullable' => true],
                ['name' => 'estimated_delivery', 'label' => 'Estimated Delivery', 'type' => 'date', 'nullable' => true],
                ['name' => 'actual_delivery', 'label' => 'Actual Delivery', 'type' => 'date', 'nullable' => true],
                ['name' => 'notes', 'label' => 'Notes', 'type' => 'textarea', 'nullable' => true],
            ],
        ];
    }

    protected function buildListQuery()
    {
        $query = DB::table('order_tracking')
            ->leftJoin('orders', 'orders.id', '=', 'order_tracking.order_id');

        if (Schema::hasTable('courier_companies')) {
            return $query
                ->leftJoin('courier_companies', 'courier_companies.id', '=', 'order_tracking.courier_id')
                ->select(
                    'order_tracking.*',
                    'orders.order_number',
                    DB::raw('COALESCE(courier_companies.name, order_tracking.courier_name) as courier_display')
                );
        }

        return $query->select(
            'order_tracking.*',
            'orders.order_number',
            DB::raw('order_tracking.courier_name as courier_display')
        );
    }

    protected function validationRules(Request $request, ?int $id = null): array
    {
        $courierRule = Schema::hasTable('courier_companies')
            ? ['nullable', 'exists:courier_companies,id']
            : ['nullable', 'integer'];

        return [
            'order_id' => ['required', 'exists:orders,id'],
            'courier_id' => $courierRule,
            'courier_name' => ['nullable', 'string', 'max:255'],
            'tracking_number' => ['nullable', 'string', 'max:255'],
            'tracking_url' => ['nullable', 'url', 'max:500'],
            'estimated_delivery' => ['nullable', 'date'],
            'actual_delivery' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
