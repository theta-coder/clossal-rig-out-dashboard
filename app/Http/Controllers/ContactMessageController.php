<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ContactMessageController extends Controller
{
    /**
     * Display a listing of messages
     */
    public function index(Request $request)
    {
        // Mobile paginated JSON request
        if ($request->has('mobile') || ($request->ajax() && $request->get('page'))) {
            return $this->getMobileMessages($request);
        }

        // DataTables AJAX request
        if ($request->ajax() && $request->has('draw')) {
            return $this->getDataTablesMessages($request);
        }

        // Initial Inertia page load (React)
        return Inertia::render('Messages/Index');
    }

    /**
     * Mobile paginated response
     */
    private function getMobileMessages(Request $request)
    {
        $query = ContactMessage::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        if ($request->filled('is_read')) {
            $query->where('is_read', $request->is_read);
        }

        $perPage = $request->get('per_page', 10);
        $messages = $query->latest()->paginate($perPage);

        return response()->json($messages);
    }

    /**
     * DataTables server-side response
     */
    private function getDataTablesMessages(Request $request)
    {
        $query = ContactMessage::query();

        // Global search
        if ($request->filled('search.value')) {
            $search = $request->input('search.value');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        $totalData = $query->count();

        // Sorting
        $orderColumn = $request->input('order.0.column', 4); // Default to created_at
        $orderDir = $request->input('order.0.dir', 'desc');
        $columns = ['id', 'name', 'email', 'subject', 'created_at', 'is_read'];

        if (isset($columns[$orderColumn])) {
            $query->orderBy($columns[$orderColumn], $orderDir);
        }

        // Pagination
        $start = $request->input('start', 0);
        $length = $request->input('length', 10);

        $messages = $query->skip($start)->take($length)->get();

        $data = $messages->map(function ($message, $index) use ($start) {
            return [
            'DT_RowIndex' => $start + $index + 1,
            'id' => $message->id,
            'name' => $message->name,
            'email' => $message->email,
            'subject' => $message->subject,
            'message' => Str::limit($message->message, 50),
            'created_at' => $message->created_at->format('M d, Y h:i A'),
            'is_read' => $message->is_read ? 'Read' : 'Unread',
            'action' => $message->id,
            ];
        });

        return response()->json([
            'draw' => intval($request->input('draw')),
            'recordsTotal' => $totalData,
            'recordsFiltered' => $totalData,
            'data' => $data,
        ]);
    }

    public function show(ContactMessage $message)
    {
        if (!$message->is_read) {
            $message->update(['is_read' => true]);
        }

        return Inertia::render('Messages/Show', [
            'message' => $message,
        ]);
    }

    public function destroy(ContactMessage $message)
    {
        $message->delete();

        return back()->with('success', 'Message deleted successfully.');
    }
}
