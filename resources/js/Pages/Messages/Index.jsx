import React from 'react';
import { Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import DashboardLayout from '../../Components/DashboardLayout';
import DataTable from '../../Components/DataTable';
import { HiOutlineEye, HiOutlineTrash } from 'react-icons/hi';

export default function MessagesIndex() {
    const columns = [
        { data: 'id', title: 'ID' },
        { data: 'name', title: 'Name', render: (val) => <span className="font-medium text-gray-900 dark:text-white">{val}</span> },
        { data: 'email', title: 'Email' },
        { data: 'message', title: 'Message', render: (val) => <span className="text-gray-500 dark:text-gray-400">{val}</span> },
        {
            data: 'is_read', title: 'Status', render: (val) => (
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${val === 'Read' ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' : 'bg-primary-100 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'}`}>
                    {val === 'Read' ? '● Read' : '● Unread'}
                </span>
            )
        },
        { data: 'created_at', title: 'Date' },
    ];

    return (
        <DashboardLayout title="Messages">
            <div className="mb-6"><p className="text-sm text-gray-500 dark:text-gray-400">Contact form messages</p></div>
            <DataTable url="/messages" columns={columns} actions={(row) => (
                <>
                    <Link href={`/messages/${row.id}`} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"><HiOutlineEye className="w-4 h-4" /></Link>
                    <button onClick={() => {
                        Swal.fire({
                            title: 'Are you sure?',
                            text: "You won't be able to revert this!",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#d33',
                            cancelButtonColor: '#3085d6',
                            confirmButtonText: 'Yes, delete it!'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                router.delete(`/messages/${row.id}`);
                            }
                        });
                    }} className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"><HiOutlineTrash className="w-4 h-4" /></button>
                </>
            )} />
        </DashboardLayout>
    );
}
