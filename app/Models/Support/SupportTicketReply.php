<?php

namespace App\Models\Support;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\UserManagement\User;

class SupportTicketReply extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'ticket_id', 'user_id', 'message', 'is_admin_reply',
    ];

    protected $casts = [
        'is_admin_reply' => 'boolean',
        'created_at'     => 'datetime',
        'updated_at'     => 'datetime',
    ];

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(SupportTicket::class, 'ticket_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
