<?php

namespace App\Models\Marketing;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CampaignMetrics extends Model
{
    protected $table = 'campaign_metrics';

    public $timestamps = false;

    protected $fillable = [
        'campaign_id', 'date', 'sent', 'delivered', 'failed',
        'opened', 'clicked', 'conversions', 'revenue',
    ];

    protected $casts = [
        'date'        => 'date',
        'sent'        => 'integer',
        'delivered'   => 'integer',
        'failed'      => 'integer',
        'opened'      => 'integer',
        'clicked'     => 'integer',
        'conversions' => 'integer',
        'revenue'     => 'decimal:2',
        'created_at'  => 'datetime',
    ];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }
}
