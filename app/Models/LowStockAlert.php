<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LowStockAlert extends Model
{
    protected $fillable = [
        'product_id',
        'variant_id',
        'threshold',
        'is_alerted',
        'last_alerted_at',
    ];

    protected function casts(): array
    {
        return [
            'is_alerted'      => 'boolean',
            'last_alerted_at' => 'datetime',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }
}
