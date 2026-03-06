<?php

namespace App\Models\UserManagement;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerSegmentMapping extends Model
{
    protected $table = 'customer_segment_mapping';

    public $timestamps = false;

    protected $fillable = ['user_id', 'segment_id', 'assigned_at'];

    protected $casts = [
        'assigned_at' => 'datetime',
        'updated_at'  => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function segment(): BelongsTo
    {
        return $this->belongsTo(CustomerSegment::class, 'segment_id');
    }
}
