import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import DashboardLayout from '../../Components/DashboardLayout';

export default function CouponsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        code: '', discount_type: 'percentage', discount_value: '', min_order_amount: '', max_uses: '', is_active: true, expires_at: '',
    });
    const handleSubmit = (e) => { e.preventDefault(); post('/coupons'); };
    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all";

    return (
        <DashboardLayout title="Create Coupon">
            <div className="max-w-2xl">
                <div className="mb-6"><Link href="/coupons" className="text-sm text-primary-500 hover:text-primary-600">← Back to Coupons</Link></div>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Code</label><input type="text" value={data.code} onChange={e => setData('code', e.target.value.toUpperCase())} placeholder="e.g. SAVE20" className={inputClass + ' font-mono uppercase placeholder-gray-400'} />{errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}</div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Discount Type</label><select value={data.discount_type} onChange={e => setData('discount_type', e.target.value)} className={inputClass}><option value="percentage">Percentage (%)</option><option value="fixed">Fixed ($)</option></select></div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Discount Value</label><input type="number" step="0.01" value={data.discount_value} onChange={e => setData('discount_value', e.target.value)} className={inputClass} />{errors.discount_value && <p className="text-red-500 text-xs mt-1">{errors.discount_value}</p>}</div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Min Order Amount</label><input type="number" step="0.01" value={data.min_order_amount} onChange={e => setData('min_order_amount', e.target.value)} placeholder="Optional" className={inputClass + ' placeholder-gray-400'} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Max Uses</label><input type="number" value={data.max_uses} onChange={e => setData('max_uses', e.target.value)} placeholder="Unlimited" className={inputClass + ' placeholder-gray-400'} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Expires At</label><input type="datetime-local" value={data.expires_at} onChange={e => setData('expires_at', e.target.value)} className={inputClass} /></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="is_active" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                        <label htmlFor="is_active" className="text-sm text-gray-700 dark:text-gray-300">Active</label>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 disabled:opacity-50">{processing ? 'Creating...' : 'Create Coupon'}</button>
                        <Link href="/coupons" className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</Link>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
