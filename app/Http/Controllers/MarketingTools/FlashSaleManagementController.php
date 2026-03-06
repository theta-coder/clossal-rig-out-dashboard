<?php

namespace App\Http\Controllers\MarketingTools;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FlashSaleManagementController extends BaseMarketingToolsController
{
    protected function resourceKey(): string
    {
        return 'flash-sales';
    }

    protected function resourceDefinition(): array
    {
        return [
            'label' => 'Flash Sales',
            'description' => 'Limited-time sale campaigns.',
            'table' => 'flash_sales',
            'timestamp_mode' => 'full',
            'order_column' => 'flash_sales.id',
            'search_columns' => [
                'flash_sales.id',
                'flash_sales.name',
                'flash_sales.discount_type',
            ],
            'columns' => [
                ['key' => 'id', 'label' => 'ID'],
                ['key' => 'name', 'label' => 'Name'],
                ['key' => 'discount_type', 'label' => 'Type'],
                ['key' => 'discount_value', 'label' => 'Value'],
                ['key' => 'starts_at', 'label' => 'Starts At'],
                ['key' => 'ends_at', 'label' => 'Ends At'],
                ['key' => 'is_active', 'label' => 'Active'],
            ],
            'fields' => [
                ['name' => 'name', 'label' => 'Name', 'type' => 'text'],
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
                ['name' => 'starts_at', 'label' => 'Starts At', 'type' => 'datetime', 'nullable' => true],
                ['name' => 'ends_at', 'label' => 'Ends At', 'type' => 'datetime', 'nullable' => true],
                ['name' => 'is_active', 'label' => 'Is Active', 'type' => 'checkbox', 'nullable' => true],
            ],
        ];
    }

    protected function buildListQuery()
    {
        return DB::table('flash_sales')->select('flash_sales.*');
    }

    protected function validationRules(Request $request, ?int $id = null): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'discount_type' => ['required', 'in:percentage,fixed'],
            'discount_value' => ['required', 'numeric', 'min:0'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
