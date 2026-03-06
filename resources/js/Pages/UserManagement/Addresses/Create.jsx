import React from 'react';
import { useForm, Link, Head } from '@inertiajs/react';
import DashboardLayout from '../../../Components/DashboardLayout';

export default function AddressesCreate({ users }) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: '', email: '', type: 'shipping', name: '', street: '', city: '', zip: '', phone: '', is_default: false,
    });
    const handleSubmit = (e) => { e.preventDefault(); post(route('addresses.store')); };
    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all";

    return (
        <DashboardLayout title="Add Address">
            <Head title="Add Address" />
            <div className="max-w-2xl">
                <div className="mb-6"><Link href={route('addresses.index')} className="text-sm text-primary-500 hover:text-primary-600">← Back to Addresses</Link></div>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">New Address</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">User *</label>
                            <select value={data.user_id} onChange={e => setData('user_id', e.target.value)} className={inputClass}>
                                <option value="">Select User</option>
                                {users?.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                            </select>
                            {errors.user_id && <p className="text-red-500 text-xs mt-1">{errors.user_id}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name *</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Home, Office, etc." className={inputClass + ' placeholder-gray-400'} />
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
                            <input type="text" value={data.street} onChange={e => setData('street', e.target.value)} placeholder="123 Main St, Apt 4" className={inputClass + ' placeholder-gray-400'} />
                            {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">City *</label>
                            <input type="text" value={data.city} onChange={e => setData('city', e.target.value)} placeholder="Lahore" className={inputClass + ' placeholder-gray-400'} />
                            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">ZIP / Postal Code</label>
                            <input type="text" value={data.zip} onChange={e => setData('zip', e.target.value)} placeholder="54000" className={inputClass + ' placeholder-gray-400'} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
                            <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="+92 300 1234567" className={inputClass + ' placeholder-gray-400'} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="Optional email" className={inputClass + ' placeholder-gray-400'} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="is_default" checked={data.is_default} onChange={e => setData('is_default', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                        <label htmlFor="is_default" className="text-sm text-gray-700 dark:text-gray-300">Set as default address</label>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 disabled:opacity-50">{processing ? 'Creating...' : 'Create Address'}</button>
                        <Link href={route('addresses.index')} className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</Link>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
