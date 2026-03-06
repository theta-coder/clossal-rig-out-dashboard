<?php

namespace App\Http\Controllers;

use App\Models\EmailLog;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EmailLogController extends Controller
{
    /**
     * Display a listing of email logs.
     */
    public function index(Request $request)
    {
        if ($request->has('mobile') || ($request->ajax() && $request->get('page'))) {
            return $this->getMobileEmailLogs($request);
        }

        if ($request->ajax() && $request->has('draw')) {
            return $this->getDataTablesEmailLogs($request);
        }

        return Inertia::render('EmailLogs/Index');
    }

    /**
     * Mobile paginated response.
     */
    private function getMobileEmailLogs(Request $request)
    {
        $query = EmailLog::query()->with('user:id,name,email');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('to_email', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%")
                    ->orWhere('template', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $perPage = (int) $request->input('per_page', 10);
        $perPage = max(10, min($perPage, 100));

        return response()->json(
            $query->latest()->paginate($perPage)
        );
    }

    /**
     * DataTables server-side response.
     */
    private function getDataTablesEmailLogs(Request $request)
    {
        $query = EmailLog::query()->with('user:id,name,email');

        if ($request->filled('search.value')) {
            $search = $request->input('search.value');
            $query->where(function ($q) use ($search) {
                $q->where('to_email', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%")
                    ->orWhere('template', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $totalData = $query->count();

        $orderColumn = (int) $request->input('order.0.column', 0);
        $orderDir = $request->input('order.0.dir', 'desc');
        $columns = ['id', null, 'to_email', 'subject', 'template', 'status', 'sent_at', 'created_at'];

        if (isset($columns[$orderColumn]) && $columns[$orderColumn] !== null) {
            $query->orderBy($columns[$orderColumn], $orderDir);
        }

        $start = (int) $request->input('start', 0);
        $length = (int) $request->input('length', 10);
        $logs = $query->skip($start)->take($length)->get();

        $data = $logs->map(function ($log, $index) use ($start) {
            return [
                'DT_RowIndex' => $start + $index + 1,
                'id' => $log->id,
                'user_name' => $log->user?->name ?? '-',
                'to_email' => $log->to_email,
                'subject' => $log->subject,
                'template' => $log->template ?: '-',
                'status' => $log->status,
                'sent_at' => optional($log->sent_at)->format('M d, Y h:i A') ?: '-',
                'created_at' => optional($log->created_at)->format('M d, Y'),
                'action' => $log->id,
            ];
        });

        return response()->json([
            'draw' => (int) $request->input('draw'),
            'recordsTotal' => $totalData,
            'recordsFiltered' => $totalData,
            'data' => $data,
        ]);
    }

    public function create()
    {
        return Inertia::render('EmailLogs/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['nullable', 'exists:users,id'],
            'to_email' => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'template' => ['nullable', 'string', 'max:100'],
            'status' => ['required', Rule::in(['sent', 'failed', 'bounced'])],
            'error' => ['nullable', 'string'],
            'sent_at' => ['nullable', 'date'],
        ]);

        EmailLog::create($validated);

        return redirect()->route('email-logs.index')->with('success', 'Email log created successfully.');
    }

    public function edit(EmailLog $emailLog)
    {
        return Inertia::render('EmailLogs/Edit', [
            'emailLog' => $emailLog,
        ]);
    }

    public function update(Request $request, EmailLog $emailLog)
    {
        $validated = $request->validate([
            'user_id' => ['nullable', 'exists:users,id'],
            'to_email' => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'template' => ['nullable', 'string', 'max:100'],
            'status' => ['required', Rule::in(['sent', 'failed', 'bounced'])],
            'error' => ['nullable', 'string'],
            'sent_at' => ['nullable', 'date'],
        ]);

        $emailLog->update($validated);

        return redirect()->route('email-logs.index')->with('success', 'Email log updated successfully.');
    }

    public function destroy(EmailLog $emailLog)
    {
        try {
            $emailLog->delete();
        } catch (QueryException) {
            return back()->with('error', 'Unable to delete email log because it is linked with other records.');
        }

        return back()->with('success', 'Email log deleted successfully.');
    }
}

