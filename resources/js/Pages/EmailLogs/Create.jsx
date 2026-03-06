import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import DashboardLayout from '../../Components/DashboardLayout';

export default function EmailLogsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        to_email: '',
        subject: '',
        template: '',
        status: 'sent',
        error: '',
        sent_at: '',
    });

    const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all';

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/email-logs');
    };

    return (
        <DashboardLayout title="Create Email Log">
            <div className="max-w-2xl">
                <div className="mb-6">
                    <Link href="/email-logs" className="text-sm text-primary-500 hover:text-primary-600">
                        Back to Email Logs
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">User ID <span className="text-gray-400 font-normal">(optional)</span></label>
                        <input
                            type="number"
                            min="1"
                            value={data.user_id}
                            onChange={(e) => setData('user_id', e.target.value)}
                            className={inputClass}
                        />
                        {errors.user_id && <p className="text-red-500 text-xs mt-1">{errors.user_id}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">To Email</label>
                        <input
                            type="email"
                            value={data.to_email}
                            onChange={(e) => setData('to_email', e.target.value)}
                            className={inputClass}
                        />
                        {errors.to_email && <p className="text-red-500 text-xs mt-1">{errors.to_email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
                        <input
                            type="text"
                            value={data.subject}
                            onChange={(e) => setData('subject', e.target.value)}
                            className={inputClass}
                        />
                        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Template <span className="text-gray-400 font-normal">(optional)</span></label>
                        <input
                            type="text"
                            value={data.template}
                            onChange={(e) => setData('template', e.target.value)}
                            className={inputClass}
                        />
                        {errors.template && <p className="text-red-500 text-xs mt-1">{errors.template}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className={inputClass}
                        >
                            <option value="sent">sent</option>
                            <option value="failed">failed</option>
                            <option value="bounced">bounced</option>
                        </select>
                        {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Error <span className="text-gray-400 font-normal">(optional)</span></label>
                        <textarea
                            value={data.error}
                            onChange={(e) => setData('error', e.target.value)}
                            rows={4}
                            className={inputClass}
                        />
                        {errors.error && <p className="text-red-500 text-xs mt-1">{errors.error}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Sent At <span className="text-gray-400 font-normal">(optional)</span></label>
                        <input
                            type="datetime-local"
                            value={data.sent_at}
                            onChange={(e) => setData('sent_at', e.target.value)}
                            className={inputClass}
                        />
                        {errors.sent_at && <p className="text-red-500 text-xs mt-1">{errors.sent_at}</p>}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 disabled:opacity-50 transition-all"
                        >
                            {processing ? 'Creating...' : 'Create Email Log'}
                        </button>
                        <Link href="/email-logs" className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}

