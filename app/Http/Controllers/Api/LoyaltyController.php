<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LoyaltyPoint;
use App\Models\Wallet;
use App\Models\Referral;
use App\Models\GiftCard;
use Illuminate\Http\Request;

class LoyaltyController extends Controller
{
    /**
     * Get user's loyalty points, wallet balance, and referral status
     */
    public function balance(Request $request)
    {
        $user = $request->user();

        $loyalty = LoyaltyPoint::where('user_id', $user->id)->first() ?? [
            'points' => 0,
            'status' => 'active'
        ];

        $wallet = Wallet::where('user_id', $user->id)->first() ?? [
            'balance' => 0,
            'is_active' => true
        ];

        $referralCode = $user->referral_code;
        if (!$referralCode) {
            $user->referral_code = 'UT' . strtoupper(substr(md5($user->id . time()), 0, 8));
            $user->save();
            $referralCode = $user->referral_code;
        }

        return response()->json([
            'success' => true,
            'data' => [
                'loyalty_points' => $loyalty,
                'wallet' => $wallet,
                'referral_code' => $referralCode,
                'total_referrals' => Referral::where('referrer_id', $user->id)->count()
            ]
        ]);
    }

    /**
     * Get loyalty points transaction history
     */
    public function pointsHistory(Request $request)
    {
        $transactions = $request->user()->loyaltyTransactions()->latest()->get();
        return response()->json([
            'success' => true,
            'data' => $transactions
        ]);
    }

    /**
     * Get wallet transaction history
     */
    public function walletHistory(Request $request)
    {
        $transactions = $request->user()->walletTransactions()->latest()->get();
        return response()->json([
            'success' => true,
            'data' => $transactions
        ]);
    }

    /**
     * Get referrral history
     */
    public function referrals(Request $request)
    {
        $referrals = Referral::where('referrer_id', $request->user()->id)
            ->with('referredUser:id,name,email')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $referrals
        ]);
    }

    /**
     * Redeem a gift card
     */
    public function redeemGiftCard(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|exists:gift_cards,code',
        ]);

        $giftCard = GiftCard::where('code', $validated['code'])->first();

        if ($giftCard->is_redeemed) {
            return response()->json([
                'success' => false,
                'message' => 'This gift card has already been redeemed.'
            ], 422);
        }

        if ($giftCard->expiry_date && $giftCard->expiry_date < now()) {
            return response()->json([
                'success' => false,
                'message' => 'This gift card has expired.'
            ], 422);
        }

        try {
            \Illuminate\Support\Facades\DB::beginTransaction();

            // Update gift card
            $giftCard->update([
                'user_id' => $request->user()->id,
                'is_redeemed' => true,
                'redeemed_at' => now(),
            ]);

            // Add balance to wallet
            $wallet = Wallet::firstOrCreate(
            ['user_id' => $request->user()->id],
            ['balance' => 0, 'is_active' => true]
            );

            $oldBalance = $wallet->balance;
            $newBalance = $oldBalance + $giftCard->amount;

            $wallet->update(['balance' => $newBalance]);

            // Record transaction
            $request->user()->walletTransactions()->create([
                'amount' => $giftCard->amount,
                'type' => 'credit',
                'balance_after' => $newBalance,
                'description' => 'Redeemed Gift Card: ' . $giftCard->code,
                'reference_id' => $giftCard->id,
                'reference_type' => 'GiftCard'
            ]);

            \Illuminate\Support\Facades\DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Gift card redeemed successfully. Amount added to your wallet.',
                'data' => [
                    'amount' => $giftCard->amount,
                    'new_balance' => $newBalance
                ]
            ]);

        }
        catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to redeem gift card: ' . $e->getMessage()
            ], 500);
        }
    }
}
