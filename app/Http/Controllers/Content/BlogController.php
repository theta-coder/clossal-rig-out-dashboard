<?php

namespace App\Http\Controllers\Content;

use App\Http\Controllers\Controller;
use App\Models\Content\BlogPost;
use App\Models\Content\StaticPage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index()
    {
        $posts = BlogPost::latest()->paginate(20);
        return Inertia::render('Content/Blog/Index', compact('posts'));
    }

    public function create()
    {
        return Inertia::render('Content/Blog/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'status' => 'required|in:draft,published',
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        $validated['user_id'] = auth()->id();

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('blog', 'public');
        }

        BlogPost::create($validated);

        return redirect()->route('dashboard.blog.index')->with('success', 'Blog post created successfully.');
    }

    public function edit(BlogPost $post)
    {
        return Inertia::render('Content/Blog/Edit', compact('post'));
    }

    public function update(Request $request, BlogPost $post)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
        ]);

        $post->update($validated);

        return redirect()->route('dashboard.blog.index')->with('success', 'Blog post updated successfully.');
    }

    public function destroy(BlogPost $post)
    {
        $post->delete();
        return redirect()->route('dashboard.blog.index')->with('success', 'Blog post deleted successfully.');
    }
}
