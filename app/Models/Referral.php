<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Referral extends Model
{
    protected $fillable = ['referrer_id', 'referred_id', 'referral_code', 'order_id', 'status', 'reward_points'];

    public function referrer()
    {
        return $this->belongsTo(User::class , 'referrer_id');
    }

    public function referred()
    {
        return $this->belongsTo(User::class , 'referred_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}


