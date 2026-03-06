<?php

namespace App\Models\ProductCatalog;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CollectionProduct extends Model
{
    use HasFactory;

    protected $table = 'collection_product';

    protected $fillable = [
        'collection_id',
        'product_id',
        'sort_order',
    ];

    public function collection(): BelongsTo
    {
        return $this->belongsTo(Collection::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}










