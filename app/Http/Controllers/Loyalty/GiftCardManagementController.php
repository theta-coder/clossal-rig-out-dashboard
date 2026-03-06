<?php

namespace App\Http\Controllers\Loyalty;

use App\Http\Controllers\Controller;
use App\Models\GiftCard;
use App\Models\GiftCardTransaction;
use App\Models\GiftCardRedemption;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GiftCardManagementController extends Controller
{
    public function transactions()
    {
        $transactions = GiftCardTransaction::with(['giftCard', 'order'])
            ->latest()
            ->paginate(50);

        return Inertia::render('Loyalty/GiftCards/Transactions', compact('transactions'));
    }

    public function redemptions()
    {
        $redemptions = GiftCardRedemption::with(['giftCard', 'order'])
            ->latest('redeemed_at')
            ->paginate(50);

        return Inertia::render('Loyalty/GiftCards/Redemptions', compact('redemptions'));
    }

    public function storeTransaction(Request $request)
    {
        $validated = $request->validate([
            'gift_card_id' => ['required', 'exists:gift_cards,id'],
            'order_id'     => ['nullable', 'exists:orders,id'],
            'amount'       => ['required', 'numeric', 'min:0'],
            'type'         => ['required', 'in:credit,debit'],
        ]);

        GiftCardTransaction::create($validated);

        return back()->with('success', 'Gift card transaction recorded.');
    }

    public function destroyTransaction(int $id)
    {
        GiftCardTransaction::findOrFail($id)->delete();

        return back()->with('success', 'Transaction deleted.');
    }

    public function destroyRedemption(int $id)
    {
        GiftCardRedemption::findOrFail($id)->delete();

        return back()->with('success', 'Redemption record deleted.');
    }
}
