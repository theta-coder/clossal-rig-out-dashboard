<?php

namespace App\Http\Controllers\MarketingTools;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class CouponUsageManagementController extends BaseMarketingToolsController
{
    protected function resourceKey(): string
    {
        return 'coupon-usages';
    }

    protected function resourceDefinition(): array
    {
        return [
            'label' => 'Coupon Usages',
            'description' => 'Track coupon usage per order/user.',
            'table' => 'coupon_usages',
            'timestamp_mode' => 'full',
            'order_column' => 'coupon_usages.id',
            'search_columns' => [
                'coupon_usages.id',
                'coupons.code',
                'orders.order_number',
                'users.name',
                'coupon_usages.email',
            ],
            'columns' => [
                ['key' => 'id', 'label' => 'ID'],
                ['key' => 'coupon_code', 'label' => 'Coupon'],
                ['key' => 'order_number', 'label' => 'Order #'],
                ['key' => 'user_name', 'label' => 'User'],
                ['key' => 'email', 'label' => 'Email'],
                ['key' => 'discount_applied', 'label' => 'Discount'],
                ['key' => 'created_at', 'label' => 'Created At'],
            ],
            'fields' => [
                ['name' => 'coupon_id', 'label' => 'Coupon', 'type' => 'select', 'options' => 'coupons'],
                ['name' => 'order_id', 'label' => 'Order', 'type' => 'select', 'options' => 'orders'],
                ['name' => 'user_id', 'label' => 'User', 'type' => 'select', 'options' => 'users', 'nullable' => true],
                ['name' => 'email', 'label' => 'Email', 'type' => 'text', 'nullable' => true],
                ['name' => 'discount_applied', 'label' => 'Discount Applied', 'type' => 'decimal'],
            ],
        ];
    }

    protected function buildListQuery()
    {
        return DB::table('coupon_usages')
            ->leftJoin('coupons', 'coupons.id', '=', 'coupon_usages.coupon_id')
            ->leftJoin('orders', 'orders.id', '=', 'coupon_usages.order_id')
            ->leftJoin('users', 'users.id', '=', 'coupon_usages.user_id')
            ->select(
                'coupon_usages.*',
                'coupons.code as coupon_code',
                'orders.order_number',
                'users.name as user_name'
            );
    }

    protected function validationRules(Request $request, ?int $id = null): array
    {
        return [
            'coupon_id' => ['required', 'exists:coupons,id'],
            'order_id' => [
                'required',
                'exists:orders,id',
                Rule::unique('coupon_usages')
                    ->ignore($id)
                    ->where(fn ($query) => $query->where('coupon_id', $request->input('coupon_id'))),
            ],
            'user_id' => ['nullable', 'exists:users,id'],
            'email' => ['nullable', 'email', 'max:255'],
            'discount_applied' => ['required', 'numeric', 'min:0'],
        ];
    }
}
