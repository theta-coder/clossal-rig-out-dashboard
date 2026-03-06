<?php

namespace App\Http\Controllers\Content;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\FaqCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FaqManagementController extends Controller
{
    public function index()
    {
        $categories = FaqCategory::with('faqs')->get();
        return Inertia::render('Content/Faqs/Index', compact('categories'));
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate(['name' => 'required|string|max:255']);
        $slug = \Illuminate\Support\Str::slug($validated['name']);
        $original = $slug;
        $i = 1;
        while (FaqCategory::where('slug', $slug)->exists()) {
            $slug = $original . '-' . $i++;
        }
        $validated['slug'] = $slug;
        FaqCategory::create($validated);
        return redirect()->back()->with('success', 'Category created successfully.');
    }

    public function storeFaq(Request $request)
    {
        $validated = $request->validate([
            'faq_category_id' => 'required|exists:faq_categories,id',
            'question' => 'required|string',
            'answer' => 'required|string',
        ]);

        Faq::create($validated);
        return redirect()->back()->with('success', 'FAQ created successfully.');
    }

    public function update(Request $request, Faq $faq)
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
        ]);

        $faq->update($validated);
        return redirect()->back()->with('success', 'FAQ updated successfully.');
    }

    public function destroy(Faq $faq)
    {
        $faq->delete();
        return redirect()->back()->with('success', 'FAQ deleted successfully.');
    }
}
