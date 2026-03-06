<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\JsonResponse;

class AnnouncementController extends Controller
{
    /**
     * Get the active announcement.
     *
     * @return JsonResponse
     */
    public function getActive(): JsonResponse
    {
        // Get the latest active announcement
        $announcement = Announcement::where('is_active', true)->latest()->first();

        if (!$announcement) {
            return response()->json([
                'status' => 'success',
                'data' => null,
            ]);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $announcement->id,
                'message' => $announcement->message,
                'link_text' => $announcement->link_text,
                'link_url' => $announcement->link_url,
            ],
        ]);
    }
}



