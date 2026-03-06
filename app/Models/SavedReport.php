<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SavedReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'admin_id',
        'name',
        'type',
        'filters',
        'columns',
        'format',
        'is_scheduled',
        'schedule_frequency',
        'schedule_email',
        'last_run_at',
    ];

    protected $casts = [
        'filters' => 'json',
        'columns' => 'json',
        'is_scheduled' => 'boolean',
        'last_run_at' => 'datetime',
    ];

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class , 'admin_id');
    }
}

