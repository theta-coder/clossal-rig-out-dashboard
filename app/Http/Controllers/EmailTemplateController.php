<?php

namespace App\Http\Controllers;

use App\Models\EmailTemplate;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EmailTemplateController extends Controller
{
    /**
     * Display a listing of email templates.
     */
    public function index(Request $request)
    {
        if ($request->has('mobile') || ($request->ajax() && $request->get('page'))) {
            return $this->getMobileEmailTemplates($request);
        }

        if ($request->ajax() && $request->has('draw')) {
            return $this->getDataTablesEmailTemplates($request);
        }

        return Inertia::render('EmailTemplates/Index');
    }

    /**
     * Mobile paginated response.
     */
    private function getMobileEmailTemplates(Request $request)
    {
        $query = EmailTemplate::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%");
            });
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
    private function getDataTablesEmailTemplates(Request $request)
    {
        $query = EmailTemplate::query();

        if ($request->filled('search.value')) {
            $search = $request->input('search.value');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        $totalData = $query->count();

        $orderColumn = (int) $request->input('order.0.column', 0);
        $orderDir = $request->input('order.0.dir', 'desc');
        $columns = ['id', 'name', 'type', 'subject', 'created_at'];

        if (isset($columns[$orderColumn])) {
            $query->orderBy($columns[$orderColumn], $orderDir);
        }

        $start = (int) $request->input('start', 0);
        $length = (int) $request->input('length', 10);
        $templates = $query->skip($start)->take($length)->get();

        $data = $templates->map(function ($template, $index) use ($start) {
            return [
                'DT_RowIndex' => $start + $index + 1,
                'id' => $template->id,
                'name' => $template->name,
                'type' => $template->type,
                'subject' => $template->subject,
                'created_at' => optional($template->created_at)->format('M d, Y'),
                'action' => $template->id,
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
        return Inertia::render('EmailTemplates/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:255', 'unique:email_templates,type'],
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
        ]);

        EmailTemplate::create($validated);

        return redirect()->route('email-templates.index')->with('success', 'Email template created successfully.');
    }

    public function edit(EmailTemplate $emailTemplate)
    {
        return Inertia::render('EmailTemplates/Edit', [
            'emailTemplate' => $emailTemplate,
        ]);
    }

    public function update(Request $request, EmailTemplate $emailTemplate)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:255', Rule::unique('email_templates', 'type')->ignore($emailTemplate->id)],
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
        ]);

        $emailTemplate->update($validated);

        return redirect()->route('email-templates.index')->with('success', 'Email template updated successfully.');
    }

    public function destroy(EmailTemplate $emailTemplate)
    {
        try {
            $emailTemplate->delete();
        } catch (QueryException) {
            return back()->with('error', 'Unable to delete email template because it is linked with other records.');
        }

        return back()->with('success', 'Email template deleted successfully.');
    }
}

