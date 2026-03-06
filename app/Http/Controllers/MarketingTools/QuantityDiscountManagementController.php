<?php

namespace App\Http\Controllers\MarketingTools;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuantityDiscountManagementController extends BaseMarketingToolsController
{
    protected function resourceKey(): string
    {
        return 'quantity-discounts';
    }

    protected function resourceDefinition(): array
    {
        return [
            'label' => 'Quantity Discounts',
            'description' => 'Bulk and buy-more discount rules.',
            'table' => 'quantity_discounts',
            'timestamp_mode' => 'full',
            'order_column' => 'quantity_discounts.id',
            'search_columns' => [
                'quantity_discounts.id',
                'products.name',
                'categories.name',
                'quantity_discounts.discount_type',
            ],
            'columns' => [
                ['key' => 'id', 'label' => 'ID'],
                ['key' => 'product_name', 'label' => 'Product'],
                ['key' => 'category_name', 'label' => 'Category'],
                ['key' => 'min_quantity', 'label' => 'Min Qty'],
                ['key' => 'discount_type', 'label' => 'Type'],
                ['key' => 'discount_value', 'label' => 'Value'],
                ['key' => 'is_active', 'label' => 'Active'],
                ['key' => 'starts_at', 'label' => 'Starts At'],
                ['key' => 'ends_at', 'label' => 'Ends At'],
            ],
            'fields' => [
                ['name' => 'product_id', 'label' => 'Product', 'type' => 'select', 'options' => 'products', 'nullable' => true],
                ['name' => 'category_id', 'label' => 'Category', 'type' => 'select', 'options' => 'categories', 'nullable' => true],
                ['name' => 'min_quantity', 'label' => 'Min Quantity', 'type' => 'number'],
                [
                    'name' => 'discount_type',
                    'label' => 'Discount Type',
                    'type' => 'select',
                    'choices' => [
                        ['value' => 'percentage', 'label' => 'Percentage'],
                        ['value' => 'fixed', 'label' => 'Fixed'],
                    ],
                ],
                ['name' => 'discount_value', 'label' => 'Discount Value', 'type' => 'decimal'],
                ['name' => 'is_active', 'label' => 'Is Active', 'type' => 'checkbox', 'nullable' => true],
                ['name' => 'starts_at', 'label' => 'Starts At', 'type' => 'datetime', 'nullable' => true],
                ['name' => 'ends_at', 'label' => 'Ends At', 'type' => 'datetime', 'nullable' => true],
            ],
        ];
    }

    protected function buildListQuery()
    {
        return DB::table('quantity_discounts')
            ->leftJoin('products', 'products.id', '=', 'quantity_discounts.product_id')
            ->leftJoin('categories', 'categories.id', '=', 'quantity_discounts.category_id')
            ->select(
                'quantity_discounts.*',
                'products.name as product_name',
                'categories.name as category_name'
            );
    }

    protected function validationRules(Request $request, ?int $id = null): array
    {
        return [
            'product_id' => ['nullable', 'exists:products,id'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'min_quantity' => ['required', 'integer', 'min:1'],
            'discount_type' => ['required', 'in:percentage,fixed'],
            'discount_value' => ['required', 'numeric', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date'],
        ];
    }
}
