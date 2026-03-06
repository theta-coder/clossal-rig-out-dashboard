import React from 'react';
import { useForm, Link, Head } from '@inertiajs/react';
import DashboardLayout from '../../../Components/DashboardLayout';

export default function UsersEdit({ user, userRole, roles }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '', email: user.email || '', password: '', password_confirmation: '', phone: user.phone || '', gender: user.gender || '', date_of_birth: user.date_of_birth || '', role: userRole || '',
    });
    const handleSubmit = (e) => { e.preventDefault(); put(route('users.update', user.id)); };
    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all";

    return (
        <DashboardLayout title="Edit User">
            <Head title={`Edit ${user.name}`} />
            <div className="max-w-2xl">
                <div className="mb-6"><Link href={route('users.index')} className="text-sm text-primary-500 hover:text-primary-600">← Back to Users</Link></div>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit User</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={inputClass} />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={inputClass} />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
                            <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} placeholder="Leave blank to keep current" className={inputClass + ' placeholder-gray-400'} />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
                            <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} placeholder="Repeat new password" className={inputClass + ' placeholder-gray-400'} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
                            <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="+92 300 1234567" className={inputClass + ' placeholder-gray-400'} />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Role *</label>
                            <select value={data.role} onChange={e => setData('role', e.target.value)} className={inputClass}>
                                <option value="">Select Role</option>
                                {roles?.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                            </select>
                            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Gender</label>
                            <select value={data.gender} onChange={e => setData('gender', e.target.value)} className={inputClass}>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date of Birth</label>
                            <input type="date" value={data.date_of_birth} onChange={e => setData('date_of_birth', e.target.value)} className={inputClass} />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 disabled:opacity-50">{processing ? 'Saving...' : 'Update User'}</button>
                        <Link href={route('users.index')} className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</Link>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
