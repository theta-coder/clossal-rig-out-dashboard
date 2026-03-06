import DashboardLayout from '../../../Components/DashboardLayout';
import { useForm, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { HiOutlineUsers, HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineX, HiOutlineStar } from 'react-icons/hi';

const statusColors = { active: 'bg-emerald-500/10 text-emerald-600', expired: 'bg-slate-100 dark:bg-slate-800 text-slate-500', cancelled: 'bg-red-500/10 text-red-600', pending: 'bg-amber-500/10 text-amber-600' };

export default function Users({ subscriptions, plans }) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        user_id: '', plan_id: '', status: 'active',
        amount_paid: '', starts_at: '', ends_at: '', auto_renew: true,
    });

    const openEdit = (s) => {
        setEditing(s);
        setData({ user_id: s.user_id, plan_id: s.plan_id, status: s.status, amount_paid: s.amount_paid, starts_at: s.starts_at?.slice(0, 10) ?? '', ends_at: s.ends_at?.slice(0, 10) ?? '', auto_renew: !!s.auto_renew });
        setShowForm(true);
    };

    const closeForm = () => { setShowForm(false); setEditing(null); reset(); };

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            put(route('system.user-subscriptions.update', editing.id), { onSuccess: closeForm });
        } else {
            post(route('system.user-subscriptions.store'), { onSuccess: closeForm });
        }
    };

    const destroy = (id) => {
        if (confirm('Delete this subscription?')) router.delete(route('system.user-subscriptions.destroy', id));
    };

    return (
        <DashboardLayout title="User Subscriptions">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">User Subscriptions</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage active and past user memberships</p>
                </div>
                <div className="flex gap-3">
                    <Link href={route('system.subscription-plans.index')} className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                        <HiOutlineStar className="w-4 h-4" /> Plans
                    </Link>
                    <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-md shadow-primary-500/20 transition-all">
                        <HiOutlinePlus className="w-5 h-5" /> Assign
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">{editing ? 'Edit' : 'Assign'} Subscription</h3>
                            <button onClick={closeForm}><HiOutlineX className="w-5 h-5 text-slate-400 hover:text-slate-700 dark:hover:text-white" /></button>
                        </div>
                        <form onSubmit={submit} className="space-y-4">
                            {!editing && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">User ID</label>
                                    <input type="number" value={data.user_id} onChange={e => setData('user_id', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="User ID" />
                                    {errors.user_id && <p className="text-red-500 text-xs mt-1">{errors.user_id}</p>}
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Plan</label>
                                    <select value={data.plan_id} onChange={e => setData('plan_id', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm">
                                        <option value="">Select plan...</option>
                                        {plans?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                    {errors.plan_id && <p className="text-red-500 text-xs mt-1">{errors.plan_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Status</label>
                                    <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm">
                                        <option value="active">Active</option>
                                        <option value="pending">Pending</option>
                                        <option value="expired">Expired</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Amount Paid (RS)</label>
                                <input type="number" step="0.01" value={data.amount_paid} onChange={e => setData('amount_paid', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Start Date</label>
                                    <input type="date" value={data.starts_at} onChange={e => setData('starts_at', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">End Date</label>
                                    <input type="date" value={data.ends_at} onChange={e => setData('ends_at', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" />
                                </div>
                            </div>
                            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <input type="checkbox" checked={data.auto_renew} onChange={e => setData('auto_renew', e.target.checked)} className="rounded" />
                                Auto Renew
                            </label>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={closeForm} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50">
                                    {editing ? 'Update' : 'Assign'}
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
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">User</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Plan</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Amount Paid</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Period</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {subscriptions.data?.length === 0 && (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No user subscriptions.</td></tr>
                        )}
                        {subscriptions.data?.map((s) => (
                            <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <HiOutlineUsers className="w-4 h-4 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white text-xs">{s.user?.name ?? `User #${s.user_id}`}</p>
                                            <p className="text-[10px] text-slate-400">{s.user?.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1">
                                        <HiOutlineStar className="w-3.5 h-3.5 text-amber-500" />
                                        <span className="font-semibold text-slate-900 dark:text-white text-xs">{s.plan?.name ?? `Plan #${s.plan_id}`}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${statusColors[s.status] ?? 'bg-slate-100 text-slate-500'}`}>{s.status}</span>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">RS {Number(s.amount_paid).toLocaleString()}</td>
                                <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                                    {s.starts_at ? new Date(s.starts_at).toLocaleDateString() : '—'} → {s.ends_at ? new Date(s.ends_at).toLocaleDateString() : '—'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                                            <HiOutlinePencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => destroy(s.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                            <HiOutlineTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {subscriptions.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-sm text-slate-500 dark:text-slate-400">{subscriptions.from}–{subscriptions.to} of {subscriptions.total}</span>
                        <div className="flex gap-2">
                            {subscriptions.current_page > 1 && <a href={`?page=${subscriptions.current_page - 1}`} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Prev</a>}
                            {subscriptions.current_page < subscriptions.last_page && <a href={`?page=${subscriptions.current_page + 1}`} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Next</a>}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
