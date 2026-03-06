import DashboardLayout from '../../../Components/DashboardLayout';
import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { HiOutlineChatAlt, HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineX } from 'react-icons/hi';

export default function Index({ templates }) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '', slug: '', message: '',
        variables: '', is_active: true, category: '', character_count: '',
    });

    const openEdit = (t) => {
        setEditing(t);
        setData({ name: t.name, slug: t.slug, message: t.message, variables: Array.isArray(t.variables) ? t.variables.join(', ') : '', is_active: !!t.is_active, category: t.category ?? '', character_count: t.character_count ?? '' });
        setShowForm(true);
    };

    const closeForm = () => { setShowForm(false); setEditing(null); reset(); };

    const submit = (e) => {
        e.preventDefault();
        const payload = { ...data, variables: data.variables ? data.variables.split(',').map(v => v.trim()).filter(Boolean) : [] };
        if (editing) {
            put(route('system.sms-templates.update', editing.id), { data: payload, onSuccess: closeForm });
        } else {
            post(route('system.sms-templates.store'), { data: payload, onSuccess: closeForm });
        }
    };

    const destroy = (id) => {
        if (confirm('Delete this SMS template?')) router.delete(route('system.sms-templates.destroy', id));
    };

    const categoryColors = { otp: 'bg-blue-500/10 text-blue-600', order: 'bg-emerald-500/10 text-emerald-600', marketing: 'bg-violet-500/10 text-violet-600', shipping: 'bg-amber-500/10 text-amber-600' };

    return (
        <DashboardLayout title="SMS Templates">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">SMS Templates</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage templates for automated SMS messages</p>
                </div>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-md shadow-primary-500/20 transition-all">
                    <HiOutlinePlus className="w-5 h-5" /> Add Template
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">{editing ? 'Edit' : 'Add'} SMS Template</h3>
                            <button onClick={closeForm}><HiOutlineX className="w-5 h-5 text-slate-400 hover:text-slate-700 dark:hover:text-white" /></button>
                        </div>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Name</label>
                                    <input value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="OTP Verification" />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Slug</label>
                                    <input value={data.slug} onChange={e => setData('slug', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="otp_verification" />
                                    {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Message</label>
                                <textarea rows={4} value={data.message} onChange={e => setData('message', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm resize-none" placeholder="Your OTP is {{otp}}. Valid for 5 minutes." />
                                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                                <p className="text-xs text-slate-400 mt-1">{data.message.length} characters</p>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Variables (comma separated)</label>
                                <input value={data.variables} onChange={e => setData('variables', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="otp, name, order_number" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Category</label>
                                <select value={data.category} onChange={e => setData('category', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm">
                                    <option value="">Select...</option>
                                    <option value="otp">OTP</option>
                                    <option value="order">Order</option>
                                    <option value="shipping">Shipping</option>
                                    <option value="marketing">Marketing</option>
                                </select>
                            </div>
                            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="rounded" />
                                Active
                            </label>
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
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Template</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Slug</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Category</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Chars</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {templates.data?.length === 0 && (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No SMS templates yet.</td></tr>
                        )}
                        {templates.data?.map((t) => (
                            <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600"><HiOutlineChatAlt className="w-4 h-4" /></div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white">{t.name}</p>
                                            <p className="text-xs text-slate-400 truncate max-w-[200px]">{t.message}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{t.slug}</td>
                                <td className="px-6 py-4">
                                    {t.category && <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${categoryColors[t.category] ?? 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{t.category}</span>}
                                </td>
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{t.character_count ?? t.message?.length ?? 0}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${t.is_active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                                        {t.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                                            <HiOutlinePencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => destroy(t.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
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
