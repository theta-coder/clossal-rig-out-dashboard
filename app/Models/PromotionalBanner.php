<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PromotionalBanner extends Model
{
    protected $fillable = [
        'title',
        'subtitle',
        'image',
        'link_url',
        'position',
        'sort_order',
        'starts_at',
        'ends_at',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at'   => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    public function isLive(): bool
    {
        if (! $this->is_active) return false;
        $now = now();
        if ($this->starts_at && $now->lt($this->starts_at)) return false;
        if ($this->ends_at   && $now->gt($this->ends_at))   return false;
        return true;
    }
}
