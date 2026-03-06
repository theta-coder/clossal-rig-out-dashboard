<?php

namespace App\Models\Analytics;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\UserManagement\User;

class TopCustomer extends Model
{
    protected $fillable = [
        'user_id', 'total_orders', 'total_spent', 'average_order_value',
        'last_purchase_at', 'customer_since', 'is_vip', 'lifetime_value',
    ];

    protected $casts = [
        'total_orders'        => 'integer',
        'total_spent'         => 'decimal:2',
        'average_order_value' => 'decimal:2',
        'last_purchase_at'    => 'datetime',
        'customer_since'      => 'datetime',
        'is_vip'              => 'boolean',
        'lifetime_value'      => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
