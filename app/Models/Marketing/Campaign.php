<?php

namespace App\Models\Marketing;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\UserManagement\User;

class Campaign extends Model
{
    protected $fillable = [
        'name', 'description', 'type', 'target_segment_id', 'status',
        'start_date', 'end_date', 'total_sent', 'total_opened',
        'total_clicked', 'total_converted', 'budget', 'spent', 'created_by',
    ];

    protected $casts = [
        'start_date'      => 'date',
        'end_date'        => 'date',
        'total_sent'      => 'integer',
        'total_opened'    => 'integer',
        'total_clicked'   => 'integer',
        'total_converted' => 'integer',
        'budget'          => 'decimal:2',
        'spent'           => 'decimal:2',
    ];

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function metrics(): HasMany
    {
        return $this->hasMany(CampaignMetrics::class);
    }
}
