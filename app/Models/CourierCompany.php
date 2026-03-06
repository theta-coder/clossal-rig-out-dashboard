<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourierCompany extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'logo',
        'tracking_url_format',
        'api_key',
        'api_secret',
        'api_url',
        'contact_number',
        'contact_email',
        'default_rate',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'default_rate' => 'decimal:2',
    ];

    public function trackingLogs(): HasMany
    {
        return $this->hasMany(OrderTracking::class , 'courier_id');
    }
}


