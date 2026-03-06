import React from 'react';
import { Link } from '@inertiajs/react';
import DashboardLayout from '../../../Components/DashboardLayout';

export default function StockReservationsShow({ reservation }) {
    const statusColors = {
        active: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
        expired: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
        released: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
        confirmed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    };

    const rows = [
        { label: 'Product', value: reservation.product?.name ?? '—' },
        { label: 'Variant', value: reservation.variant?.name ?? '—' },
        { label: 'Quantity', value: reservation.quantity },
        {
            label: 'Status', value: (
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[reservation.status?.toLowerCase()] || ''}`}>
                    {reservation.status}
                </span>
            )
        },
        { label: 'Order', value: reservation.order?.order_number ?? '—' },
        { label: 'Expires At', value: reservation.expires_at ? new Date(reservation.expires_at).toLocaleString() : '—' },
        { label: 'Created At', value: new Date(reservation.created_at).toLocaleString() },
    ];

    return (
        <DashboardLayout title="Stock Reservation Detail">
            <div className="max-w-2xl">
                <div className="mb-6">
                    <Link href="/stock-reservations" className="text-sm text-primary-500 hover:text-primary-600">← Back to Reservations</Link>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Reservation #{reservation.id}</h3>
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
