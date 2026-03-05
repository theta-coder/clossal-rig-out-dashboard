<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Rider extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'cnic',
        'vehicle_type',
        'vehicle_number',
        'license_number',
        'status',
        'city',
        'zone',
        'total_earnings',
        'paid_earnings',
        'total_deliveries',
        'joining_date',
    ];

    protected $casts = [
        'joining_date' => 'date',
        'total_earnings' => 'decimal:2',
        'paid_earnings' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(RiderOrder::class);
    }

    public function locations(): HasMany
    {
        return $this->hasMany(RiderLocation::class);
    }

    public function codCollections(): HasMany
    {
        return $this->hasMany(CodCollection::class);
    }
}
