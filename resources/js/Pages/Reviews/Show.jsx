import React from 'react';
import { Link, router } from '@inertiajs/react';
import DashboardLayout from '../../Components/DashboardLayout';
import { HiOutlineStar } from 'react-icons/hi';

export default function ReviewsShow({ review }) {
    const handleVerify = () => {
        router.put(`/reviews/${review.id}`, { is_verified: true });
    };

    return (
        <DashboardLayout title="Review Details">
            <div className="max-w-2xl">
                <div className="mb-6"><Link href="/reviews" className="text-sm text-primary-500 hover:text-primary-600">← Back to Reviews</Link></div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{review.title}</h2>
                            <p className="text-sm text-gray-500 mt-1">by {review.user?.name || review.reviewer_name}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${review.is_verified ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'}`}>
                            {review.is_verified ? 'Verified' : 'Pending'}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => <HiOutlineStar key={i} className={`w-5 h-5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`} />)}
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{review.body}</p>
                    </div>
                    {review.product && (
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center gap-3">
                            <span className="text-sm text-gray-500">Product:</span>
                            <Link href={`/products/${review.product.id}`} className="text-sm font-medium text-primary-500 hover:text-primary-600">{review.product.name}</Link>
                        </div>
                    )}
                    {!review.is_verified && (
                        <button onClick={handleVerify} className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-all">Verify Review</button>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
