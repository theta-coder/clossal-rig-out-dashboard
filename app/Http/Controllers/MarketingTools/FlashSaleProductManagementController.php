<?php

namespace App\Http\Controllers\MarketingTools;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class FlashSaleProductManagementController extends BaseMarketingToolsController
{
    protected function resourceKey(): string
    {
        return 'flash-sale-products';
    }

    protected function resourceDefinition(): array
    {
        return [
            'label' => 'Flash Sale Products',
            'description' => 'Products linked to each flash sale.',
            'table' => 'flash_sale_products',
            'timestamp_mode' => 'full',
            'order_column' => 'flash_sale_products.id',
            'search_columns' => [
                'flash_sale_products.id',
                'flash_sales.name',
                'products.name',
            ],
            'columns' => [
                ['key' => 'id', 'label' => 'ID'],
                ['key' => 'flash_sale_name', 'label' => 'Flash Sale'],
                ['key' => 'product_name', 'label' => 'Product'],
                ['key' => 'sale_price', 'label' => 'Sale Price'],
                ['key' => 'max_quantity', 'label' => 'Max Qty'],
                ['key' => 'sold_count', 'label' => 'Sold'],
            ],
            'fields' => [
                ['name' => 'flash_sale_id', 'label' => 'Flash Sale', 'type' => 'select', 'options' => 'flash_sales'],
                ['name' => 'product_id', 'label' => 'Product', 'type' => 'select', 'options' => 'products'],
                ['name' => 'sale_price', 'label' => 'Sale Price', 'type' => 'decimal', 'nullable' => true],
                ['name' => 'max_quantity', 'label' => 'Max Quantity', 'type' => 'number', 'nullable' => true],
                ['name' => 'sold_count', 'label' => 'Sold Count', 'type' => 'number', 'nullable' => true],
            ],
        ];
    }

    protected function buildListQuery()
    {
        return DB::table('flash_sale_products')
            ->leftJoin('flash_sales', 'flash_sales.id', '=', 'flash_sale_products.flash_sale_id')
            ->leftJoin('products', 'products.id', '=', 'flash_sale_products.product_id')
            ->select(
                'flash_sale_products.*',
                'flash_sales.name as flash_sale_name',
                'products.name as product_name'
            );
    }

    protected function validationRules(Request $request, ?int $id = null): array
    {
        return [
            'flash_sale_id' => ['required', 'exists:flash_sales,id'],
            'product_id' => [
                'required',
                'exists:products,id',
                Rule::unique('flash_sale_products')
                    ->ignore($id)
                    ->where(fn ($query) => $query->where('flash_sale_id', $request->input('flash_sale_id'))),
            ],
            'sale_price' => ['nullable', 'numeric', 'min:0'],
            'max_quantity' => ['nullable', 'integer', 'min:1'],
            'sold_count' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
