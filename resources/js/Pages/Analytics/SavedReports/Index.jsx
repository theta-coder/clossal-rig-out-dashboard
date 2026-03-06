import DashboardLayout from '../../../Components/DashboardLayout';
import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { HiOutlineDocumentReport, HiOutlineClock, HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineX } from 'react-icons/hi';

const formatColors = { csv: 'bg-emerald-500/10 text-emerald-600', pdf: 'bg-red-500/10 text-red-600', excel: 'bg-blue-500/10 text-blue-600' };
const freqColors = { daily: 'bg-amber-500/10 text-amber-600', weekly: 'bg-violet-500/10 text-violet-600', monthly: 'bg-cyan-500/10 text-cyan-600' };

export default function Index({ reports }) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '', type: '', format: 'csv',
        is_scheduled: false, schedule_frequency: '', schedule_email: '',
    });

    const openEdit = (r) => {
        setEditing(r);
        setData({ name: r.name, type: r.type, format: r.format, is_scheduled: !!r.is_scheduled, schedule_frequency: r.schedule_frequency ?? '', schedule_email: r.schedule_email ?? '' });
        setShowForm(true);
    };

    const closeForm = () => { setShowForm(false); setEditing(null); reset(); };

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            put(route('analytics.saved-reports.update', editing.id), { onSuccess: closeForm });
        } else {
            post(route('analytics.saved-reports.store'), { onSuccess: closeForm });
        }
    };

    const destroy = (id) => {
        if (confirm('Delete this saved report?')) router.delete(route('analytics.saved-reports.destroy', id));
    };

    return (
        <DashboardLayout title="Saved Reports">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Saved Reports</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and schedule custom analytics reports</p>
                </div>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-md shadow-primary-500/20 transition-all">
                    <HiOutlinePlus className="w-5 h-5" /> New Report
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">{editing ? 'Edit' : 'New'} Saved Report</h3>
                            <button onClick={closeForm}><HiOutlineX className="w-5 h-5 text-slate-400 hover:text-slate-700 dark:hover:text-white" /></button>
                        </div>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Report Name</label>
                                <input value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="Monthly Sales Report" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Type</label>
                                    <input value={data.type} onChange={e => setData('type', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="sales, inventory..." />
                                    {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Format</label>
                                    <select value={data.format} onChange={e => setData('format', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm">
                                        <option value="csv">CSV</option>
                                        <option value="pdf">PDF</option>
                                        <option value="excel">Excel</option>
                                    </select>
                                </div>
                            </div>
                            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <input type="checkbox" checked={data.is_scheduled} onChange={e => setData('is_scheduled', e.target.checked)} className="rounded" />
                                Schedule this report
                            </label>
                            {data.is_scheduled && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Frequency</label>
                                        <select value={data.schedule_frequency} onChange={e => setData('schedule_frequency', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm">
                                            <option value="">Select...</option>
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Email</label>
                                        <input type="email" value={data.schedule_email} onChange={e => setData('schedule_email', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="admin@example.com" />
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={closeForm} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50">
                                    {editing ? 'Update' : 'Save Report'}
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
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Report</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Type</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Format</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Schedule</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Last Run</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {reports.data?.length === 0 && (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No saved reports.</td></tr>
                        )}
                        {reports.data?.map((r) => (
                            <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600"><HiOutlineDocumentReport className="w-4 h-4" /></div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white">{r.name}</p>
                                            <p className="text-xs text-slate-400">{r.admin?.name ?? 'Admin'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 capitalize">{r.type}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${formatColors[r.format] ?? 'bg-slate-100 text-slate-500'}`}>{r.format}</span>
                                </td>
                                <td className="px-6 py-4">
                                    {r.is_scheduled ? (
                                        <div className="flex items-center gap-1">
                                            <HiOutlineClock className="w-3.5 h-3.5 text-amber-500" />
                                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${freqColors[r.schedule_frequency] ?? 'bg-slate-100 text-slate-500'}`}>{r.schedule_frequency}</span>
                                        </div>
                                    ) : <span className="text-slate-400 text-xs">Manual</span>}
                                </td>
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                                    {r.last_run_at ? new Date(r.last_run_at).toLocaleDateString() : '—'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                                            <HiOutlinePencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => destroy(r.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
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
