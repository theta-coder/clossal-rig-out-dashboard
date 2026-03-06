<?php

namespace App\Models\Analytics;

use Illuminate\Database\Eloquent\Model;

class DailySalesSummary extends Model
{
    protected $fillable = [
        'date', 'total_orders', 'total_revenue', 'total_customers',
        'average_order_value', 'total_items_sold', 'refund_count', 'refund_amount',
    ];

    protected $casts = [
        'date'                => 'date',
        'total_orders'        => 'integer',
        'total_revenue'       => 'decimal:2',
        'total_customers'     => 'integer',
        'average_order_value' => 'decimal:2',
        'total_items_sold'    => 'integer',
        'refund_count'        => 'integer',
        'refund_amount'       => 'decimal:2',
    ];
}
