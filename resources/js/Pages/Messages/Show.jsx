import React from 'react';
import { Link, router } from '@inertiajs/react';
import DashboardLayout from '../../Components/DashboardLayout';
import { HiOutlineTrash, HiOutlineMail, HiOutlineUser, HiOutlineClock } from 'react-icons/hi';

export default function MessagesShow({ message }) {
    return (
        <DashboardLayout title="Message Details">
            <div className="max-w-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <Link href="/messages" className="text-sm text-primary-500 hover:text-primary-600">← Back to Messages</Link>
                    <button onClick={() => { if (confirm('Delete?')) router.delete(`/messages/${message.id}`); }} className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-all">
                        <HiOutlineTrash className="w-4 h-4" /> Delete
                    </button>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                            <HiOutlineUser className="w-5 h-5 text-gray-400" />
                            <div><p className="text-xs text-gray-500">From</p><p className="text-sm font-medium text-gray-900 dark:text-white">{message.name}</p></div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                            <HiOutlineMail className="w-5 h-5 text-gray-400" />
                            <div><p className="text-xs text-gray-500">Email</p><p className="text-sm font-medium text-gray-900 dark:text-white">{message.email}</p></div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                            <HiOutlineClock className="w-5 h-5 text-gray-400" />
                            <div><p className="text-xs text-gray-500">Date</p><p className="text-sm font-medium text-gray-900 dark:text-white">{new Date(message.created_at).toLocaleDateString()}</p></div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Message</h3>
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
