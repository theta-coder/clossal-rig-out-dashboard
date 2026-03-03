import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import DashboardLayout from '../../Components/DashboardLayout';
import DataTable from '../../Components/DataTable';
import { HiOutlineTrash, HiOutlineCheckCircle, HiOutlineStar } from 'react-icons/hi';

export default function ReviewsIndex() {
    const [refreshKey, setRefreshKey] = useState(0);

    const columns = [
        { data: 'id', title: 'ID' },
        { data: 'product_name', title: 'Product', render: (val) => <span className="font-medium text-gray-900 dark:text-white">{val}</span> },
        { data: 'user_name', title: 'Reviewer' },
        {
            data: 'rating', title: 'Rating', render: (val) => (
                <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                        <HiOutlineStar key={i} className={`w-4 h-4 ${i < val ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`} />
                    ))}
                </div>
            )
        },
        { data: 'title', title: 'Title' },
        {
            data: 'is_verified', title: 'Status', render: (val) => (
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${val === 'Verified' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'}`}>{val}</span>
            )
        },
        { data: 'created_at', title: 'Date' },
    ];

    const handleVerify = (id) => {
        router.put(`/reviews/${id}`, { is_verified: true }, {
            onSuccess: () => setRefreshKey(k => k + 1),
            preserveScroll: true,
        });
    };

    return (
        <DashboardLayout title="Reviews">
            <div className="mb-6"><p className="text-sm text-gray-500 dark:text-gray-400">Manage product reviews</p></div>
            <DataTable
                url="/reviews"
                columns={columns}
                refreshKey={refreshKey}
                actions={(row) => (
                    <>
                        {row.is_verified === 'Pending' && (
                            <button onClick={() => handleVerify(row.id)} className="p-2 rounded-lg text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400 transition-colors" title="Verify">
                                <HiOutlineCheckCircle className="w-4 h-4" />
                            </button>
                        )}
                        <button onClick={() => { if (confirm('Delete this review?')) router.delete(`/reviews/${row.id}`, { onSuccess: () => setRefreshKey(k => k + 1) }); }} className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors">
                            <HiOutlineTrash className="w-4 h-4" />
                        </button>
                    </>
                )}
            />
        </DashboardLayout>
    );
}
