<?php

namespace App\Http\Controllers;

use App\Models\Color;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ColorController extends Controller
{
    public function index()
    {
        return Inertia::render('Colors/Index', [
            'colors' => Color::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|unique:colors,name',
            'code' => 'nullable|string'
        ]);

        Color::create($validated);

        return back()->with('success', 'Color created successfully');
    }

    public function update(Request $request, Color $color)
    {
        $validated = $request->validate([
            'name' => 'required|unique:colors,name,' . $color->id,
            'code' => 'nullable|string'
        ]);

        $color->update($validated);

        return back()->with('success', 'Color updated successfully');
    }

    public function destroy(Color $color)
    {
        $color->delete();
        return back()->with('success', 'Color deleted successfully');
    }
}
