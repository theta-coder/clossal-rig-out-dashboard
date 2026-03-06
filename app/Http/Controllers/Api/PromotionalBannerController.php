<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PromotionalBanner;
use Illuminate\Http\Request;

class PromotionalBannerController extends Controller
{
    /**
     * GET /api/banners/active
     * Returns active banners for the current date/time, ordered by sort_order
     */
    public function active(Request $request)
    {
        $position = $request->get('position'); // optional filter: hero, sidebar, popup, etc.

        $query = PromotionalBanner::where('is_active', true)
            ->where(function ($q) {
                $now = now();
                $q->whereNull('starts_at')->orWhere('starts_at', '<=', $now);
            })
            ->where(function ($q) {
                $now = now();
                $q->whereNull('ends_at')->orWhere('ends_at', '>=', $now);
            })
            ->orderBy('sort_order');

        if ($position) {
            $query->where('position', $position);
        }

        $banners = $query->get()->map(fn($b) => [
            'id'       => $b->id,
            'title'    => $b->title,
            'subtitle' => $b->subtitle,
            'image'    => $b->image ? url($b->image) : null,
            'link_url' => $b->link_url,
            'position' => $b->position,
        ]);

        return response()->json(['success' => true, 'data' => $banners]);
    }
}
