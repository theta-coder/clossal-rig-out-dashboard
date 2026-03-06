<?php

namespace App\Models\Analytics;

use Illuminate\Database\Eloquent\Model;

class ConversionFunnel extends Model
{
    protected $table = 'conversion_funnel';

    protected $fillable = [
        'date', 'visitors', 'product_views', 'add_to_cart',
        'checkout_start', 'orders_completed',
        'visitor_to_view_rate', 'view_to_cart_rate',
        'cart_to_checkout_rate', 'checkout_to_order_rate',
        'overall_conversion_rate',
    ];

    protected $casts = [
        'date'                    => 'date',
        'visitors'                => 'integer',
        'product_views'           => 'integer',
        'add_to_cart'             => 'integer',
        'checkout_start'          => 'integer',
        'orders_completed'        => 'integer',
        'visitor_to_view_rate'    => 'decimal:2',
        'view_to_cart_rate'       => 'decimal:2',
        'cart_to_checkout_rate'   => 'decimal:2',
        'checkout_to_order_rate'  => 'decimal:2',
        'overall_conversion_rate' => 'decimal:2',
    ];
}
