import DashboardLayout from '../../../Components/DashboardLayout';
import { useForm, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    HiOutlineSpeakerphone, HiOutlinePlus, HiOutlineCalendar,
    HiOutlinePencil, HiOutlineTrash, HiOutlineX, HiOutlineEye,
} from 'react-icons/hi';

const statusColors = {
    draft: 'bg-slate-100 dark:bg-slate-800 text-slate-500',
    active: 'bg-emerald-500/10 text-emerald-600',
    paused: 'bg-amber-500/10 text-amber-600',
    completed: 'bg-blue-500/10 text-blue-600',
};

export default function Index({ campaigns = [] }) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '', description: '', type: '', status: 'draft',
        start_date: '', end_date: '', budget: '',
    });

    const openEdit = (c) => {
        setEditing(c);
        setData({
            name: c.name, description: c.description ?? '', type: c.type,
            status: c.status ?? 'draft',
            start_date: c.start_date ? c.start_date.slice(0, 10) : '',
            end_date: c.end_date ? c.end_date.slice(0, 10) : '',
            budget: c.budget ?? '',
        });
        setShowForm(true);
    };

    const closeForm = () => { setShowForm(false); setEditing(null); reset(); };

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            put(route('dashboard.campaigns.update', editing.id), { onSuccess: closeForm });
        } else {
            post(route('dashboard.campaigns.store'), { onSuccess: closeForm });
        }
    };

    const destroy = (id) => {
        if (confirm('Delete this campaign?')) router.delete(route('dashboard.campaigns.destroy', id));
    };

    return (
        <DashboardLayout title="Marketing Campaigns">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Campaigns</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage promotions and track their performance</p>
                </div>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all font-semibold shadow-md shadow-primary-500/20">
                    <HiOutlinePlus className="w-5 h-5" />
                    New Campaign
                </button>
            </div>

            {/* Create / Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                {editing ? 'Edit Campaign' : 'New Campaign'}
                            </h3>
                            <button onClick={closeForm}><HiOutlineX className="w-5 h-5 text-slate-400 hover:text-slate-700 dark:hover:text-white" /></button>
                        </div>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Campaign Name</label>
                                <input value={data.name} onChange={e => setData('name', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                    placeholder="Summer Sale 2024" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Description</label>
                                <textarea rows={2} value={data.description} onChange={e => setData('description', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm resize-none"
                                    placeholder="Campaign description..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Type</label>
                                    <input value={data.type} onChange={e => setData('type', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                        placeholder="email, social, sms..." />
                                    {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Status</label>
                                    <select value={data.status} onChange={e => setData('status', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm">
                                        <option value="draft">Draft</option>
                                        <option value="active">Active</option>
                                        <option value="paused">Paused</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Start Date</label>
                                    <input type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" />
                                    {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">End Date</label>
                                    <input type="date" value={data.end_date} onChange={e => setData('end_date', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" />
                                    {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Budget (RS)</label>
                                <input type="number" step="0.01" value={data.budget} onChange={e => setData('budget', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                    placeholder="50000" />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {campaigns.length === 0 && (
                    <div className="col-span-2 py-16 text-center text-slate-400">No campaigns yet.</div>
                )}
                {campaigns.map((campaign) => (
                    <div key={campaign.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-primary-500/10 text-primary-600">
                                    <HiOutlineSpeakerphone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">{campaign.name}</h3>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{campaign.type}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${statusColors[campaign.status] ?? 'bg-slate-100 text-slate-500'}`}>
                                    {campaign.status ?? 'draft'}
                                </span>
                            </div>
                        </div>

                        {campaign.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{campaign.description}</p>
                        )}

                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Clicks</p>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">{campaign.metrics?.clicks ?? 0}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Conv.</p>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">{campaign.metrics?.conversions ?? 0}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Budget</p>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">RS {Number(campaign.budget ?? 0).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <HiOutlineCalendar className="w-4 h-4" />
                                <span>{campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : '—'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Link href={route('dashboard.campaigns.show', campaign.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="View">
                                    <HiOutlineEye className="w-4 h-4" />
                                </Link>
                                <button onClick={() => openEdit(campaign)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                                    <HiOutlinePencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => destroy(campaign.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                    <HiOutlineTrash className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}
