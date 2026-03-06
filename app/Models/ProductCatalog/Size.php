<?php

namespace App\Models\ProductCatalog;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Size extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function productSizes(): HasMany
    {
        return $this->hasMany(ProductSize::class);
    }
}










