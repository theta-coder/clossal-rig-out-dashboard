import React from 'react';
import { Link, router } from '@inertiajs/react';
import DashboardLayout from '../../Components/DashboardLayout';
import DataTable from '../../Components/DataTable';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineEye } from 'react-icons/hi';

export default function UsersIndex() {
    const columns = [
        { data: 'id', title: 'ID' },
        {
            data: 'name', title: 'Name', render: (val, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-semibold">{val?.charAt(0)?.toUpperCase()}</div>
                    <span className="font-medium text-gray-900 dark:text-white">{val}</span>
                </div>
            )
        },
        { data: 'email', title: 'Email' },
        { data: 'phone', title: 'Phone', render: (val) => val || '—' },
        { data: 'orders_count', title: 'Orders', render: (val) => <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400">{val}</span> },
        { data: 'created_at', title: 'Joined' },
    ];

    return (
        <DashboardLayout title="Users">
            <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage registered users</p>
                <Link href="/users/create" className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 transition-all">
                    <HiOutlinePlus className="w-4 h-4" /> Add User
                </Link>
            </div>
            <DataTable url="/users" columns={columns} actions={(row) => (
                <>
                    <Link href={`/users/${row.id}`} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"><HiOutlineEye className="w-4 h-4" /></Link>
                    <Link href={`/users/${row.id}/edit`} className="p-2 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 transition-colors"><HiOutlinePencil className="w-4 h-4" /></Link>
                    <button onClick={() => { if (confirm('Delete this user?')) router.delete(`/users/${row.id}`); }} className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"><HiOutlineTrash className="w-4 h-4" /></button>
                </>
            )} />
        </DashboardLayout>
    );
}
