import React from 'react';
import { Link } from '@inertiajs/react';
import DashboardLayout from '../../../Components/DashboardLayout';

export default function StockLogsShow({ log }) {
    const typeColors = {
        addition: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
        subtraction: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
        adjustment: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
    };

    const rows = [
        { label: 'Product', value: log.product?.name ?? '—' },
        { label: 'Variant', value: log.variant?.name ?? '—' },
        { label: 'Type', value: <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${typeColors[log.type?.toLowerCase()] || ''}`}>{log.type}</span> },
        { label: 'Quantity Before', value: log.quantity_before },
        { label: 'Quantity Change', value: <span className={`font-mono font-medium ${log.quantity_change > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>{log.quantity_change > 0 ? '+' : ''}{log.quantity_change}</span> },
        { label: 'Quantity After', value: log.quantity_after },
        { label: 'Reason', value: log.reason ?? '—' },
        { label: 'Notes', value: log.notes ?? '—' },
        { label: 'Done By', value: log.user?.name ?? 'System' },
        { label: 'Order', value: log.order?.order_number ?? '—' },
        { label: 'Date', value: new Date(log.created_at).toLocaleString() },
    ];

    return (
        <DashboardLayout title="Stock Log Detail">
            <div className="max-w-2xl">
                <div className="mb-6">
                    <Link href="/stock-logs" className="text-sm text-primary-500 hover:text-primary-600">← Back to Stock Logs</Link>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Log #{log.id}</h3>
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
