import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import DashboardLayout from '../../../Components/DashboardLayout';

export default function LowStockAlertsEdit({ alert }) {
    const { data, setData, put, processing, errors } = useForm({
        threshold: alert.threshold,
        is_alerted: alert.is_alerted,
    });

    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all";

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/low-stock-alerts/${alert.id}`);
    };

    return (
        <DashboardLayout title="Edit Low Stock Alert">
            <div className="max-w-xl">
                <div className="mb-6">
                    <Link href="/low-stock-alerts" className="text-sm text-primary-500 hover:text-primary-600">← Back to Low Stock Alerts</Link>
                </div>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
                    {/* Read-only info */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Product: <span className="text-gray-900 dark:text-white font-medium">{alert.product?.name ?? `#${alert.product_id}`}</span></p>
                        {alert.variant && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">Variant: <span className="text-gray-900 dark:text-white font-medium">{alert.variant.name}</span></p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Alert Threshold</label>
                        <input
                            type="number"
                            min="1"
                            value={data.threshold}
                            onChange={e => setData('threshold', e.target.value)}
                            className={inputClass}
                        />
                        {errors.threshold && <p className="text-red-500 text-xs mt-1">{errors.threshold}</p>}
                        <p className="text-xs text-gray-400 mt-1">Alert triggers when stock drops to or below this number.</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_alerted"
                            checked={data.is_alerted}
                            onChange={e => setData('is_alerted', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                        />
                        <label htmlFor="is_alerted" className="text-sm text-gray-700 dark:text-gray-300">Mark as already alerted</label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 disabled:opacity-50 transition-all"
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
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
