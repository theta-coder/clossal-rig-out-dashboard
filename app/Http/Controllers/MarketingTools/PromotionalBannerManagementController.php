<?php

namespace App\Http\Controllers\MarketingTools;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PromotionalBannerManagementController extends BaseMarketingToolsController
{
    protected function resourceKey(): string
    {
        return 'promotional-banners';
    }

    protected function resourceDefinition(): array
    {
        return [
            'label' => 'Promotional Banners',
            'description' => 'Hero, sidebar, popup campaign banners.',
            'table' => 'promotional_banners',
            'timestamp_mode' => 'full',
            'order_column' => 'promotional_banners.id',
            'search_columns' => [
                'promotional_banners.id',
                'promotional_banners.title',
                'promotional_banners.subtitle',
                'promotional_banners.position',
            ],
            'columns' => [
                ['key' => 'id', 'label' => 'ID'],
                ['key' => 'title', 'label' => 'Title'],
                ['key' => 'position', 'label' => 'Position'],
                ['key' => 'sort_order', 'label' => 'Sort'],
                ['key' => 'is_active', 'label' => 'Active'],
                ['key' => 'starts_at', 'label' => 'Starts At'],
                ['key' => 'ends_at', 'label' => 'Ends At'],
            ],
            'fields' => [
                ['name' => 'title', 'label' => 'Title', 'type' => 'text', 'nullable' => true],
                ['name' => 'subtitle', 'label' => 'Subtitle', 'type' => 'text', 'nullable' => true],
                ['name' => 'image', 'label' => 'Image Path', 'type' => 'text'],
                ['name' => 'link_url', 'label' => 'Link URL', 'type' => 'text', 'nullable' => true],
                [
                    'name' => 'position',
                    'label' => 'Position',
                    'type' => 'select',
                    'choices' => [
                        ['value' => 'hero', 'label' => 'Hero'],
                        ['value' => 'sidebar', 'label' => 'Sidebar'],
                        ['value' => 'top_bar', 'label' => 'Top Bar'],
                        ['value' => 'popup', 'label' => 'Popup'],
                        ['value' => 'category', 'label' => 'Category'],
                    ],
                ],
                ['name' => 'sort_order', 'label' => 'Sort Order', 'type' => 'number', 'nullable' => true],
                ['name' => 'starts_at', 'label' => 'Starts At', 'type' => 'datetime', 'nullable' => true],
                ['name' => 'ends_at', 'label' => 'Ends At', 'type' => 'datetime', 'nullable' => true],
                ['name' => 'is_active', 'label' => 'Is Active', 'type' => 'checkbox', 'nullable' => true],
            ],
        ];
    }

    protected function buildListQuery()
    {
        return DB::table('promotional_banners')->select('promotional_banners.*');
    }

    protected function validationRules(Request $request, ?int $id = null): array
    {
        return [
            'title' => ['nullable', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'image' => ['required', 'string', 'max:500'],
            'link_url' => ['nullable', 'string', 'max:500'],
            'position' => ['required', 'in:hero,sidebar,top_bar,popup,category'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
