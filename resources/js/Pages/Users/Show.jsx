import React from 'react';
import { Link } from '@inertiajs/react';
import DashboardLayout from '../../Components/DashboardLayout';

export default function UsersShow({ user }) {
    return (
        <DashboardLayout title="User Details">
            <div className="max-w-4xl">
                <div className="mb-6 flex items-center justify-between">
                    <Link href="/users" className="text-sm text-primary-500 hover:text-primary-600">← Back to Users</Link>
                    <Link href={`/users/${user.id}/edit`} className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium transition-all">Edit User</Link>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 text-center">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">{user.name?.charAt(0)?.toUpperCase()}</div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{user.name}</h2>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        {user.phone && <p className="text-sm text-gray-500 mt-1">{user.phone}</p>}
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                        {/* Orders */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                            <div className="p-5 border-b border-gray-100 dark:border-gray-800"><h3 className="font-semibold text-gray-900 dark:text-white">Orders ({user.orders?.length || 0})</h3></div>
                            {user.orders?.length > 0 ? (
                                <div className="divide-y divide-gray-50 dark:divide-gray-800/50">{user.orders.map(o => (
                                    <Link key={o.id} href={`/orders/${o.id}`} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <div><p className="font-medium text-gray-900 dark:text-white text-sm">#{o.order_number}</p><p className="text-xs text-gray-500 capitalize">{o.status}</p></div>
                                        <span className="font-mono text-sm">${Number(o.total).toFixed(2)}</span>
                                    </Link>
                                ))}</div>
                            ) : <p className="p-5 text-sm text-gray-400">No orders yet</p>}
                        </div>
                        {/* Addresses */}
                        {user.addresses?.length > 0 && (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Addresses</h3>
                                <div className="grid gap-3">{user.addresses.map(a => (
                                    <div key={a.id} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400">
                                        <p className="font-medium text-gray-900 dark:text-white">{a.name} ({a.type})</p>
                                        <p>{a.street}, {a.city} {a.zip}</p>
                                    </div>
                                ))}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
