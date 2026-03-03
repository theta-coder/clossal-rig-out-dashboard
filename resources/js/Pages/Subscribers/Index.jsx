import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import DashboardLayout from '../../Components/DashboardLayout';
import DataTable from '../../Components/DataTable';
import { HiOutlineTrash, HiOutlineBan, HiOutlineCheck } from 'react-icons/hi';

export default function SubscribersIndex() {
    const [refreshKey, setRefreshKey] = useState(0);

    const columns = [
        { data: 'id', title: 'ID' },
        { data: 'email', title: 'Email', render: (val) => <span className="font-medium text-gray-900 dark:text-white">{val}</span> },
        {
            data: 'is_active', title: 'Status', render: (val) => (
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${val === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>{val}</span>
            )
        },
        { data: 'created_at', title: 'Subscribed' },
    ];

    const toggleActive = (id, currentStatus) => {
        router.put(`/subscribers/${id}`, { is_active: currentStatus !== 'Active' }, {
            onSuccess: () => setRefreshKey(k => k + 1),
            preserveScroll: true,
        });
    };

    return (
        <DashboardLayout title="Subscribers">
            <div className="mb-6"><p className="text-sm text-gray-500 dark:text-gray-400">Manage newsletter subscribers</p></div>
            <DataTable url="/subscribers" columns={columns} refreshKey={refreshKey} actions={(row) => (
                <>
                    <button onClick={() => toggleActive(row.id, row.is_active)} className={`p-2 rounded-lg transition-colors ${row.is_active === 'Active' ? 'text-gray-500 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:text-amber-400' : 'text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400'}`} title={row.is_active === 'Active' ? 'Deactivate' : 'Activate'}>
                        {row.is_active === 'Active' ? <HiOutlineBan className="w-4 h-4" /> : <HiOutlineCheck className="w-4 h-4" />}
                    </button>
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
                                router.delete(`/subscribers/${row.id}`, { onSuccess: () => setRefreshKey(k => k + 1) });
                            }
                        });
                    }} className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors">
                        <HiOutlineTrash className="w-4 h-4" />
                    </button>
                </>
            )} />
        </DashboardLayout>
    );
}
