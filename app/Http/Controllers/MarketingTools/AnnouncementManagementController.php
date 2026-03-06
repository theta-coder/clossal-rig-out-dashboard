<?php

namespace App\Http\Controllers\MarketingTools;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnnouncementManagementController extends BaseMarketingToolsController
{
    protected function resourceKey(): string
    {
        return 'announcements';
    }

    protected function resourceDefinition(): array
    {
        return [
            'label' => 'Announcements',
            'description' => 'Site-wide notification banners.',
            'table' => 'announcements',
            'timestamp_mode' => 'full',
            'order_column' => 'announcements.id',
            'search_columns' => [
                'announcements.id',
                'announcements.message',
                'announcements.link_text',
                'announcements.link_url',
            ],
            'columns' => [
                ['key' => 'id', 'label' => 'ID'],
                ['key' => 'message', 'label' => 'Message'],
                ['key' => 'link_text', 'label' => 'Link Text'],
                ['key' => 'link_url', 'label' => 'Link URL'],
                ['key' => 'is_active', 'label' => 'Active'],
                ['key' => 'created_at', 'label' => 'Created At'],
            ],
            'fields' => [
                ['name' => 'message', 'label' => 'Message', 'type' => 'textarea'],
                ['name' => 'link_text', 'label' => 'Link Text', 'type' => 'text', 'nullable' => true],
                ['name' => 'link_url', 'label' => 'Link URL', 'type' => 'text', 'nullable' => true],
                ['name' => 'is_active', 'label' => 'Is Active', 'type' => 'checkbox', 'nullable' => true],
            ],
        ];
    }

    protected function buildListQuery()
    {
        return DB::table('announcements')->select('announcements.*');
    }

    protected function validationRules(Request $request, ?int $id = null): array
    {
        return [
            'message' => ['required', 'string'],
            'link_text' => ['nullable', 'string', 'max:255'],
            'link_url' => ['nullable', 'string', 'max:500'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
