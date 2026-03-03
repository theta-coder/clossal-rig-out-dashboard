import React from 'react';
import { Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import DashboardLayout from '../../Components/DashboardLayout';
import DataTable from '../../Components/DataTable';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';

export default function CouponsIndex() {
    const columns = [
        { data: 'id', title: 'ID' },
        {
            data: 'code', title: 'Code', render: (val) => (
                <span className="font-mono font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{val}</span>
            )
        },
        { data: 'discount_type', title: 'Type', render: (val) => <span className="capitalize">{val}</span> },
        { data: 'discount_value', title: 'Value' },
        { data: 'min_order_amount', title: 'Min Order' },
        { data: 'used_count', title: 'Used', render: (val, row) => <span>{val}{row.max_uses ? ` / ${row.max_uses}` : ''}</span> },
        {
            data: 'is_active', title: 'Status', render: (val) => (
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${val === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>{val}</span>
            )
        },
        { data: 'expires_at', title: 'Expires' },
    ];

    return (
        <DashboardLayout title="Coupons">
            <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage discount coupons</p>
                <Link href="/coupons/create" className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 transition-all">
                    <HiOutlinePlus className="w-4 h-4" /> Add Coupon
                </Link>
            </div>
            <DataTable url="/coupons" columns={columns} actions={(row) => (
                <>
                    <Link href={`/coupons/${row.id}/edit`} className="p-2 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 transition-colors"><HiOutlinePencil className="w-4 h-4" /></Link>
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
                                router.delete(`/coupons/${row.id}`);
                            }
                        });
                    }} className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"><HiOutlineTrash className="w-4 h-4" /></button>
                </>
            )} />
        </DashboardLayout>
    );
}
