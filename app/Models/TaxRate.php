<?php

namespace App\Models;

use App\Models\ProductCatalog\Category;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaxRate extends Model
{
    protected $fillable = [
        'name',
        'rate',
        'applies_to',
        'category_id',
        'zone_id',
        'is_inclusive',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'rate'         => 'decimal:2',
            'is_inclusive' => 'boolean',
            'is_active'    => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function zone(): BelongsTo
    {
        return $this->belongsTo(ShippingZone::class, 'zone_id');
    }
}



