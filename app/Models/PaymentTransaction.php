<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentTransaction extends Model
{
    protected $fillable = [
        'order_id',
        'user_id',
        'transaction_ref',
        'gateway',
        'method',
        'amount',
        'status',
        'payment_at',
        'gateway_response',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'amount'     => 'decimal:2',
            'payment_at' => 'datetime',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
