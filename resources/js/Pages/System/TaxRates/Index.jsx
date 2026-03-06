import DashboardLayout from '../../../Components/DashboardLayout';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { HiOutlineReceiptTax, HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineX } from 'react-icons/hi';

export default function Index({ taxRates, categories, zones }) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        rate: '',
        applies_to: 'all',
        category_id: '',
        zone_id: '',
        is_inclusive: false,
        is_active: true,
    });

    const openEdit = (tax) => {
        setEditing(tax);
        setData({ name: tax.name, rate: tax.rate, applies_to: tax.applies_to, category_id: tax.category_id ?? '', zone_id: tax.zone_id ?? '', is_inclusive: !!tax.is_inclusive, is_active: !!tax.is_active });
        setShowForm(true);
    };

    const closeForm = () => { setShowForm(false); setEditing(null); reset(); };

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            put(route('system.tax-rates.update', editing.id), { onSuccess: closeForm });
        } else {
            post(route('system.tax-rates.store'), { onSuccess: closeForm });
        }
    };

    const destroy = (id) => {
        if (confirm('Delete this tax rate?')) {
            router.delete(route('system.tax-rates.destroy', id));
        }
    };

    return (
        <DashboardLayout title="Tax Rates">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tax Rates</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure GST and other tax rules</p>
                </div>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-md shadow-primary-500/20 transition-all">
                    <HiOutlinePlus className="w-5 h-5" /> Add Tax Rate
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">{editing ? 'Edit' : 'Add'} Tax Rate</h3>
                            <button onClick={closeForm}><HiOutlineX className="w-5 h-5 text-slate-400 hover:text-slate-700 dark:hover:text-white" /></button>
                        </div>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Name</label>
                                <input value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="e.g. GST 17%" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Rate (%)</label>
                                <input type="number" step="0.01" value={data.rate} onChange={e => setData('rate', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="17.00" />
                                {errors.rate && <p className="text-red-500 text-xs mt-1">{errors.rate}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Applies To</label>
                                <select value={data.applies_to} onChange={e => setData('applies_to', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm">
                                    <option value="all">All Products</option>
                                    <option value="category">Specific Category</option>
                                    <option value="zone">Specific Zone</option>
                                </select>
                            </div>
                            {data.applies_to === 'category' && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Category</label>
                                    <select value={data.category_id} onChange={e => setData('category_id', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm">
                                        <option value="">Select...</option>
                                        {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            )}
                            {data.applies_to === 'zone' && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Shipping Zone</label>
                                    <select value={data.zone_id} onChange={e => setData('zone_id', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm">
                                        <option value="">Select...</option>
                                        {zones?.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                                    </select>
                                </div>
                            )}
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <input type="checkbox" checked={data.is_inclusive} onChange={e => setData('is_inclusive', e.target.checked)} className="rounded" />
                                    Tax Inclusive
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="rounded" />
                                    Active
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={closeForm} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50">
                                    {editing ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Name</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Rate</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Applies To</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Inclusive</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {taxRates.data?.length === 0 && (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No tax rates configured.</td></tr>
                        )}
                        {taxRates.data?.map((tax) => (
                            <tr key={tax.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600"><HiOutlineReceiptTax className="w-4 h-4" /></div>
                                        <span className="font-semibold text-slate-900 dark:text-white">{tax.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{tax.rate}%</td>
                                <td className="px-6 py-4 capitalize text-slate-600 dark:text-slate-400">
                                    {tax.applies_to === 'category' ? tax.category?.name ?? 'Category' : tax.applies_to === 'zone' ? tax.zone?.name ?? 'Zone' : 'All Products'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${tax.is_inclusive ? 'bg-blue-500/10 text-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                        {tax.is_inclusive ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${tax.is_active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                                        {tax.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => openEdit(tax)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                                            <HiOutlinePencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => destroy(tax.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                            <HiOutlineTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
