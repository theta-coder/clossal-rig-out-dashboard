<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoyaltyPoint extends Model
{
    protected $fillable = ['user_id', 'total_earned', 'total_spent', 'balance'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}


