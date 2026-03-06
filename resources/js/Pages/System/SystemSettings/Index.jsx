import DashboardLayout from '../../../Components/DashboardLayout';
import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { HiOutlineCog, HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineX, HiOutlineSave } from 'react-icons/hi';

const typeColors = { string: 'bg-slate-100 dark:bg-slate-800 text-slate-500', integer: 'bg-blue-500/10 text-blue-600', boolean: 'bg-emerald-500/10 text-emerald-600', json: 'bg-violet-500/10 text-violet-600' };

export default function Index({ settings }) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        key: '', value: '', description: '', type: 'string',
    });

    const openEdit = (s) => {
        setEditing(s);
        setData({ key: s.key, value: s.value ?? '', description: s.description ?? '', type: s.type });
        setShowForm(true);
    };

    const closeForm = () => { setShowForm(false); setEditing(null); reset(); };

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            put(route('system.system-settings.update', editing.id), { onSuccess: closeForm });
        } else {
            post(route('system.system-settings.store'), { onSuccess: closeForm });
        }
    };

    const destroy = (id) => {
        if (confirm('Delete this system setting?')) router.delete(route('system.system-settings.destroy', id));
    };

    return (
        <DashboardLayout title="System Settings">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">System Settings</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Low-level system configuration key-value pairs</p>
                </div>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-md shadow-primary-500/20 transition-all">
                    <HiOutlinePlus className="w-5 h-5" /> Add Setting
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">{editing ? 'Edit' : 'Add'} Setting</h3>
                            <button onClick={closeForm}><HiOutlineX className="w-5 h-5 text-slate-400 hover:text-slate-700 dark:hover:text-white" /></button>
                        </div>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Key</label>
                                    <input value={data.key} onChange={e => setData('key', e.target.value)} disabled={!!editing} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm disabled:opacity-50 font-mono" placeholder="app.maintenance_mode" />
                                    {errors.key && <p className="text-red-500 text-xs mt-1">{errors.key}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Type</label>
                                    <select value={data.type} onChange={e => setData('type', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm">
                                        <option value="string">String</option>
                                        <option value="integer">Integer</option>
                                        <option value="boolean">Boolean</option>
                                        <option value="json">JSON</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Value</label>
                                {data.type === 'json' ? (
                                    <textarea rows={4} value={data.value} onChange={e => setData('value', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm resize-none font-mono" placeholder='{"key": "value"}' />
                                ) : (
                                    <input value={data.value} onChange={e => setData('value', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="Setting value" />
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Description</label>
                                <input value={data.description} onChange={e => setData('description', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="What does this setting do?" />
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
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Key</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Value</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Type</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Description</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {settings.data?.length === 0 && (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No system settings configured.</td></tr>
                        )}
                        {settings.data?.map((s) => (
                            <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500"><HiOutlineCog className="w-4 h-4" /></div>
                                        <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">{s.key}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-400 max-w-[200px] truncate">{s.value ?? '—'}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${typeColors[s.type] ?? 'bg-slate-100 text-slate-500'}`}>{s.type}</span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs max-w-[200px] truncate">{s.description ?? '—'}</td>
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
            </div>
        </DashboardLayout>
    );
}
