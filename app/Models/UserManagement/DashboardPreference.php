<?php

namespace App\Models\UserManagement;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DashboardPreference extends Model
{
    protected $fillable = [
        'user_id', 'widgets', 'layout', 'default_date_range', 'is_default',
    ];

    protected $casts = [
        'widgets'    => 'array',
        'layout'     => 'array',
        'is_default' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
