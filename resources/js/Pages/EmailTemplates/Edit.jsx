import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import DashboardLayout from '../../Components/DashboardLayout';

export default function EmailTemplatesEdit({ emailTemplate }) {
    const { data, setData, put, processing, errors } = useForm({
        name: emailTemplate?.name ?? '',
        type: emailTemplate?.type ?? '',
        subject: emailTemplate?.subject ?? '',
        body: emailTemplate?.body ?? '',
    });

    const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all';

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/email-templates/${emailTemplate.id}`);
    };

    return (
        <DashboardLayout title="Edit Email Template">
            <div className="max-w-3xl">
                <div className="mb-6">
                    <Link href="/email-templates" className="text-sm text-primary-500 hover:text-primary-600">
                        Back to Email Templates
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={inputClass}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Type</label>
                            <input
                                type="text"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className={inputClass}
                            />
                            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                        </div>
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Body</label>
                        <textarea
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            rows={12}
                            className={inputClass}
                        />
                        {errors.body && <p className="text-red-500 text-xs mt-1">{errors.body}</p>}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 disabled:opacity-50 transition-all"
                        >
                            {processing ? 'Updating...' : 'Update Template'}
                        </button>
                        <Link href="/email-templates" className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}

