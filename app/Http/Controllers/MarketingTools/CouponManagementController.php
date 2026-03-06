<?php

namespace App\Http\Controllers\MarketingTools;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class CouponManagementController extends BaseMarketingToolsController
{
    protected function resourceKey(): string
    {
        return 'coupons';
    }

    protected function resourceDefinition(): array
    {
        return [
            'label' => 'Coupons',
            'description' => 'Discount code setup and limits.',
            'table' => 'coupons',
            'timestamp_mode' => 'full',
            'order_column' => 'coupons.id',
            'search_columns' => [
                'coupons.id',
                'coupons.code',
                'coupons.discount_type',
            ],
            'columns' => [
                ['key' => 'id', 'label' => 'ID'],
                ['key' => 'code', 'label' => 'Code'],
                ['key' => 'discount_type', 'label' => 'Type'],
                ['key' => 'discount_value', 'label' => 'Value'],
                ['key' => 'min_order_amount', 'label' => 'Min Order'],
                ['key' => 'max_uses', 'label' => 'Max Uses'],
                ['key' => 'used_count', 'label' => 'Used'],
                ['key' => 'is_active', 'label' => 'Active'],
                ['key' => 'expires_at', 'label' => 'Expires At'],
            ],
            'fields' => [
                ['name' => 'code', 'label' => 'Code', 'type' => 'text'],
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
                ['name' => 'min_order_amount', 'label' => 'Min Order Amount', 'type' => 'decimal', 'nullable' => true],
                ['name' => 'max_uses', 'label' => 'Max Uses', 'type' => 'number', 'nullable' => true],
                ['name' => 'used_count', 'label' => 'Used Count', 'type' => 'number', 'nullable' => true],
                ['name' => 'is_active', 'label' => 'Is Active', 'type' => 'checkbox', 'nullable' => true],
                ['name' => 'expires_at', 'label' => 'Expires At', 'type' => 'datetime', 'nullable' => true],
            ],
        ];
    }

    protected function buildListQuery()
    {
        return DB::table('coupons')->select('coupons.*');
    }

    protected function validationRules(Request $request, ?int $id = null): array
    {
        return [
            'code' => ['required', 'string', 'max:255', Rule::unique('coupons', 'code')->ignore($id)],
            'discount_type' => ['required', 'in:percentage,fixed'],
            'discount_value' => ['required', 'numeric', 'min:0'],
            'min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'max_uses' => ['nullable', 'integer', 'min:1'],
            'used_count' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'expires_at' => ['nullable', 'date'],
        ];
    }
}
