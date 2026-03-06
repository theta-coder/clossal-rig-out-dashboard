import React from 'react';
import { Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import DashboardLayout from '../../../Components/DashboardLayout';
import DataTable from '../../../Components/DataTable';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';

export default function LowStockAlertsIndex() {
    const columns = [
        { data: 'id', title: 'ID' },
        { data: 'product', title: 'Product' },
        { data: 'variant', title: 'Variant' },
        { data: 'threshold', title: 'Threshold' },
        {
            data: 'is_alerted', title: 'Alerted', render: (val) => (
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${val === 'Yes' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>{val}</span>
            )
        },
        { data: 'last_alerted_at', title: 'Last Alerted' },
    ];

    return (
        <DashboardLayout title="Low Stock Alerts">
            <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">Monitor products running low on stock</p>
                <Link
                    href="/low-stock-alerts/create"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 transition-all"
                >
                    <HiOutlinePlus className="w-4 h-4" /> Add Alert
                </Link>
            </div>
            <DataTable
                url="/low-stock-alerts"
                columns={columns}
                actions={(row) => (
                    <>
                        <Link
                            href={`/low-stock-alerts/${row.id}/edit`}
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
                                        router.delete(`/low-stock-alerts/${row.id}`);
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
