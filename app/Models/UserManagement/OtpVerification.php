<?php

namespace App\Models\UserManagement;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OtpVerification extends Model
{
    use HasFactory;

    public $timestamps = false; // Manually managed or created_at only

    protected $fillable = [
        'phone',
        'email',
        'otp',
        'type',
        'ip_address',
        'is_used',
        'attempts',
        'expires_at',
        'used_at',
        'created_at',
    ];

    protected $casts = [
        'is_used' => 'boolean',
        'expires_at' => 'datetime',
        'used_at' => 'datetime',
        'created_at' => 'datetime',
    ];
}



