import React from 'react';
import { Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import DashboardLayout from '../../../Components/DashboardLayout';
import DataTable from '../../../Components/DataTable';
import { HiOutlineEye, HiOutlineTrash } from 'react-icons/hi';

export default function StockReservationsIndex() {
    const statusColors = {
        active: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
        expired: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
        released: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
        confirmed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    };

    const columns = [
        { data: 'id', title: 'ID' },
        { data: 'product', title: 'Product' },
        { data: 'quantity', title: 'Qty' },
        {
            data: 'status', title: 'Status', render: (val) => (
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[val?.toLowerCase()] || ''}`}>{val}</span>
            )
        },
        { data: 'order', title: 'Order' },
        { data: 'expires_at', title: 'Expires At' },
        { data: 'created_at', title: 'Created' },
    ];

    return (
        <DashboardLayout title="Stock Reservations">
            <div className="mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">Temporary stock holds during active checkouts</p>
            </div>
            <DataTable
                url="/stock-reservations"
                columns={columns}
                actions={(row) => (
                    <>
                        <Link
                            href={`/stock-reservations/${row.id}`}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
                        >
                            <HiOutlineEye className="w-4 h-4" />
                        </Link>
                        <button
                            onClick={() => {
                                Swal.fire({
                                    title: 'Release Reservation?',
                                    text: 'This will free the held stock.',
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#d33',
                                    cancelButtonColor: '#3085d6',
                                    confirmButtonText: 'Yes, release it!',
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        router.delete(`/stock-reservations/${row.id}`);
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
