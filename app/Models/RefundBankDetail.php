<?php

namespace App\Models;

use App\Models\UserManagement\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RefundBankDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'return_id',
        'user_id',
        'bank_name',
        'account_title',
        'account_number',
        'iban',
        'branch_code',
        'status',
        'processed_at',
        'transaction_reference',
        'notes',
    ];

    protected $casts = [
        'processed_at' => 'datetime',
    ];

    public function returnRequest(): BelongsTo
    {
        return $this->belongsTo(ProductReturn::class, 'return_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}


