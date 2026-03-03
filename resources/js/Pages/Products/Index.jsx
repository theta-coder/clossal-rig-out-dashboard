import React from 'react';
import { Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import DashboardLayout from '../../Components/DashboardLayout';
import DataTable from '../../Components/DataTable';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineEye } from 'react-icons/hi';

export default function ProductsIndex({ categories }) {
    const columns = [
        { data: 'id', title: 'ID' },
        {
            data: 'image', title: 'Image', orderable: false, render: (val) => val ? (
                <img src={val} alt="" className="w-10 h-10 rounded-lg object-cover" />
            ) : <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-xs">No img</div>
        },
        { data: 'name', title: 'Name', render: (val) => <span className="font-medium text-gray-900 dark:text-white">{val}</span> },
        { data: 'category_name', title: 'Category' },
        { data: 'price', title: 'Price', render: (val) => <span className="font-mono">${val}</span> },
        {
            data: 'is_featured', title: 'Featured', render: (val) => (
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${val === 'Yes' ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400' : 'text-gray-400'}`}>{val}</span>
            )
        },
        {
            data: 'is_active', title: 'Status', render: (val) => (
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${val === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>{val}</span>
            )
        },
    ];

    const handleDelete = (id) => {
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
                router.delete(`/products/${id}`);
            }
        });
    };

    return (
        <DashboardLayout title="Products">
            <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your product catalog</p>
                <Link href="/products/create" className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl hover:shadow-primary-500/30">
                    <HiOutlinePlus className="w-4 h-4" /> Add Product
                </Link>
            </div>
            <DataTable
                url="/products"
                columns={columns}
                actions={(row) => (
                    <>
                        <Link href={`/products/${row.id}`} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors">
                            <HiOutlineEye className="w-4 h-4" />
                        </Link>
                        <Link href={`/products/${row.id}/edit`} className="p-2 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 transition-colors">
                            <HiOutlinePencil className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(row.id)} className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors">
                            <HiOutlineTrash className="w-4 h-4" />
                        </button>
                    </>
                )}
            />
        </DashboardLayout>
    );
}
