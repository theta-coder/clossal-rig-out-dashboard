<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SmsTemplate extends Model
{
    protected $fillable = [
        'name', 'slug', 'message', 'variables',
        'is_active', 'category', 'character_count',
    ];

    protected $casts = [
        'variables'       => 'array',
        'is_active'       => 'boolean',
        'character_count' => 'integer',
    ];
}
