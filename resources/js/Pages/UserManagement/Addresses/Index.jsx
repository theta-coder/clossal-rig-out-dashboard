import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import DashboardLayout from '../../../Components/DashboardLayout';
import DataTable from '../../../Components/DataTable';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineLocationMarker, HiOutlineEye, HiOutlineStar } from 'react-icons/hi';

export default function AddressesIndex() {
    const columns = [
        { data: 'id', title: 'ID' },
        {
            data: 'user_name', title: 'User', render: (val, row) => (
                <div>
                    <p className="font-medium text-gray-900 dark:text-white">{val}</p>
                    <p className="text-xs text-gray-400">{row.user_email}</p>
                </div>
            )
        },
        {
            data: 'name', title: 'Address', render: (val, row) => (
                <div className="flex items-center gap-2">
                    <HiOutlineLocationMarker className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">{val}</p>
                        <p className="text-xs text-gray-400">{row.street}, {row.city} {row.zip}</p>
                    </div>
                </div>
            )
        },
        { data: 'phone', title: 'Phone', render: (val) => <span className="text-gray-600 dark:text-gray-400">{val || '—'}</span> },
        {
            data: 'type', title: 'Type', render: (val) => (
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${val === 'shipping' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' : 'bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400'}`}>
                    {val}
                </span>
            )
        },
        {
            data: 'is_default', title: 'Default', render: (val) => (
                val ? <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">✓ Default</span>
                    : <span className="text-gray-400 text-xs">—</span>
            )
        },
        { data: 'created_at', title: 'Created' },
    ];

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Delete Address?', text: "This action cannot be undone.", icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Yes, delete!'
        }).then((result) => {
            if (result.isConfirmed) router.delete(route('addresses.destroy', id));
        });
    };

    const handleSetDefault = (id) => {
        router.post(route('addresses.set-default', id));
    };

    return (
        <DashboardLayout title="Addresses">
            <Head title="Addresses" />
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Addresses</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage user shipping and billing addresses.</p>
                </div>
                <Link href={route('addresses.create')} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 transition-all">
                    <HiOutlinePlus className="w-4 h-4" /> Add Address
                </Link>
            </div>
            <DataTable url="/addresses" columns={columns} actions={(row) => (
                <div className="flex gap-1 justify-end">
                    <Link href={route('addresses.show', row.id)} className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors" title="View">
                        <HiOutlineEye className="w-5 h-5" />
                    </Link>
                    {!row.is_default && (
                        <button onClick={() => handleSetDefault(row.id)} className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors" title="Set Default">
                            <HiOutlineStar className="w-5 h-5" />
                        </button>
                    )}
                    <Link href={route('addresses.edit', row.id)} className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors" title="Edit">
                        <HiOutlinePencil className="w-5 h-5" />
                    </Link>
                    <button onClick={() => handleDelete(row.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Delete">
                        <HiOutlineTrash className="w-5 h-5" />
                    </button>
                </div>
            )} />
        </DashboardLayout>
    );
}
