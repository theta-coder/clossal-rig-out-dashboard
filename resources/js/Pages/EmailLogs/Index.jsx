import React from 'react';
import { Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import DashboardLayout from '../../Components/DashboardLayout';
import DataTable from '../../Components/DataTable';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';

export default function EmailLogsIndex() {
    const columns = [
        { data: 'id', title: 'ID' },
        { data: 'user_name', title: 'User', orderable: false },
        { data: 'to_email', title: 'To Email' },
        { data: 'subject', title: 'Subject' },
        { data: 'template', title: 'Template' },
        {
            data: 'status',
            title: 'Status',
            render: (val) => {
                const classes = val === 'sent'
                    ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                    : val === 'failed'
                        ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400';

                return <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>{val}</span>;
            },
        },
        { data: 'sent_at', title: 'Sent At' },
        { data: 'created_at', title: 'Created' },
    ];

    return (
        <DashboardLayout title="Email Logs">
            <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">Track outgoing email status, errors, and delivery history.</p>
                <Link
                    href="/email-logs/create"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 transition-all"
                >
                    <HiOutlinePlus className="w-4 h-4" /> Add Log
                </Link>
            </div>

            <DataTable
                url="/email-logs"
                columns={columns}
                actions={(row) => (
                    <>
                        <Link
                            href={`/email-logs/${row.id}/edit`}
                            className="p-2 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 transition-colors"
                        >
                            <HiOutlinePencil className="w-4 h-4" />
                        </Link>
                        <button
                            onClick={() => {
                                Swal.fire({
                                    title: 'Are you sure?',
                                    text: "You won't be able to revert this!",
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#d33',
                                    cancelButtonColor: '#3085d6',
                                    confirmButtonText: 'Yes, delete it!',
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        router.delete(`/email-logs/${row.id}`);
                                    }
                                });
                            }}
                            className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
                        >
                            <HiOutlineTrash className="w-4 h-4" />
                        </button>
                    </>
                )}
            />
        </DashboardLayout>
    );
}

