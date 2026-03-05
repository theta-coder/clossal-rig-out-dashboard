<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id',
        'size_id',
        'color_id',
        'sku',
        'barcode',
        'stock',
        'price',
        'weight',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'weight' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function size(): BelongsTo
    {
        return $this->belongsTo(Size::class);
    }

    public function color(): BelongsTo
    {
        return $this->belongsTo(Color::class);
    }

    public function stockLogs(): HasMany
    {
        return $this->hasMany(StockLog::class , 'variant_id');
    }

    public function lowStockAlert(): HasMany
    {
        return $this->hasMany(LowStockAlert::class , 'variant_id');
    }

    public function variantImages(): HasMany
    {
        return $this->hasMany(ProductVariantImage::class , 'variant_id');
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(StockReservation::class , 'variant_id');
    }
}
