import DashboardLayout from '../../../Components/DashboardLayout';
import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { HiOutlinePlus, HiOutlineLocationMarker, HiOutlinePencil, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';

const statusColors = {
    active: 'bg-emerald-500/10 text-emerald-600',
    inactive: 'bg-slate-500/10 text-slate-600',
    suspended: 'bg-red-500/10 text-red-600',
    on_leave: 'bg-amber-500/10 text-amber-600',
};

export default function Index({ riders = { data: [], current_page: 1, last_page: 1, total: 0 } }) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        user_id: '', vehicle_number: '', vehicle_type: '', cnic: '', city: '', status: 'active',
    });

    const openEdit = (r) => {
        setEditing(r);
        setData({ user_id: r.user_id, vehicle_number: r.vehicle_number ?? '', vehicle_type: r.vehicle_type ?? '', cnic: r.cnic ?? '', city: r.city ?? '', status: r.status });
        setShowForm(true);
    };

    const closeForm = () => { setShowForm(false); setEditing(null); reset(); };

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            put(route('dashboard.riders.update', editing.id), { onSuccess: closeForm });
        } else {
            post(route('dashboard.riders.store'), { onSuccess: closeForm });
        }
    };

    const destroy = (id) => {
        if (confirm('Delete this rider?')) router.delete(route('dashboard.riders.destroy', id));
    };

    return (
        <DashboardLayout title="Rider Management">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Delivery Riders</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage delivery personnel and tracking</p>
                </div>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all font-semibold shadow-md shadow-primary-500/20">
                    <HiOutlinePlus className="w-5 h-5" />
                    Add Rider
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">{editing ? 'Edit Rider' : 'Add Rider'}</h3>
                            <button onClick={closeForm}><HiOutlineX className="w-5 h-5 text-slate-400 hover:text-slate-700 dark:hover:text-white" /></button>
                        </div>
                        <form onSubmit={submit} className="space-y-4">
                            {!editing && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">User ID</label>
                                    <input type="number" value={data.user_id} onChange={e => setData('user_id', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                        placeholder="User ID" />
                                    {errors.user_id && <p className="text-red-500 text-xs mt-1">{errors.user_id}</p>}
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Vehicle Number</label>
                                    <input value={data.vehicle_number} onChange={e => setData('vehicle_number', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                        placeholder="ABC-123" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Vehicle Type</label>
                                    <input value={data.vehicle_type} onChange={e => setData('vehicle_type', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                        placeholder="bike, car..." />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">CNIC</label>
                                    <input value={data.cnic} onChange={e => setData('cnic', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                        placeholder="42201-XXXXXXX-X" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">City</label>
                                    <input value={data.city} onChange={e => setData('city', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                                        placeholder="Karachi" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Status</label>
                                <select value={data.status} onChange={e => setData('status', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="suspended">Suspended</option>
                                    <option value="on_leave">On Leave</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={closeForm} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50">
                                    {editing ? 'Update' : 'Add Rider'}
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
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Rider</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Vehicle</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">City</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Orders</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {riders.data.length === 0 && (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No riders added yet.</td></tr>
                        )}
                        {riders.data.map((rider) => (
                            <tr key={rider.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-sm">
                                            {(rider.user?.name ?? 'R').charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white uppercase">{rider.user?.name ?? `Rider #${rider.id}`}</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500">{rider.user?.phone ?? rider.cnic ?? '—'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-slate-600 dark:text-slate-400 font-medium uppercase">{rider.vehicle_number ?? '—'}</p>
                                    <p className="text-xs text-slate-400">{rider.vehicle_type ?? ''}</p>
                                </td>
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">{rider.city ?? '—'}</td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{rider.orders_count ?? 0}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${statusColors[rider.status] ?? 'bg-slate-100 text-slate-500'}`}>
                                        {rider.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button onClick={() => openEdit(rider)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                                            <HiOutlinePencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => destroy(rider.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
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
