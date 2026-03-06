import DashboardLayout from '../../../Components/DashboardLayout';
import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { HiOutlinePlus, HiOutlineUsers, HiOutlinePencil, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';

export default function Index({ segments = [] }) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '', description: '', min_spending: '', max_spending: '',
        min_orders: '', max_orders: '', days_since_purchase: '',
    });

    const openEdit = (seg) => {
        setEditing(seg);
        setData({
            name: seg.name ?? '',
            description: seg.description ?? '',
            min_spending: seg.min_spending ?? '',
            max_spending: seg.max_spending ?? '',
            min_orders: seg.min_orders ?? '',
            max_orders: seg.max_orders ?? '',
            days_since_purchase: seg.days_since_purchase ?? '',
        });
        setShowForm(true);
    };

    const closeForm = () => { setShowForm(false); setEditing(null); reset(); };

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            put(route('dashboard.customer-segments.update', editing.id), { onSuccess: closeForm });
        } else {
            post(route('dashboard.customer-segments.store'), { onSuccess: closeForm });
        }
    };

    const destroy = (id) => {
        if (confirm('Delete this segment?')) router.delete(route('dashboard.customer-segments.destroy', id));
    };

    return (
        <DashboardLayout title="Customer Segments">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">User Segments</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Group customers based on behavior and history</p>
                </div>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all font-semibold shadow-md shadow-primary-500/20">
                    <HiOutlinePlus className="w-5 h-5" />
                    New Segment
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">{editing ? 'Edit Segment' : 'New Segment'}</h3>
                            <button onClick={closeForm}><HiOutlineX className="w-5 h-5 text-slate-400 hover:text-slate-700 dark:hover:text-white" /></button>
                        </div>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Segment Name</label>
                                <input value={data.name} onChange={e => setData('name', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                    placeholder="VIP Customers" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Description</label>
                                <textarea rows={2} value={data.description} onChange={e => setData('description', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm resize-none"
                                    placeholder="Customers with high spending..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Min Spending (RS)</label>
                                    <input type="number" min="0" value={data.min_spending} onChange={e => setData('min_spending', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                        placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Max Spending (RS)</label>
                                    <input type="number" min="0" value={data.max_spending} onChange={e => setData('max_spending', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                        placeholder="100000" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Min Orders</label>
                                    <input type="number" min="0" value={data.min_orders} onChange={e => setData('min_orders', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                        placeholder="1" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Max Orders</label>
                                    <input type="number" min="0" value={data.max_orders} onChange={e => setData('max_orders', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                        placeholder="50" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Days Since Last Purchase</label>
                                <input type="number" min="0" value={data.days_since_purchase} onChange={e => setData('days_since_purchase', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                    placeholder="30" />
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {segments.length === 0 && (
                    <div className="col-span-3 py-16 text-center text-slate-400">No segments created yet.</div>
                )}
                {segments.map((segment) => (
                    <div key={segment.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm group hover:border-primary-500/50 transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-all">
                                <HiOutlineUsers className="w-6 h-6" />
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => openEdit(segment)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                                    <HiOutlinePencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => destroy(segment.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                    <HiOutlineTrash className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase mb-2 group-hover:text-primary-600 transition-colors tracking-tight">{segment.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 leading-relaxed italic">"{segment.description || 'Targeting specific customer actions.'}"</p>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 overflow-hidden text-[10px] flex items-center justify-center font-bold">U</div>
                                ))}
                                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-primary-500 text-white flex items-center justify-center text-[10px] font-bold">+{segment.users_count ?? 0}</div>
                            </div>
                            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">{segment.users_count ?? 0} members</span>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}
