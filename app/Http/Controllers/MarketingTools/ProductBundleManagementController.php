<?php

namespace App\Http\Controllers\MarketingTools;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ProductBundleManagementController extends BaseMarketingToolsController
{
    protected function resourceKey(): string
    {
        return 'product-bundles';
    }

    protected function resourceDefinition(): array
    {
        return [
            'label' => 'Product Bundles',
            'description' => 'Bundle offers with fixed pricing.',
            'table' => 'product_bundles',
            'timestamp_mode' => 'full',
            'order_column' => 'product_bundles.id',
            'search_columns' => [
                'product_bundles.id',
                'product_bundles.name',
                'product_bundles.slug',
            ],
            'columns' => [
                ['key' => 'id', 'label' => 'ID'],
                ['key' => 'name', 'label' => 'Name'],
                ['key' => 'slug', 'label' => 'Slug'],
                ['key' => 'price', 'label' => 'Price'],
                ['key' => 'original_price', 'label' => 'Original'],
                ['key' => 'is_active', 'label' => 'Active'],
                ['key' => 'starts_at', 'label' => 'Starts At'],
                ['key' => 'ends_at', 'label' => 'Ends At'],
            ],
            'fields' => [
                ['name' => 'name', 'label' => 'Name', 'type' => 'text'],
                ['name' => 'slug', 'label' => 'Slug', 'type' => 'text'],
                ['name' => 'description', 'label' => 'Description', 'type' => 'textarea', 'nullable' => true],
                ['name' => 'image', 'label' => 'Image Path', 'type' => 'text', 'nullable' => true],
                ['name' => 'price', 'label' => 'Price', 'type' => 'decimal'],
                ['name' => 'original_price', 'label' => 'Original Price', 'type' => 'decimal', 'nullable' => true],
                ['name' => 'is_active', 'label' => 'Is Active', 'type' => 'checkbox', 'nullable' => true],
                ['name' => 'starts_at', 'label' => 'Starts At', 'type' => 'datetime', 'nullable' => true],
                ['name' => 'ends_at', 'label' => 'Ends At', 'type' => 'datetime', 'nullable' => true],
            ],
        ];
    }

    protected function buildListQuery()
    {
        return DB::table('product_bundles')->select('product_bundles.*');
    }

    protected function validationRules(Request $request, ?int $id = null): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('product_bundles', 'slug')->ignore($id)],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:500'],
            'price' => ['required', 'numeric', 'min:0'],
            'original_price' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date'],
        ];
    }
}
