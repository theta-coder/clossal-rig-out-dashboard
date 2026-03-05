<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CodCollection extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'rider_id',
        'amount_collected',
        'amount_submitted',
        'status',
        'collected_at',
        'submitted_at',
        'verified_by',
        'verified_at',
        'notes',
    ];

    protected $casts = [
        'amount_collected' => 'decimal:2',
        'amount_submitted' => 'decimal:2',
        'collected_at' => 'datetime',
        'submitted_at' => 'datetime',
        'verified_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function rider(): BelongsTo
    {
        return $this->belongsTo(Rider::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class , 'verified_by');
    }
}
