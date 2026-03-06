import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import DashboardLayout from '../../../Components/DashboardLayout';

export default function LowStockAlertsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        product_id: '',
        variant_id: '',
        threshold: '',
    });

    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all";

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/low-stock-alerts');
    };

    return (
        <DashboardLayout title="Create Low Stock Alert">
            <div className="max-w-xl">
                <div className="mb-6">
                    <Link href="/low-stock-alerts" className="text-sm text-primary-500 hover:text-primary-600">← Back to Low Stock Alerts</Link>
                </div>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Product ID</label>
                        <input
                            type="number"
                            value={data.product_id}
                            onChange={e => setData('product_id', e.target.value)}
                            placeholder="Enter product ID"
                            className={inputClass + ' placeholder-gray-400'}
                        />
                        {errors.product_id && <p className="text-red-500 text-xs mt-1">{errors.product_id}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Variant ID <span className="text-gray-400 font-normal">(optional)</span></label>
                        <input
                            type="number"
                            value={data.variant_id}
                            onChange={e => setData('variant_id', e.target.value)}
                            placeholder="Leave blank for all variants"
                            className={inputClass + ' placeholder-gray-400'}
                        />
                        {errors.variant_id && <p className="text-red-500 text-xs mt-1">{errors.variant_id}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Alert Threshold</label>
                        <input
                            type="number"
                            min="1"
                            value={data.threshold}
                            onChange={e => setData('threshold', e.target.value)}
                            placeholder="e.g. 5"
                            className={inputClass + ' placeholder-gray-400'}
                        />
                        {errors.threshold && <p className="text-red-500 text-xs mt-1">{errors.threshold}</p>}
                        <p className="text-xs text-gray-400 mt-1">Alert will trigger when stock drops to or below this number.</p>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 disabled:opacity-50 transition-all"
                        >
                            {processing ? 'Creating...' : 'Create Alert'}
                        </button>
                        <Link href="/low-stock-alerts" className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
