import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '../../../Components/DashboardLayout';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineTable, HiOutlineSearch } from 'react-icons/hi';
import Swal from 'sweetalert2';

export default function SizeGuidesIndex({ sizeGuides }) {
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Delete Size Guide?',
            text: "This chart will be removed from all assigned products.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('size-guides.destroy', id), {
                    onSuccess: () => Swal.fire('Deleted!', 'Size guide has been removed.', 'success')
                });
            }
        });
    };

    return (
        <DashboardLayout title="Size Guides">
            <Head title="Size Guides" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Size Guides</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage sizing charts for different categories</p>
                </div>
                <Link
                    href={route('size-guides.create')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 transition-all"
                >
                    <HiOutlinePlus className="w-5 h-5" /> Add Chart
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sizeGuides.length > 0 ? sizeGuides.map((guide) => (
                    <div key={guide.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-primary-500">
                                    <HiOutlineTable className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{guide.name}</h3>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Category Specific</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Link
                                    href={route('size-guides.edit', guide.id)}
                                    className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
                                >
                                    <HiOutlinePencil className="w-5 h-5" />
                                </Link>
                                <button
                                    onClick={() => handleDelete(guide.id)}
                                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                >
                                    <HiOutlineTrash className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 flex-1">
                            <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Sizes Included</h4>
                            <div className="flex flex-wrap gap-2">
                                {guide.rows.map((row) => (
                                    <span key={row.id} className="inline-flex px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium">
                                        {row.size_label}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="px-6 py-3 bg-gray-50/50 dark:bg-gray-700/50 text-center border-t border-gray-100 dark:border-gray-700">
                            <Link href={route('size-guides.edit', guide.id)} className="text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                                <HiOutlineSearch className="w-4 h-4" /> View Full Table
                            </Link>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-16 text-center bg-gray-50 dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <HiOutlineTable className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No size guides found</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto">Create measurement charts to help customers pick the right size.</p>
                        <Link
                            href={route('size-guides.create')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-500/25 transition-all"
                        >
                            <HiOutlinePlus className="w-5 h-5" /> Create Your First Guide
                        </Link>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}








