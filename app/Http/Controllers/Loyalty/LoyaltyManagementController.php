<?php

namespace App\Http\Controllers\Loyalty;

use App\Http\Controllers\Controller;
use App\Models\LoyaltyPoint;
use App\Models\LoyaltyTransaction;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Models\GiftCard;
use App\Models\Referral;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoyaltyManagementController extends Controller
{
    public function points()
    {
        $points = LoyaltyPoint::with('user')->latest()->paginate(50);
        return Inertia::render('Loyalty/Points/Index', compact('points'));
    }

    public function pointsTransactions()
    {
        $transactions = LoyaltyTransaction::with(['user', 'order'])->latest()->paginate(50);
        return Inertia::render('Loyalty/Points/Transactions', compact('transactions'));
    }

    public function wallets()
    {
        $wallets = Wallet::with('user')->orderBy('balance', 'desc')->paginate(50);
        return Inertia::render('Loyalty/Wallets/Index', compact('wallets'));
    }

    public function cards()
    {
        $cards = GiftCard::with('user')->latest()->paginate(50);
        return Inertia::render('Loyalty/Cards/Index', compact('cards'));
    }

    public function storeCard(Request $request)
    {
        $validated = $request->validate([
            'code'          => 'required|string|max:50|unique:gift_cards,code',
            'initial_value' => 'required|numeric|min:1',
            'user_id'       => 'nullable|exists:users,id',
            'expiry_date'   => 'nullable|date|after:today',
        ]);

        $validated['current_value'] = $validated['initial_value'];
        $validated['is_active'] = true;

        GiftCard::create($validated);
        return redirect()->back()->with('success', 'Gift card issued successfully.');
    }

    public function referrals()
    {
        $referrals = Referral::with(['referrer', 'referredUser'])->latest()->paginate(50);
        return Inertia::render('Loyalty/Referrals/Index', compact('referrals'));
    }
}
