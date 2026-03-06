<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;

class PageController extends Controller
{
    /**
     * GET /api/pages
     * Returns pages for navigation (footer/header)
     */
    public function index()
    {
        $pages = Page::where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'title', 'slug', 'show_in_footer', 'show_in_header']);

        return response()->json(['success' => true, 'data' => $pages]);
    }

    /**
     * GET /api/pages/{slug}
     */
    public function show($slug)
    {
        $page = Page::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data'    => [
                'id'               => $page->id,
                'title'            => $page->title,
                'slug'             => $page->slug,
                'content'          => $page->content,
                'meta_title'       => $page->meta_title ?? $page->title,
                'meta_description' => $page->meta_description,
            ],
        ]);
    }
}
