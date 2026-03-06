import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import DashboardLayout from '../../../Components/DashboardLayout.jsx';
import DataTable from '../../../Components/DataTable.jsx';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineUser, HiOutlineEye, HiOutlineBan, HiOutlineCheck } from 'react-icons/hi';

export default function UsersIndex() {
    const columns = [
        { data: 'id', title: 'ID' },
        {
            data: 'name', title: 'User', render: (val, row) => (
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${row.is_blocked ? 'bg-red-50 dark:bg-red-500/10 text-red-500' : 'bg-primary-50 dark:bg-primary-500/10 text-primary-500'}`}>
                        <HiOutlineUser className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">{val}</p>
                        <p className="text-xs text-gray-400 font-mono italic">{row.email}</p>
                    </div>
                </div>
            )
        },
        { data: 'phone', title: 'Phone', render: (val) => <span className="text-gray-600 dark:text-gray-400">{val || '—'}</span> },
        {
            data: 'role', title: 'Role', render: (val) => (
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${val === 'admin' ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                    {val || 'customer'}
                </span>
            )
        },
        {
            data: 'is_blocked', title: 'Status', render: (val) => (
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${val ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'}`}>
                    {val ? 'Blocked' : 'Active'}
                </span>
            )
        },
        {
            data: 'orders_count', title: 'Orders', render: (val) => (
                <span className="font-medium text-gray-700 dark:text-gray-300">{val || 0}</span>
            )
        },
        {
            data: 'total_spent', title: 'Spent', render: (val) => (
                <span className="font-medium text-gray-700 dark:text-gray-300">Rs {Number(val || 0).toLocaleString()}</span>
            )
        },
        { data: 'created_at', title: 'Joined' }
    ];

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "User account will be deleted permanently.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('users.destroy', id));
            }
        });
    };

    const handleToggleBlock = (id, isBlocked) => {
        Swal.fire({
            title: isBlocked ? 'Unblock User?' : 'Block User?',
            text: isBlocked ? 'This user will be able to access their account again.' : 'This user will be blocked from accessing their account.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: isBlocked ? '#10b981' : '#d33',
            confirmButtonText: isBlocked ? 'Yes, unblock!' : 'Yes, block!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('users.toggle-block', id));
            }
        });
    };

    return (
        <DashboardLayout title="User Management">
            <Head title="Users" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage all system users and customers.</p>
                </div>
                <Link
                    href={route('users.create')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 transition-all"
                >
                    <HiOutlinePlus className="w-4 h-4" /> Add User
                </Link>
            </div>

            <DataTable
                url="/users"
                columns={columns}
                actions={(row) => (
                    <div className="flex gap-1 justify-end">
                        <Link
                            href={route('users.show', row.id)}
                            className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
                            title="View Details"
                        >
                            <HiOutlineEye className="w-5 h-5" />
                        </Link>
                        <Link
                            href={route('users.edit', row.id)}
                            className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                            title="Edit"
                        >
                            <HiOutlinePencil className="w-5 h-5" />
                        </Link>
                        <button
                            onClick={() => handleToggleBlock(row.id, row.is_blocked)}
                            className={`p-2 rounded-lg transition-colors ${row.is_blocked ? 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10' : 'text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10'}`}
                            title={row.is_blocked ? 'Unblock' : 'Block'}
                        >
                            {row.is_blocked ? <HiOutlineCheck className="w-5 h-5" /> : <HiOutlineBan className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={() => handleDelete(row.id)}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                            title="Delete"
                        >
                            <HiOutlineTrash className="w-5 h-5" />
                        </button>
                    </div>
                )}
            />
        </DashboardLayout>
    );
}
