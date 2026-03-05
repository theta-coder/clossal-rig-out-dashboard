<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderTracking extends Model
{
    protected $fillable = [
        'order_id',
        'courier_name',
        'tracking_number',
        'tracking_url',
        'estimated_delivery',
        'actual_delivery',
        'notes',
        'courier_id',
    ];

    protected function casts(): array
    {
        return [
            'estimated_delivery' => 'date',
            'actual_delivery' => 'date',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function courierCompany(): BelongsTo
    {
        return $this->belongsTo(CourierCompany::class , 'courier_id');
    }
}
