<?php

namespace App\Http\Controllers\MarketingTools;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class NewsletterCampaignManagementController extends BaseMarketingToolsController
{
    protected function resourceKey(): string
    {
        return 'newsletter-campaigns';
    }

    protected function resourceDefinition(): array
    {
        return [
            'label' => 'Newsletter Campaigns',
            'description' => 'Email campaign records and stats.',
            'table' => 'newsletter_campaigns',
            'timestamp_mode' => 'full',
            'order_column' => 'newsletter_campaigns.id',
            'search_columns' => [
                'newsletter_campaigns.id',
                'newsletter_campaigns.subject',
                'newsletter_campaigns.status',
                'users.name',
            ],
            'columns' => [
                ['key' => 'id', 'label' => 'ID'],
                ['key' => 'subject', 'label' => 'Subject'],
                ['key' => 'status', 'label' => 'Status'],
                ['key' => 'total_sent', 'label' => 'Sent'],
                ['key' => 'total_failed', 'label' => 'Failed'],
                ['key' => 'total_opened', 'label' => 'Opened'],
                ['key' => 'scheduled_at', 'label' => 'Scheduled At'],
                ['key' => 'sent_at', 'label' => 'Sent At'],
                ['key' => 'creator_name', 'label' => 'Created By'],
            ],
            'fields' => [
                ['name' => 'subject', 'label' => 'Subject', 'type' => 'text'],
                ['name' => 'body', 'label' => 'Body', 'type' => 'textarea'],
                [
                    'name' => 'status',
                    'label' => 'Status',
                    'type' => 'select',
                    'choices' => [
                        ['value' => 'draft', 'label' => 'Draft'],
                        ['value' => 'scheduled', 'label' => 'Scheduled'],
                        ['value' => 'sending', 'label' => 'Sending'],
                        ['value' => 'sent', 'label' => 'Sent'],
                        ['value' => 'cancelled', 'label' => 'Cancelled'],
                    ],
                ],
                ['name' => 'total_sent', 'label' => 'Total Sent', 'type' => 'number', 'nullable' => true],
                ['name' => 'total_failed', 'label' => 'Total Failed', 'type' => 'number', 'nullable' => true],
                ['name' => 'total_opened', 'label' => 'Total Opened', 'type' => 'number', 'nullable' => true],
                ['name' => 'scheduled_at', 'label' => 'Scheduled At', 'type' => 'datetime', 'nullable' => true],
                ['name' => 'sent_at', 'label' => 'Sent At', 'type' => 'datetime', 'nullable' => true],
                ['name' => 'created_by', 'label' => 'Created By', 'type' => 'select', 'options' => 'users'],
            ],
        ];
    }

    protected function buildListQuery()
    {
        $query = DB::table('newsletter_campaigns');

        if (Schema::hasTable('users')) {
            return $query
                ->leftJoin('users', 'users.id', '=', 'newsletter_campaigns.created_by')
                ->select('newsletter_campaigns.*', 'users.name as creator_name');
        }

        return $query->select('newsletter_campaigns.*', DB::raw('NULL as creator_name'));
    }

    protected function validationRules(Request $request, ?int $id = null): array
    {
        return [
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'status' => ['required', 'in:draft,scheduled,sending,sent,cancelled'],
            'total_sent' => ['nullable', 'integer', 'min:0'],
            'total_failed' => ['nullable', 'integer', 'min:0'],
            'total_opened' => ['nullable', 'integer', 'min:0'],
            'scheduled_at' => ['nullable', 'date'],
            'sent_at' => ['nullable', 'date'],
            'created_by' => ['required', 'exists:users,id'],
        ];
    }
}
