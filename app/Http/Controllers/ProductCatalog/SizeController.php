<?php

namespace App\Http\Controllers\ProductCatalog;

use App\Http\Controllers\Controller;

use App\Models\ProductCatalog\Size;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SizeController extends Controller
{
    public function index()
    {
        return Inertia::render('ProductCatalog/Sizes/Index', [
            'sizes' => Size::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|unique:sizes,name'
        ]);

        Size::create($validated);

        return back()->with('success', 'Size created successfully');
    }

    public function update(Request $request, Size $size)
    {
        $validated = $request->validate([
            'name' => 'required|unique:sizes,name,' . $size->id
        ]);

        $size->update($validated);

        return back()->with('success', 'Size updated successfully');
    }

    public function destroy(Size $size)
    {
        $size->delete();
        return back()->with('success', 'Size deleted successfully');
    }
}

