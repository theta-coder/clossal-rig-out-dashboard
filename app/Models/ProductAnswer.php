<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'question_id',
        'user_id',
        'is_admin_reply',
        'answer',
        'status',
        'helpful_count',
    ];

    protected $casts = [
        'is_admin_reply' => 'boolean',
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(ProductQuestion::class , 'question_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}


