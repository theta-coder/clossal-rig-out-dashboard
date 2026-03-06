import React from 'react';
import { Link, Head } from '@inertiajs/react';
import DashboardLayout from '../../../Components/DashboardLayout';
import { HiOutlinePencil, HiOutlineLocationMarker, HiOutlineUser } from 'react-icons/hi';

function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{value || '—'}</span>
        </div>
    );
}

export default function AddressesShow({ address }) {
    return (
        <DashboardLayout title="Address Details">
            <Head title="Address Details" />
            <div className="max-w-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <Link href={route('addresses.index')} className="text-sm text-primary-500 hover:text-primary-600">← Back to Addresses</Link>
                    <Link href={route('addresses.edit', address.id)} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium transition-all">
                        <HiOutlinePencil className="w-4 h-4" /> Edit Address
                    </Link>
                </div>

                <div className="space-y-6">
                    {/* Address Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center">
                                <HiOutlineLocationMarker className="w-6 h-6 text-primary-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{address.name}</h2>
                                <div className="flex gap-2 mt-1">
                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${address.type === 'shipping' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' : 'bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400'}`}>{address.type}</span>
                                    {address.is_default && <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">Default</span>}
                                </div>
                            </div>
                        </div>
                        <InfoRow label="Street" value={address.street} />
                        <InfoRow label="City" value={address.city} />
                        <InfoRow label="ZIP Code" value={address.zip} />
                        <InfoRow label="Phone" value={address.phone} />
                        <InfoRow label="Email" value={address.email} />
                    </div>

                    {/* User Card */}
                    {address.user && (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Owner</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center">
                                    <HiOutlineUser className="w-5 h-5 text-primary-500" />
                                </div>
                                <div>
                                    <Link href={route('users.show', address.user.id)} className="font-medium text-gray-900 dark:text-white hover:text-primary-500">{address.user.name}</Link>
                                    <p className="text-xs text-gray-400">{address.user.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Related Orders */}
                    {address.orders?.length > 0 && (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Orders using this address ({address.orders.length})</h3>
                            <div className="space-y-2">
                                {address.orders.map(order => (
                                    <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                                        <span className="font-medium text-gray-900 dark:text-white">Order #{order.id}</span>
                                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'}`}>{order.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
