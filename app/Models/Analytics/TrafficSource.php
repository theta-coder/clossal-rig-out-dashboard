<?php

namespace App\Models\Analytics;

use Illuminate\Database\Eloquent\Model;

class TrafficSource extends Model
{
    protected $fillable = [
        'date', 'source', 'visitors', 'sessions', 'bounces',
        'bounce_rate', 'conversions', 'conversion_rate', 'revenue',
    ];

    protected $casts = [
        'date'            => 'date',
        'visitors'        => 'integer',
        'sessions'        => 'integer',
        'bounces'         => 'integer',
        'bounce_rate'     => 'decimal:2',
        'conversions'     => 'integer',
        'conversion_rate' => 'decimal:2',
        'revenue'         => 'decimal:2',
    ];
}
