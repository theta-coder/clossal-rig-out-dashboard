<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    /**
     * POST /api/newsletter/subscribe
     */
    public function subscribe(Request $request)
    {
        $request->validate(['email' => 'required|email|max:255']);

        $subscriber = NewsletterSubscriber::firstOrCreate(
            ['email' => $request->email],
            ['is_active' => true]
        );

        if (!$subscriber->wasRecentlyCreated && !$subscriber->is_active) {
            $subscriber->update(['is_active' => true]);
            return response()->json(['success' => true, 'message' => 'Welcome back! You have been re-subscribed.']);
        }

        if (!$subscriber->wasRecentlyCreated) {
            return response()->json(['success' => false, 'message' => 'This email is already subscribed.'], 422);
        }

        return response()->json(['success' => true, 'message' => 'Successfully subscribed! Check your inbox for a welcome email.'], 201);
    }

    /**
     * POST /api/newsletter/unsubscribe
     */
    public function unsubscribe(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $subscriber = NewsletterSubscriber::where('email', $request->email)->first();

        if (!$subscriber) {
            return response()->json(['success' => false, 'message' => 'Email not found.'], 404);
        }

        $subscriber->update(['is_active' => false]);

        return response()->json(['success' => true, 'message' => 'You have been unsubscribed.']);
    }
}
