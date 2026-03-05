<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReturnItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'return_id',
        'order_item_id',
        'quantity',
        'refund_amount',
        'reason',
    ];

    protected $casts = [
        'refund_amount' => 'decimal:2',
    ];

    public function returnRequest(): BelongsTo
    {
        return $this->belongsTo(ProductReturn::class , 'return_id');
    }

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }
}
