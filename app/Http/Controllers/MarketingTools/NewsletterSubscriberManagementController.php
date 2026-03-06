<?php

namespace App\Http\Controllers\MarketingTools;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class NewsletterSubscriberManagementController extends BaseMarketingToolsController
{
    protected function resourceKey(): string
    {
        return 'newsletter-subscribers';
    }

    protected function resourceDefinition(): array
    {
        return [
            'label' => 'Newsletter Subscribers',
            'description' => 'Newsletter subscription list.',
            'table' => 'newsletter_subscribers',
            'timestamp_mode' => 'full',
            'order_column' => 'newsletter_subscribers.id',
            'search_columns' => [
                'newsletter_subscribers.id',
                'newsletter_subscribers.email',
            ],
            'columns' => [
                ['key' => 'id', 'label' => 'ID'],
                ['key' => 'email', 'label' => 'Email'],
                ['key' => 'is_active', 'label' => 'Active'],
                ['key' => 'created_at', 'label' => 'Subscribed At'],
            ],
            'fields' => [
                ['name' => 'email', 'label' => 'Email', 'type' => 'text'],
                ['name' => 'is_active', 'label' => 'Is Active', 'type' => 'checkbox', 'nullable' => true],
            ],
        ];
    }

    protected function buildListQuery()
    {
        return DB::table('newsletter_subscribers')->select('newsletter_subscribers.*');
    }

    protected function validationRules(Request $request, ?int $id = null): array
    {
        return [
            'email' => ['required', 'email', 'max:255', Rule::unique('newsletter_subscribers', 'email')->ignore($id)],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
