<?php

namespace App\Http\Controllers\OrderManagement;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReturnItemManagementController extends BaseOrderManagementController
{
    protected function resourceKey(): string
    {
        return 'return-items';
    }

    protected function resourceDefinition(): array
    {
        return [
            'label' => 'Return Items',
            'description' => 'Line items mapped to each return request.',
            'table' => 'return_items',
            'timestamp_mode' => 'full',
            'order_column' => 'return_items.id',
            'search_columns' => [
                'return_items.id',
                'returns.return_number',
                'order_items.product_name',
                'return_items.reason',
            ],
            'columns' => [
                ['key' => 'id', 'label' => 'ID'],
                ['key' => 'return_number', 'label' => 'Return #'],
                ['key' => 'order_item_name', 'label' => 'Order Item'],
                ['key' => 'quantity', 'label' => 'Qty'],
                ['key' => 'refund_amount', 'label' => 'Refund'],
                ['key' => 'reason', 'label' => 'Reason'],
            ],
            'fields' => [
                ['name' => 'return_id', 'label' => 'Return', 'type' => 'select', 'options' => 'returns'],
                ['name' => 'order_item_id', 'label' => 'Order Item', 'type' => 'select', 'options' => 'order_items'],
                ['name' => 'quantity', 'label' => 'Quantity', 'type' => 'number'],
                ['name' => 'refund_amount', 'label' => 'Refund Amount', 'type' => 'decimal', 'nullable' => true],
                ['name' => 'reason', 'label' => 'Reason', 'type' => 'textarea', 'nullable' => true],
            ],
        ];
    }

    protected function buildListQuery()
    {
        return DB::table('return_items')
            ->leftJoin('returns', 'returns.id', '=', 'return_items.return_id')
            ->leftJoin('order_items', 'order_items.id', '=', 'return_items.order_item_id')
            ->select(
                'return_items.*',
                'returns.return_number',
                DB::raw('COALESCE(order_items.product_name, order_items.id) as order_item_name')
            );
    }

    protected function validationRules(Request $request, ?int $id = null): array
    {
        return [
            'return_id' => ['required', 'exists:returns,id'],
            'order_item_id' => ['required', 'exists:order_items,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'refund_amount' => ['nullable', 'numeric', 'min:0'],
            'reason' => ['nullable', 'string'],
        ];
    }
}
