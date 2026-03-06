<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\FaqCategory;

class FaqController extends Controller
{
    /**
     * GET /api/faqs
     * Returns all active FAQs grouped by category
     */
    public function index()
    {
        $categories = FaqCategory::where('is_active', true)
            ->orderBy('sort_order')
            ->with(['faqs' => function ($q) {
                $q->where('is_active', true)->orderBy('sort_order');
            }])
            ->get()
            ->map(fn($cat) => [
                'id'   => $cat->id,
                'name' => $cat->name,
                'slug' => $cat->slug,
                'faqs' => $cat->faqs->map(fn($faq) => [
                    'id'       => $faq->id,
                    'question' => $faq->question,
                    'answer'   => $faq->answer,
                ])->values(),
            ])
            ->filter(fn($cat) => $cat['faqs']->count() > 0)
            ->values();

        return response()->json(['success' => true, 'data' => $categories]);
    }

    /**
     * GET /api/faq-categories
     */
    public function categories()
    {
        $cats = FaqCategory::where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'slug']);

        return response()->json(['success' => true, 'data' => $cats]);
    }
}
