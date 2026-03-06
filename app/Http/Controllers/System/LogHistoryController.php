<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Models\EmailLog;
use App\Models\SmsLog;
use App\Models\PushNotificationLog;
use App\Models\UserManagement\AdminAuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LogHistoryController extends Controller
{
    public function emailLogs()
    {
        $logs = EmailLog::latest()->paginate(50);
        return Inertia::render('System/Logs/Emails', compact('logs'));
    }

    public function smsLogs()
    {
        $logs = SmsLog::latest()->paginate(50);
        return Inertia::render('System/Logs/Sms', compact('logs'));
    }

    public function auditLogs()
    {
        $logs = AdminAuditLog::with('user')->latest()->paginate(50);
        return Inertia::render('System/Logs/Audit', compact('logs'));
    }

    public function pushLogs()
    {
        $logs = PushNotificationLog::latest()->paginate(50);
        return Inertia::render('System/Logs/Push', compact('logs'));
    }
}
