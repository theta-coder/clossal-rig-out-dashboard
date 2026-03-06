<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\UserManagement\User;

class PaymentFailure extends Model
{
    protected $fillable = [
        'order_id', 'user_id', 'payment_method', 'amount',
        'failure_reason', 'error_code', 'retry_count',
        'last_retry_at', 'is_resolved', 'resolved_at',
    ];

    protected $casts = [
        'amount'        => 'decimal:2',
        'retry_count'   => 'integer',
        'last_retry_at' => 'datetime',
        'is_resolved'   => 'boolean',
        'resolved_at'   => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
