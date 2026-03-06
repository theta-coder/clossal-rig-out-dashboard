<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GiftCardRedemption extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'gift_card_id', 'order_id', 'amount_used', 'redeemed_at',
    ];

    protected $casts = [
        'amount_used'  => 'decimal:2',
        'redeemed_at'  => 'datetime',
    ];

    public function giftCard(): BelongsTo
    {
        return $this->belongsTo(GiftCard::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
