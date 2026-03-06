<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SupportController extends Controller
{
    /**
     * List user's contact/support tickets
     */
    public function complaints(Request $request)
    {
        $complaints = $request->user()->complaints()
            ->with(['attachments', 'replies.user'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $complaints
        ]);
    }

    /**
     * Store a new support ticket
     */
    public function storeComplaint(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'order_id' => 'nullable|exists:orders,id',
            'priority' => 'nullable|string|in:low,medium,high',
            'description' => 'required|string',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|mimes:jpg,jpeg,png,pdf|max:5120', // Max 5MB
        ]);

        $user = $request->user();

        try {
            $complaint = DB::transaction(function () use ($validated, $user, $request) {
                $complaint = Complaint::create([
                    'user_id' => $user->id,
                    'order_id' => $validated['order_id'] ?? null,
                    'complaint_number' => 'TCK-' . strtoupper(uniqid()),
                    'subject' => $validated['subject'],
                    'priority' => $validated['priority'] ?? 'medium',
                    'status' => 'pending',
                    'description' => $validated['description'],
                ]);

                if ($request->hasFile('attachments')) {
                    foreach ($request->file('attachments') as $file) {
                        $path = $file->store('complaints/attachments', 'public');
                        $complaint->attachments()->create([
                            'file_path' => $path,
                            'file_name' => $file->getClientOriginalName()
                        ]);
                    }
                }

                return $complaint;
            });

            return response()->json([
                'success' => true,
                'message' => 'Ticket created successfully.',
                'data' => $complaint->load('attachments')
            ], 201);

        }
        catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create ticket: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get ticket details
     */
    public function showComplaint(Request $request, $id)
    {
        $complaint = $request->user()->complaints()
            ->with(['attachments', 'replies.user', 'order'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $complaint
        ]);
    }

    /**
     * Reply to a ticket
     */
    public function replyComplaint(Request $request, $id)
    {
        $complaint = $request->user()->complaints()->findOrFail($id);

        $validated = $request->validate([
            'message' => 'required|string',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        try {
            $reply = DB::transaction(function () use ($validated, $complaint, $request) {
                $reply = $complaint->replies()->create([
                    'user_id' => $request->user()->id,
                    'message' => $validated['message']
                ]);

                // Update complaint status if it was closed
                if ($complaint->status === 'closed') {
                    $complaint->update(['status' => 'open']);
                }

                return $reply;
            });

            return response()->json([
                'success' => true,
                'message' => 'Reply sent successfully.',
                'data' => $reply->load('user')
            ], 201);

        }
        catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send reply: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Submit general contact form
     */
    public function contact(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        ContactMessage::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Thank you for contacting us. We will get back to you soon.'
        ]);
    }
}
