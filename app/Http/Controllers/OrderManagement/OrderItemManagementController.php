<?php

namespace App\Http\Controllers\OrderManagement;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderItemManagementController extends BaseOrderManagementController
{
    protected function resourceKey(): string
    {
        return 'order-items';
    }

    protected function resourceDefinition(): array
    {
        return [
            'label' => 'Order Items',
            'description' => 'Products linked with each order.',
            'table' => 'order_items',
            'timestamp_mode' => 'full',
            'order_column' => 'order_items.id',
            'search_columns' => [
                'order_items.id',
                'orders.order_number',
                'order_items.product_name',
                'products.name',
                'order_items.size',
                'order_items.color',
            ],
            'columns' => [
                ['key' => 'id', 'label' => 'ID'],
                ['key' => 'order_number', 'label' => 'Order #'],
                ['key' => 'display_product_name', 'label' => 'Product'],
                ['key' => 'size', 'label' => 'Size'],
                ['key' => 'color', 'label' => 'Color'],
                ['key' => 'quantity', 'label' => 'Qty'],
                ['key' => 'price', 'label' => 'Price'],
            ],
            'fields' => [
                ['name' => 'order_id', 'label' => 'Order', 'type' => 'select', 'options' => 'orders'],
                ['name' => 'product_id', 'label' => 'Product', 'type' => 'select', 'options' => 'products'],
                ['name' => 'product_name', 'label' => 'Product Name', 'type' => 'text'],
                ['name' => 'product_image', 'label' => 'Product Image', 'type' => 'text', 'nullable' => true],
                ['name' => 'size', 'label' => 'Size', 'type' => 'text'],
                ['name' => 'color', 'label' => 'Color', 'type' => 'text', 'nullable' => true],
                ['name' => 'quantity', 'label' => 'Quantity', 'type' => 'number'],
                ['name' => 'price', 'label' => 'Price', 'type' => 'decimal'],
            ],
        ];
    }

    protected function buildListQuery()
    {
        return DB::table('order_items')
            ->leftJoin('orders', 'orders.id', '=', 'order_items.order_id')
            ->leftJoin('products', 'products.id', '=', 'order_items.product_id')
            ->select(
                'order_items.*',
                'orders.order_number',
                DB::raw('COALESCE(order_items.product_name, products.name) as display_product_name')
            );
    }

    protected function validationRules(Request $request, ?int $id = null): array
    {
        return [
            'order_id' => ['required', 'exists:orders,id'],
            'product_id' => ['required', 'exists:products,id'],
            'product_name' => ['required', 'string', 'max:255'],
            'product_image' => ['nullable', 'string', 'max:500'],
            'size' => ['required', 'string', 'max:100'],
            'color' => ['nullable', 'string', 'max:100'],
            'quantity' => ['required', 'integer', 'min:1'],
            'price' => ['required', 'numeric', 'min:0'],
        ];
    }
}
