import React from 'react';
import { Link, router } from '@inertiajs/react';
import DashboardLayout from '../../../Components/DashboardLayout';

export default function BackInStockAlertsShow({ alert }) {
    const handleMarkNotified = () => {
        router.put(`/back-in-stock-alerts/${alert.id}`, {}, { preserveScroll: true });
    };

    const rows = [
        { label: 'Product', value: alert.product?.name ?? '—' },
        { label: 'Variant', value: alert.variant?.name ?? '—' },
        { label: 'Customer', value: alert.user?.name ?? '—' },
        { label: 'Email', value: alert.email ?? '—' },
        { label: 'Phone', value: alert.phone ?? '—' },
        { label: 'Notify Via', value: alert.notify_via ? alert.notify_via.charAt(0).toUpperCase() + alert.notify_via.slice(1) : '—' },
        {
            label: 'Notified', value: (
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${alert.is_notified ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'}`}>
                    {alert.is_notified ? 'Yes' : 'Pending'}
                </span>
            )
        },
        { label: 'Notified At', value: alert.notified_at ? new Date(alert.notified_at).toLocaleString() : '—' },
        { label: 'Subscribed At', value: new Date(alert.created_at).toLocaleString() },
    ];

    return (
        <DashboardLayout title="Back-in-Stock Alert Detail">
            <div className="max-w-2xl">
                <div className="mb-6">
                    <Link href="/back-in-stock-alerts" className="text-sm text-primary-500 hover:text-primary-600">← Back to Alerts</Link>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Alert #{alert.id}</h3>
                        {!alert.is_notified && (
                            <button
                                onClick={handleMarkNotified}
                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-all"
                            >
                                Mark as Notified
                            </button>
                        )}
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {rows.map(({ label, value }) => (
                            <div key={label} className="flex items-center px-5 py-3.5">
                                <span className="w-40 text-sm text-gray-500 dark:text-gray-400 shrink-0">{label}</span>
                                <span className="text-sm text-gray-900 dark:text-white">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
