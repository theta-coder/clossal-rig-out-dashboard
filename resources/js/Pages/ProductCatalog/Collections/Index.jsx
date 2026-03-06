import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '../../../Components/DashboardLayout';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineSparkles } from 'react-icons/hi';
import Swal from 'sweetalert2';

export default function CollectionsIndex({ collections }) {
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Delete Collection?',
            text: 'All product links in this collection will be removed. This cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('collections.destroy', id));
            }
        });
    };

    const formatDate = (value) => {
        if (!value) return 'Always Active';
        return new Date(value).toLocaleDateString();
    };

    return (
        <DashboardLayout title="Product Collections">
            <Head title="Collections" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Collections</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage curated groups of products.</p>
                </div>
                <Link
                    href={route('collections.create')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 transition-all"
                >
                    <HiOutlinePlus className="w-5 h-5" /> Create Collection
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {collections.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                            <HiOutlineSparkles className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No collections yet</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create your first curated collection to get started.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-700/50">
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Image</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Products</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Timeline</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {collections.map((collection) => (
                                    <tr key={collection.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center border border-gray-100 dark:border-gray-600">
                                                {collection.image ? (
                                                    <img src={`/${collection.image}`} alt={collection.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <HiOutlineSparkles className="w-6 h-6 text-gray-400" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900 dark:text-white">{collection.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{collection.slug}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{collection.products_count}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                            <div>{formatDate(collection.starts_at)}</div>
                                            {collection.ends_at && <div className="text-xs text-red-500">to {formatDate(collection.ends_at)}</div>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${collection.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>
                                                {collection.is_active ? 'ACTIVE' : 'INACTIVE'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Link
                                                href={route('collections.edit', collection.id)}
                                                className="inline-flex p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
                                            >
                                                <HiOutlinePencil className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(collection.id)}
                                                className="inline-flex p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                            >
                                                <HiOutlineTrash className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

