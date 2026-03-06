<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PushNotificationLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'message',
        'target_type',
        'target_id',
        'sent_by',
        'sent_count',
        'status',
    ];
}


