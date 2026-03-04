import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import DashboardLayout from '../../Components/DashboardLayout';

export default function UsersCreate() {
    const { data, setData, post, processing, errors } = useForm({ name: '', email: '', password: '', password_confirmation: '', phone: '', role: 'customer' });
    const handleSubmit = (e) => { e.preventDefault(); post('/users'); };
    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all";

    return (
        <DashboardLayout title="Create User">
            <div className="max-w-2xl">
                <div className="mb-6"><Link href="/users" className="text-sm text-primary-500 hover:text-primary-600">← Back to Users</Link></div>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label><input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={inputClass} />{errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}</div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label><input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={inputClass} />{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}</div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label><input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className={inputClass} /></div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Role</label>
                        <select value={data.role} onChange={e => setData('role', e.target.value)} className={inputClass}>
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                        {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label><input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className={inputClass} />{errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}</div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label><input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} className={inputClass} /></div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 disabled:opacity-50">{processing ? 'Creating...' : 'Create User'}</button>
                        <Link href="/users" className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</Link>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
