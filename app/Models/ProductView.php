<?php

namespace App\Models;

use App\Models\ProductCatalog\Product;
use App\Models\UserManagement\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductView extends Model
{
    protected $fillable = ['product_id', 'user_id', 'session_id', 'ip_address', 'source', 'viewed_at'];

    public $timestamps = false;

    protected $casts = [
        'viewed_at' => 'datetime',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}




