import React from 'react';
import { useForm, Link, Head } from '@inertiajs/react';
import DashboardLayout from '../../../Components/DashboardLayout';

export default function AddressesEdit({ address, users }) {
    const { data, setData, put, processing, errors } = useForm({
        email: address.email || '', type: address.type || 'shipping', name: address.name || '', street: address.street || '', city: address.city || '', zip: address.zip || '', phone: address.phone || '', is_default: address.is_default || false,
    });
    const handleSubmit = (e) => { e.preventDefault(); put(route('addresses.update', address.id)); };
    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all";

    return (
        <DashboardLayout title="Edit Address">
            <Head title="Edit Address" />
            <div className="max-w-2xl">
                <div className="mb-6"><Link href={route('addresses.index')} className="text-sm text-primary-500 hover:text-primary-600">← Back to Addresses</Link></div>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Address</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name *</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={inputClass} />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Type *</label>
                            <select value={data.type} onChange={e => setData('type', e.target.value)} className={inputClass}>
                                <option value="shipping">Shipping</option>
                                <option value="billing">Billing</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Street Address *</label>
                            <input type="text" value={data.street} onChange={e => setData('street', e.target.value)} className={inputClass} />
                            {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">City *</label>
                            <input type="text" value={data.city} onChange={e => setData('city', e.target.value)} className={inputClass} />
                            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">ZIP / Postal Code</label>
                            <input type="text" value={data.zip} onChange={e => setData('zip', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
                            <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={inputClass} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="is_default" checked={data.is_default} onChange={e => setData('is_default', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                        <label htmlFor="is_default" className="text-sm text-gray-700 dark:text-gray-300">Set as default address</label>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 disabled:opacity-50">{processing ? 'Saving...' : 'Update Address'}</button>
                        <Link href={route('addresses.index')} className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</Link>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
