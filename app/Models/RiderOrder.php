<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RiderOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'rider_id',
        'order_id',
        'status',
        'assigned_at',
        'picked_up_at',
        'delivered_at',
        'delivery_fee',
        'notes',
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
        'picked_up_at' => 'datetime',
        'delivered_at' => 'datetime',
        'delivery_fee' => 'decimal:2',
    ];

    public function rider(): BelongsTo
    {
        return $this->belongsTo(Rider::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
