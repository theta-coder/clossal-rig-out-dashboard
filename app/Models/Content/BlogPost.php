<?php

namespace App\Models\Content;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\UserManagement\User;

class BlogPost extends Model
{
    protected $fillable = [
        'title', 'slug', 'content', 'excerpt', 'featured_image',
        'author_id', 'category', 'tags', 'status', 'views', 'published_at',
    ];

    protected $casts = [
        'tags'         => 'array',
        'published_at' => 'datetime',
        'views'        => 'integer',
    ];

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
