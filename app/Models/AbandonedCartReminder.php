<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AbandonedCartReminder extends Model
{
    protected $fillable = [
        'cart_id',
        'user_id',
        'email',
        'reminder_count',
        'last_sent_at',
        'is_recovered',
        'recovered_at',
    ];

    protected function casts(): array
    {
        return [
            'is_recovered' => 'boolean',
            'last_sent_at' => 'datetime',
            'recovered_at' => 'datetime',
        ];
    }

    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
