import DashboardLayout from '../../Components/DashboardLayout';
import { useForm, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    HiOutlinePlus, HiOutlinePencil, HiOutlineTrash,
    HiOutlineX, HiOutlineCheck, HiOutlineEye,
    HiOutlineCursorClick, HiOutlineTrendingUp,
} from 'react-icons/hi';

const statusColors = {
    active: 'bg-emerald-500/10 text-emerald-600',
    pending: 'bg-amber-500/10 text-amber-600',
    suspended: 'bg-red-500/10 text-red-600',
};

export default function Index({ affiliates = { data: [], total: 0, current_page: 1, last_page: 1, from: null, to: null } }) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        user_id: '', affiliate_code: '', commission_rate: '', website: '', status: 'pending',
    });

    const openEdit = (af) => {
        setEditing(af);
        setData({ user_id: af.user_id, affiliate_code: af.affiliate_code, commission_rate: af.commission_rate, website: af.website ?? '', status: af.status });
        setShowForm(true);
    };

    const closeForm = () => { setShowForm(false); setEditing(null); reset(); };

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            put(route('dashboard.affiliates.update', editing.id), { onSuccess: closeForm });
        } else {
            post(route('dashboard.affiliates.store'), { onSuccess: closeForm });
        }
    };

    const destroy = (id) => {
        if (confirm('Delete this affiliate?')) router.delete(route('dashboard.affiliates.destroy', id));
    };

    const approve = (id) => {
        router.post(route('dashboard.affiliates.approve', id));
    };

    return (
        <DashboardLayout title="Affiliate Management">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Affiliate Partners</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage affiliate relationships and commission tracking</p>
                </div>
                <div className="flex gap-3">
                    <Link href={route('dashboard.affiliates.clicks')} className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                        <HiOutlineCursorClick className="w-4 h-4" /> Clicks
                    </Link>
                    <Link href={route('dashboard.affiliates.conversions')} className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                        <HiOutlineTrendingUp className="w-4 h-4" /> Conversions
                    </Link>
                    <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-md shadow-primary-500/20 transition-all">
                        <HiOutlinePlus className="w-5 h-5" /> New Affiliate
                    </button>
                </div>
            </div>

            {/* Create / Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                {editing ? 'Edit Affiliate' : 'New Affiliate'}
                            </h3>
                            <button onClick={closeForm}><HiOutlineX className="w-5 h-5 text-slate-400 hover:text-slate-700 dark:hover:text-white" /></button>
                        </div>
                        <form onSubmit={submit} className="space-y-4">
                            {!editing && (
                                <>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">User ID</label>
                                        <input type="number" value={data.user_id} onChange={e => setData('user_id', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                            placeholder="User ID" />
                                        {errors.user_id && <p className="text-red-500 text-xs mt-1">{errors.user_id}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Affiliate Code</label>
                                        <input value={data.affiliate_code} onChange={e => setData('affiliate_code', e.target.value.toUpperCase())}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono uppercase"
                                            placeholder="PARTNER2024" />
                                        {errors.affiliate_code && <p className="text-red-500 text-xs mt-1">{errors.affiliate_code}</p>}
                                    </div>
                                </>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Commission Rate (%)</label>
                                    <input type="number" step="0.01" min="0" max="100" value={data.commission_rate} onChange={e => setData('commission_rate', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                        placeholder="10.00" />
                                    {errors.commission_rate && <p className="text-red-500 text-xs mt-1">{errors.commission_rate}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Status</label>
                                    <select value={data.status} onChange={e => setData('status', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm">
                                        <option value="pending">Pending</option>
                                        <option value="active">Active</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Website (optional)</label>
                                <input type="url" value={data.website} onChange={e => setData('website', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                    placeholder="https://partner.com" />
                                {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website}</p>}
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
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Affiliate</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Code</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Clicks</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Conversions</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Commission</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Earnings</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {affiliates.data.length === 0 && (
                            <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-400">No affiliates yet.</td></tr>
                        )}
                        {affiliates.data.map((af) => (
                            <tr key={af.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center font-bold text-sm">
                                            {af.user?.name?.charAt(0) ?? 'A'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">{af.user?.name ?? `User #${af.user_id}`}</p>
                                            <p className="text-xs text-slate-400">{af.user?.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                                    {af.affiliate_code}
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400">{af.clicks_count ?? 0}</td>
                                <td className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400">{af.conversions_count ?? 0}</td>
                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{af.commission_rate}%</td>
                                <td className="px-6 py-4 font-bold text-emerald-600">RS {Number(af.total_earnings ?? 0).toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${statusColors[af.status] ?? 'bg-slate-100 text-slate-500'}`}>
                                        {af.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <Link href={route('dashboard.affiliates.show', af.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="View Details">
                                            <HiOutlineEye className="w-4 h-4" />
                                        </Link>
                                        {af.status === 'pending' && (
                                            <button onClick={() => approve(af.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors" title="Approve">
                                                <HiOutlineCheck className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button onClick={() => openEdit(af)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                                            <HiOutlinePencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => destroy(af.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                            <HiOutlineTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {affiliates.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-sm text-slate-500 dark:text-slate-400">{affiliates.from}–{affiliates.to} of {affiliates.total}</span>
                        <div className="flex gap-2">
                            {affiliates.current_page > 1 && <a href={`?page=${affiliates.current_page - 1}`} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Prev</a>}
                            {affiliates.current_page < affiliates.last_page && <a href={`?page=${affiliates.current_page + 1}`} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Next</a>}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
