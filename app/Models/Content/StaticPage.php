<?php

namespace App\Models\Content;

use Illuminate\Database\Eloquent\Model;

class StaticPage extends Model
{
    protected $fillable = [
        'title', 'slug', 'content', 'meta_title', 'meta_description',
        'is_published', 'order',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'order'        => 'integer',
    ];
}
