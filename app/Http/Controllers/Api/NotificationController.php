<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DeviceToken;
use App\Models\NotificationPreference;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Register device token for push notifications
     */
    public function registerToken(Request $request)
    {
        $validated = $request->validate([
            'token' => 'required|string|max:500',
            'device_type' => 'required|string|in:android,ios,web',
            'device_name' => 'nullable|string|max:255',
        ]);

        $user = $request->user();

        // Update existing or create new device token
        $deviceToken = DeviceToken::updateOrCreate(
        ['token' => $validated['token']],
        [
            'user_id' => $user->id,
            'device_type' => $validated['device_type'],
            'device_name' => $validated['device_name'],
            'last_used_at' => now(),
        ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Device token registered successfully.',
            'data' => $deviceToken
        ]);
    }

    /**
     * Get user's notification preferences
     */
    public function preferences(Request $request)
    {
        $user = $request->user();
        $preferences = NotificationPreference::where('user_id', $user->id)->first() ?? [
            'order_updates' => true,
            'promotions' => true,
            'new_arrivals' => true,
            'account_alerts' => true,
        ];

        return response()->json([
            'success' => true,
            'data' => $preferences
        ]);
    }

    /**
     * Update user's notification preferences
     */
    public function updatePreferences(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'order_updates' => 'required|boolean',
            'promotions' => 'required|boolean',
            'new_arrivals' => 'required|boolean',
            'account_alerts' => 'required|boolean',
        ]);

        $preferences = NotificationPreference::updateOrCreate(
        ['user_id' => $user->id],
            $validated
        );

        return response()->json([
            'success' => true,
            'message' => 'Notification preferences updated successfully.',
            'data' => $preferences
        ]);
    }

    /**
     * Deactivate a device token
     */
    public function revokeToken(Request $request)
    {
        $validated = $request->validate([
            'token' => 'required|string',
        ]);

        DeviceToken::where('token', $validated['token'])
            ->where('user_id', $request->user()->id)
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Device token revoked successfully.'
        ]);
    }
}
