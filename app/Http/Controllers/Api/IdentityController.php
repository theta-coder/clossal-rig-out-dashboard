<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OtpVerification;
use App\Models\SocialLogin;
use App\Models\UserManagement\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class IdentityController extends Controller
{
    /**
     * Send OTP to phone/email
     */
    public function sendOtp(Request $request)
    {
        $validated = $request->validate([
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'type' => 'required|string|in:registration,login,reset_password,verification',
        ]);

        $identifier = $validated['phone'] ?? $validated['email'];

        // Generate 6 digit OTP
        $otpCode = rand(100000, 999999);
        $expiry = now()->addMinutes(10);

        OtpVerification::updateOrCreate(
        ['identifier' => $identifier, 'type' => $validated['type']],
        ['otp_code' => $otpCode, 'expires_at' => $expiry, 'is_verified' => false]
        );

        // Here you would integrate an SMS/Email service
        /* 
         if($request->phone) SmsService::send($identifier, "Your Urban Threads OTP is: $otpCode");
         else EmailService::send($identifier, "Your OTP", "Code: $otpCode");
         */

        return response()->json([
            'success' => true,
            'message' => 'OTP sent successfully. Expiring in 10 minutes.',
            'debug_otp' => config('app.debug') ? $otpCode : null // Only for testing
        ]);
    }

    /**
     * Verify OTP
     */
    public function verifyOtp(Request $request)
    {
        $validated = $request->validate([
            'identifier' => 'required|string',
            'otp_code' => 'required|string',
            'type' => 'required|string|in:registration,login,reset_password,verification',
        ]);

        $verification = OtpVerification::where('identifier', $validated['identifier'])
            ->where('type', $validated['type'])
            ->where('otp_code', $validated['otp_code'])
            ->where('expires_at', '>', now())
            ->first();

        if (!$verification) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired OTP.'
            ], 422);
        }

        $verification->update(['is_verified' => true]);

        return response()->json([
            'success' => true,
            'message' => 'OTP verified successfully.',
            'verification_token' => Str::random(40) // Optional token for next steps
        ]);
    }

    /**
     * Handle Social Login (Success/Callback)
     */
    public function socialLogin(Request $request)
    {
        $validated = $request->validate([
            'provider' => 'required|string|in:google,facebook,apple',
            'provider_id' => 'required|string',
            'email' => 'required|email',
            'name' => 'required|string',
            'avatar' => 'nullable|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            // Create user for social login
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make(Str::random(24)), // Random password for social
                'role' => 'customer',
            ]);
        }

        // Connect social account
        SocialLogin::updateOrCreate(
        ['provider' => $validated['provider'], 'provider_id' => $validated['provider_id']],
        ['user_id' => $user->id, 'email' => $validated['email'], 'avatar' => $validated['avatar']]
        );

        $token = $user->createToken('social-login-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Logged in with ' . ucfirst($validated['provider']),
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'token' => $token
            ]
        ]);
    }
}
