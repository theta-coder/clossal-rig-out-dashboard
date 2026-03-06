<?php

namespace App\Models\UserManagement;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CustomerSegment extends Model
{
    protected $fillable = [
        'name', 'description', 'min_spending', 'max_spending',
        'min_orders', 'max_orders', 'days_since_purchase', 'total_customers',
    ];

    protected $casts = [
        'min_spending'       => 'decimal:2',
        'max_spending'       => 'decimal:2',
        'min_orders'         => 'integer',
        'max_orders'         => 'integer',
        'days_since_purchase'=> 'integer',
        'total_customers'    => 'integer',
    ];

    public function mappings(): HasMany
    {
        return $this->hasMany(CustomerSegmentMapping::class, 'segment_id');
    }
}
