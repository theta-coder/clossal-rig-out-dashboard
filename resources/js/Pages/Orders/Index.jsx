import React from 'react';
import { Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import DashboardLayout from '../../Components/DashboardLayout';
import DataTable from '../../Components/DataTable';
import { HiOutlineEye, HiOutlineTrash } from 'react-icons/hi';

export default function OrdersIndex() {
    const statusColors = {
        processing: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
        shipped: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
        delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
        cancelled: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
    };

    const columns = [
        { data: 'id', title: 'ID' },
        { data: 'order_number', title: 'Order #', render: (val) => <span className="font-medium text-gray-900 dark:text-white">#{val}</span> },
        { data: 'customer_name', title: 'Customer' },
        { data: 'status', title: 'Status', render: (val) => <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[val] || ''}`}>{val}</span> },
        { data: 'total', title: 'Total', render: (val) => <span className="font-mono font-medium">${val}</span> },
        { data: 'payment_method', title: 'Payment', render: (val) => <span className="uppercase text-xs">{val}</span> },
        { data: 'created_at', title: 'Date' },
    ];

    return (
        <DashboardLayout title="Orders">
            <div className="mb-6"><p className="text-sm text-gray-500 dark:text-gray-400">Manage customer orders</p></div>
            <DataTable
                url="/orders"
                columns={columns}
                actions={(row) => (
                    <>
                        <Link href={`/orders/${row.id}`} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors">
                            <HiOutlineEye className="w-4 h-4" />
                        </Link>
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
                                    router.delete(`/orders/${row.id}`);
                                }
                            });
                        }} className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors">
                            <HiOutlineTrash className="w-4 h-4" />
                        </button>
                    </>
                )}
            />
        </DashboardLayout>
    );
}
