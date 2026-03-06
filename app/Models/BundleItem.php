<?php

namespace App\Models;

use App\Models\ProductCatalog\Product;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BundleItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'bundle_id',
        'product_id',
        'product_variant_id',
        'quantity',
    ];

    public function bundle(): BelongsTo
    {
        return $this->belongsTo(ProductBundle::class , 'bundle_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class , 'product_variant_id');
    }
}




