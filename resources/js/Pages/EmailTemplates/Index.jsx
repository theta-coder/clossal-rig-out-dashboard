import React from 'react';
import { Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import DashboardLayout from '../../Components/DashboardLayout';
import DataTable from '../../Components/DataTable';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';

export default function EmailTemplatesIndex() {
    const columns = [
        { data: 'id', title: 'ID' },
        { data: 'name', title: 'Name' },
        { data: 'type', title: 'Type' },
        { data: 'subject', title: 'Subject' },
        { data: 'created_at', title: 'Created' },
    ];

    return (
        <DashboardLayout title="Email Templates">
            <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage reusable email templates by type and subject.</p>
                <Link
                    href="/email-templates/create"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 transition-all"
                >
                    <HiOutlinePlus className="w-4 h-4" /> Add Template
                </Link>
            </div>

            <DataTable
                url="/email-templates"
                columns={columns}
                actions={(row) => (
                    <>
                        <Link
                            href={`/email-templates/${row.id}/edit`}
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
                                        router.delete(`/email-templates/${row.id}`);
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

