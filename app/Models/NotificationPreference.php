<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationPreference extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_placed',
        'order_confirmed',
        'order_shipped',
        'order_delivered',
        'order_cancelled',
        'flash_sale_alerts',
        'new_arrivals',
        'price_drop_alerts',
        'newsletter',
        'review_replies',
        'loyalty_points_update',
        'gift_card_received',
    ];

    protected $casts = [
        'order_placed' => 'boolean',
        'order_confirmed' => 'boolean',
        'order_shipped' => 'boolean',
        'order_delivered' => 'boolean',
        'order_cancelled' => 'boolean',
        'flash_sale_alerts' => 'boolean',
        'new_arrivals' => 'boolean',
        'price_drop_alerts' => 'boolean',
        'newsletter' => 'boolean',
        'review_replies' => 'boolean',
        'loyalty_points_update' => 'boolean',
        'gift_card_received' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
