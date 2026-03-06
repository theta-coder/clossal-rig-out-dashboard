import React from 'react';
import { Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import DashboardLayout from '../../../Components/DashboardLayout';
import DataTable from '../../../Components/DataTable';
import { HiOutlineEye, HiOutlineTrash, HiOutlineCheck } from 'react-icons/hi';

export default function BackInStockAlertsIndex() {
    const handleMarkNotified = (id) => {
        router.put(`/back-in-stock-alerts/${id}`, {}, {
            preserveScroll: true,
        });
    };

    const columns = [
        { data: 'id', title: 'ID' },
        { data: 'product', title: 'Product' },
        { data: 'customer', title: 'Customer' },
        { data: 'email', title: 'Email' },
        { data: 'notify_via', title: 'Notify Via' },
        {
            data: 'is_notified', title: 'Notified', render: (val) => (
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${val === 'Yes' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'}`}>{val}</span>
            )
        },
        { data: 'notified_at', title: 'Notified At' },
        { data: 'created_at', title: 'Subscribed' },
    ];

    return (
        <DashboardLayout title="Back-in-Stock Alerts">
            <div className="mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">Customer subscriptions for out-of-stock product notifications</p>
            </div>
            <DataTable
                url="/back-in-stock-alerts"
                columns={columns}
                actions={(row) => (
                    <>
                        <Link
                            href={`/back-in-stock-alerts/${row.id}`}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
                        >
                            <HiOutlineEye className="w-4 h-4" />
                        </Link>
                        {row.is_notified === 'Pending' && (
                            <button
                                onClick={() => handleMarkNotified(row.id)}
                                className="p-2 rounded-lg text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400 transition-colors"
                                title="Mark as Notified"
                            >
                                <HiOutlineCheck className="w-4 h-4" />
                            </button>
                        )}
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
                                        router.delete(`/back-in-stock-alerts/${row.id}`);
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
