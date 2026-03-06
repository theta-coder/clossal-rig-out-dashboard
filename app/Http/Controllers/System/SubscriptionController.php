<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use App\Models\UserSubscription;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    // ── Plans ─────────────────────────────────────────────────────────────────

    public function plans()
    {
        $plans = SubscriptionPlan::withCount('subscriptions')
            ->orderBy('price')
            ->paginate(50);

        return Inertia::render('System/Subscriptions/Plans', compact('plans'));
    }

    public function storePlan(Request $request)
    {
        $validated = $request->validate([
            'name'                      => ['required', 'string', 'max:100'],
            'slug'                      => ['required', 'string', 'max:100', 'unique:subscription_plans,slug'],
            'description'               => ['nullable', 'string'],
            'price'                     => ['required', 'numeric', 'min:0'],
            'billing_cycle'             => ['required', 'in:monthly,quarterly,yearly'],
            'free_shipping_orders'      => ['nullable', 'integer', 'min:0'],
            'discount_percentage'       => ['nullable', 'numeric', 'min:0', 'max:100'],
            'loyalty_points_multiplier' => ['nullable', 'numeric', 'min:0'],
            'perks'                     => ['nullable', 'array'],
            'is_active'                 => ['boolean'],
        ]);

        SubscriptionPlan::create($validated);

        return back()->with('success', 'Subscription plan created successfully.');
    }

    public function updatePlan(Request $request, SubscriptionPlan $subscriptionPlan)
    {
        $validated = $request->validate([
            'name'                      => ['required', 'string', 'max:100'],
            'slug'                      => ['required', 'string', 'max:100', Rule::unique('subscription_plans', 'slug')->ignore($subscriptionPlan->id)],
            'description'               => ['nullable', 'string'],
            'price'                     => ['required', 'numeric', 'min:0'],
            'billing_cycle'             => ['required', 'in:monthly,quarterly,yearly'],
            'free_shipping_orders'      => ['nullable', 'integer', 'min:0'],
            'discount_percentage'       => ['nullable', 'numeric', 'min:0', 'max:100'],
            'loyalty_points_multiplier' => ['nullable', 'numeric', 'min:0'],
            'perks'                     => ['nullable', 'array'],
            'is_active'                 => ['boolean'],
        ]);

        $subscriptionPlan->update($validated);

        return back()->with('success', 'Subscription plan updated successfully.');
    }

    public function destroyPlan(SubscriptionPlan $subscriptionPlan)
    {
        $subscriptionPlan->delete();

        return back()->with('success', 'Subscription plan deleted.');
    }

    // ── User Subscriptions ────────────────────────────────────────────────────

    public function userSubscriptions()
    {
        $subscriptions = UserSubscription::with(['user', 'plan'])
            ->latest()
            ->paginate(50);

        $plans = SubscriptionPlan::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('System/Subscriptions/Users', compact('subscriptions', 'plans'));
    }

    public function storeUserSubscription(Request $request)
    {
        $validated = $request->validate([
            'user_id'    => ['required', 'exists:users,id'],
            'plan_id'    => ['required', 'exists:subscription_plans,id'],
            'status'     => ['required', 'in:active,expired,cancelled,pending'],
            'amount_paid'=> ['required', 'numeric', 'min:0'],
            'starts_at'  => ['required', 'date'],
            'ends_at'    => ['required', 'date', 'after:starts_at'],
            'auto_renew' => ['boolean'],
        ]);

        UserSubscription::create($validated);

        return back()->with('success', 'User subscription created.');
    }

    public function updateUserSubscription(Request $request, UserSubscription $userSubscription)
    {
        $validated = $request->validate([
            'status'       => ['required', 'in:active,expired,cancelled,pending'],
            'amount_paid'  => ['required', 'numeric', 'min:0'],
            'starts_at'    => ['required', 'date'],
            'ends_at'      => ['required', 'date', 'after:starts_at'],
            'cancelled_at' => ['nullable', 'date'],
            'auto_renew'   => ['boolean'],
        ]);

        $userSubscription->update($validated);

        return back()->with('success', 'Subscription updated.');
    }

    public function destroyUserSubscription(UserSubscription $userSubscription)
    {
        $userSubscription->delete();

        return back()->with('success', 'Subscription record deleted.');
    }
}
