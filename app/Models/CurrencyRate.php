<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CurrencyRate extends Model
{
    protected $fillable = [
        'base_currency', 'target_currency', 'rate', 'source', 'last_updated_at',
    ];

    protected $casts = [
        'rate'            => 'decimal:6',
        'last_updated_at' => 'datetime',
    ];
}
