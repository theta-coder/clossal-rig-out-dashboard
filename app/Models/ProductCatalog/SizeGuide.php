<?php

namespace App\Models\ProductCatalog;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SizeGuide extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category_id',
        'columns',
        'is_active',
    ];

    protected $casts = [
        'columns' => 'array',
        'is_active' => 'boolean',
    ];

    public function rows(): HasMany
    {
        return $this->hasMany(SizeGuideRow::class);
    }
}
