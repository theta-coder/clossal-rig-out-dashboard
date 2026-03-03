import React from 'react';
import { Link, router } from '@inertiajs/react';
import DashboardLayout from '../../Components/DashboardLayout';
import DataTable from '../../Components/DataTable';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineCheck } from 'react-icons/hi';

export default function CategoriesIndex() {
    const columns = [
        { data: 'id', title: 'ID' },
        {
            data: 'name', title: 'Name', render: (val, row) => (
                <span className="font-medium text-gray-900 dark:text-white">{val}</span>
            )
        },
        { data: 'slug', title: 'Slug' },
        { data: 'parent_name', title: 'Parent' },
        {
            data: 'products_count', title: 'Products', render: (val) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400">{val}</span>
            )
        },
        {
            data: 'is_active', title: 'Status', render: (val) => (
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${val === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>{val}</span>
            )
        },
    ];

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(`/categories/${id}`);
        }
    };

    const handleActivate = (id) => {
        if (confirm('Are you sure you want to activate this category?')) {
            router.post(`/categories/${id}/activate`);
        }
    };

    return (
        <DashboardLayout title="Categories">
            <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your product categories</p>
                <Link href="/categories/create" className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl hover:shadow-primary-500/30">
                    <HiOutlinePlus className="w-4 h-4" /> Add Category
                </Link>
            </div>
            <DataTable
                url="/categories"
                columns={columns}
                actions={(row) => (
                    <>
                        <Link href={`/categories/${row.id}/edit`} className="p-2 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 transition-colors">
                            <HiOutlinePencil className="w-4 h-4" />
                        </Link>
                        {row.is_active === 'Inactive' && (
                            <button onClick={() => handleActivate(row.id)} title="Activate Category" className="p-2 rounded-lg text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400 transition-colors">
                                <HiOutlineCheck className="w-4 h-4" />
                            </button>
                        )}
                        <button onClick={() => handleDelete(row.id)} className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors">
                            <HiOutlineTrash className="w-4 h-4" />
                        </button>
                    </>
                )}
            />
        </DashboardLayout>
    );
}
