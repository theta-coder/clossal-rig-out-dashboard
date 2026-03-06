<?php

namespace App\Http\Controllers\MarketingTools;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BundleItemManagementController extends BaseMarketingToolsController
{
    protected function resourceKey(): string
    {
        return 'bundle-items';
    }

    protected function resourceDefinition(): array
    {
        return [
            'label' => 'Bundle Items',
            'description' => 'Products assigned inside bundles.',
            'table' => 'bundle_items',
            'timestamp_mode' => 'full',
            'order_column' => 'bundle_items.id',
            'search_columns' => [
                'bundle_items.id',
                'product_bundles.name',
                'products.name',
                'product_variants.sku',
            ],
            'columns' => [
                ['key' => 'id', 'label' => 'ID'],
                ['key' => 'bundle_name', 'label' => 'Bundle'],
                ['key' => 'product_name', 'label' => 'Product'],
                ['key' => 'variant_sku', 'label' => 'Variant'],
                ['key' => 'quantity', 'label' => 'Qty'],
            ],
            'fields' => [
                ['name' => 'bundle_id', 'label' => 'Bundle', 'type' => 'select', 'options' => 'product_bundles'],
                ['name' => 'product_id', 'label' => 'Product', 'type' => 'select', 'options' => 'products'],
                ['name' => 'product_variant_id', 'label' => 'Variant', 'type' => 'select', 'options' => 'product_variants', 'nullable' => true],
                ['name' => 'quantity', 'label' => 'Quantity', 'type' => 'number'],
            ],
        ];
    }

    protected function buildListQuery()
    {
        $query = DB::table('bundle_items')
            ->leftJoin('product_bundles', 'product_bundles.id', '=', 'bundle_items.bundle_id')
            ->leftJoin('products', 'products.id', '=', 'bundle_items.product_id');

        if (\Illuminate\Support\Facades\Schema::hasTable('product_variants')) {
            return $query
                ->leftJoin('product_variants', 'product_variants.id', '=', 'bundle_items.product_variant_id')
                ->select(
                    'bundle_items.*',
                    'product_bundles.name as bundle_name',
                    'products.name as product_name',
                    'product_variants.sku as variant_sku'
                );
        }

        return $query->select(
            'bundle_items.*',
            'product_bundles.name as bundle_name',
            'products.name as product_name',
            DB::raw('NULL as variant_sku')
        );
    }

    protected function validationRules(Request $request, ?int $id = null): array
    {
        $variantRule = \Illuminate\Support\Facades\Schema::hasTable('product_variants')
            ? ['nullable', 'exists:product_variants,id']
            : ['nullable', 'integer'];

        return [
            'bundle_id' => ['required', 'exists:product_bundles,id'],
            'product_id' => ['required', 'exists:products,id'],
            'product_variant_id' => $variantRule,
            'quantity' => ['required', 'integer', 'min:1'],
        ];
    }
}
