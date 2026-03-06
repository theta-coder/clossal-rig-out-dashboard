<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductQuestion;
use App\Models\BackInStockAlert;
use App\Models\ProductCatalog\Product;
use Illuminate\Http\Request;

class ProductInteractionController extends Controller
{
    /**
     * Get questions for a specific product
     */
    public function questions($productId)
    {
        $questions = ProductQuestion::where('product_id', $productId)
            ->where('status', 'approved')
            ->with(['user:id,name', 'answers.user:id,name'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $questions
        ]);
    }

    /**
     * Submit a question for a product
     */
    public function askQuestion(Request $request, $productId)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:1000',
            'is_anonymous' => 'boolean',
        ]);

        $product = Product::findOrFail($productId);

        $question = ProductQuestion::create([
            'product_id' => $product->id,
            'user_id' => $request->user()->id,
            'question' => $validated['question'],
            'status' => 'pending',
            'is_anonymous' => $validated['is_anonymous'] ?? false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Question submitted successfully. It will be visible after review.',
            'data' => $question
        ], 201);
    }

    /**
     * Subscribe to a back-in-stock alert
     */
    public function notifyMe(Request $request, $productId)
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
            'variant_id' => 'nullable|exists:product_variants,id',
        ]);

        $product = Product::findOrFail($productId);

        // Check if already subscribed
        $exists = BackInStockAlert::where('product_id', $product->id)
            ->where('email', $validated['email'])
            ->where('variant_id', $validated['variant_id'] ?? null)
            ->where('status', 'pending')
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => true,
                'message' => 'You are already subscribed to this alert.'
            ]);
        }

        $alert = BackInStockAlert::create([
            'product_id' => $product->id,
            'variant_id' => $validated['variant_id'] ?? null,
            'user_id' => $request->user() ? $request->user()->id : null,
            'email' => $validated['email'],
            'status' => 'pending',
            'subscribed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Alert set up successfully. We will notify you once it’s back in stock.',
            'data' => $alert
        ], 201);
    }
}
