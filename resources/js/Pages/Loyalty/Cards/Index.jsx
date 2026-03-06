import DashboardLayout from '../../../Components/DashboardLayout';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { HiOutlineGift, HiOutlineCreditCard, HiOutlineX } from 'react-icons/hi';

export default function Index({ cards = { data: [], current_page: 1, last_page: 1, total: 0, from: null, to: null } }) {
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        code: '', initial_value: '', user_id: '', expiry_date: '',
    });

    const closeForm = () => { setShowForm(false); reset(); };

    const submit = (e) => {
        e.preventDefault();
        post(route('dashboard.loyalty.cards.store'), { onSuccess: closeForm });
    };

    return (
        <DashboardLayout title="Store Gift Cards">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Cards</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and track issued gift cards and their balances</p>
                </div>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all font-semibold shadow-md shadow-primary-500/20">
                    <HiOutlineGift className="w-5 h-5" />
                    Issue New Card
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Issue New Gift Card</h3>
                            <button onClick={closeForm}><HiOutlineX className="w-5 h-5 text-slate-400 hover:text-slate-700 dark:hover:text-white" /></button>
                        </div>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Card Code</label>
                                <input value={data.code} onChange={e => setData('code', e.target.value.toUpperCase())}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono uppercase"
                                    placeholder="GC-2024-XXXX" />
                                {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Value (RS)</label>
                                    <input type="number" step="1" min="1" value={data.initial_value} onChange={e => setData('initial_value', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                        placeholder="500" />
                                    {errors.initial_value && <p className="text-red-500 text-xs mt-1">{errors.initial_value}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Expiry Date</label>
                                    <input type="date" value={data.expiry_date} onChange={e => setData('expiry_date', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">User ID (optional)</label>
                                <input type="number" value={data.user_id} onChange={e => setData('user_id', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                    placeholder="Leave blank for open use" />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={closeForm} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50">Issue Card</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Card Code</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Value / Balance</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Recipient</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Expiry</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {cards.data.length === 0 && (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No gift cards issued.</td></tr>
                        )}
                        {cards.data.map((c) => (
                            <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-600">
                                            <HiOutlineCreditCard className="w-5 h-5" />
                                        </div>
                                        <span className="font-black text-slate-900 dark:text-white tracking-widest uppercase">{c.code}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-lg font-black text-slate-900 dark:text-white">RS {Number(c.current_value ?? 0).toLocaleString()}</p>
                                    <p className="text-xs text-slate-400">of RS {Number(c.initial_value ?? 0).toLocaleString()}</p>
                                </td>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-tight truncate max-w-[200px]">
                                    {c.user?.name ?? 'Open Use'}
                                </td>
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                                    {c.expiry_date ? new Date(c.expiry_date).toLocaleDateString() : '—'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${c.is_active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                                        {c.is_active ? 'Active' : 'Redeemed'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {cards.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-sm text-slate-500 dark:text-slate-400">{cards.from}–{cards.to} of {cards.total}</span>
                        <div className="flex gap-2">
                            {cards.current_page > 1 && <a href={`?page=${cards.current_page - 1}`} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Prev</a>}
                            {cards.current_page < cards.last_page && <a href={`?page=${cards.current_page + 1}`} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Next</a>}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
