<?php

namespace App\Models\Analytics;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\ProductCatalog\Product;

class TopProduct extends Model
{
    protected $fillable = [
        'product_id', 'period', 'period_date', 'units_sold',
        'total_revenue', 'views', 'conversion_rate', 'rank',
    ];

    protected $casts = [
        'period_date'     => 'date',
        'units_sold'      => 'integer',
        'total_revenue'   => 'decimal:2',
        'views'           => 'integer',
        'conversion_rate' => 'decimal:2',
        'rank'            => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
