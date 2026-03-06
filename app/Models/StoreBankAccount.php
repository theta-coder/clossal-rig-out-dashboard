<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreBankAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'bank_name',
        'account_title',
        'account_number',
        'iban',
        'branch_code',
        'branch_name',
        'type',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}

