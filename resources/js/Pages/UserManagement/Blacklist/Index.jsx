import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import DashboardLayout from '../../../Components/DashboardLayout';
import DataTable from '../../../Components/DataTable';
import { HiOutlineTrash, HiOutlinePlus, HiOutlinePencil, HiOutlineBan, HiOutlineCheck } from 'react-icons/hi';

function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 w-full max-w-md shadow-2xl mx-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
                {children}
            </div>
        </div>
    );
}

export default function BlacklistIndex() {
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState({ type: 'email', value: '', reason: '', is_active: true, expires_at: '' });
    const [processing, setProcessing] = useState(false);

    const columns = [
        { data: 'id', title: 'ID' },
        {
            data: 'type', title: 'Type', render: (val) => {
                const colors = { email: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400', phone: 'bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400', ip: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400', user: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' };
                return <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colors[val] || 'bg-gray-100 text-gray-700'}`}>{val}</span>;
            }
        },
        {
            data: 'value', title: 'Value', render: (val) => (
                <span className="font-mono text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{val}</span>
            )
        },
        { data: 'reason', title: 'Reason', render: (val) => <span className="text-gray-600 dark:text-gray-400 text-sm">{val || '—'}</span> },
        { data: 'blacklisted_by', title: 'Blocked By' },
        {
            data: 'is_active', title: 'Status', render: (val) => (
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${val ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                    {val ? 'Active' : 'Inactive'}
                </span>
            )
        },
        { data: 'expires_at', title: 'Expires' },
        { data: 'created_at', title: 'Created' },
    ];

    const openCreate = () => {
        setEditItem(null);
        setForm({ type: 'email', value: '', reason: '', is_active: true, expires_at: '' });
        setShowModal(true);
    };

    const openEdit = (row) => {
        setEditItem(row);
        setForm({ type: row.type, value: row.value, reason: row.reason || '', is_active: row.is_active, expires_at: row.expires_at || '' });
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        if (editItem) {
            router.put(route('blacklist.update', editItem.id), form, {
                onFinish: () => { setProcessing(false); setShowModal(false); },
            });
        } else {
            router.post(route('blacklist.store'), form, {
                onFinish: () => { setProcessing(false); setShowModal(false); },
            });
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Remove Entry?', text: "This item will be removed from the blacklist.", icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Yes, remove!'
        }).then((result) => {
            if (result.isConfirmed) router.delete(route('blacklist.destroy', id));
        });
    };

    const handleToggleActive = (id, isActive) => {
        Swal.fire({
            title: isActive ? 'Deactivate Entry?' : 'Activate Entry?',
            text: isActive ? 'This entry will be deactivated.' : 'This entry will be activated.',
            icon: 'question', showCancelButton: true,
            confirmButtonColor: isActive ? '#6b7280' : '#d33',
            confirmButtonText: isActive ? 'Deactivate' : 'Activate'
        }).then((result) => {
            if (result.isConfirmed) router.post(route('blacklist.toggle-active', id));
        });
    };

    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all";

    return (
        <DashboardLayout title="Blacklist">
            <Head title="Blacklist" />
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blacklist</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage blocked emails, phones, IPs and users.</p>
                </div>
                <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-red-500/25 transition-all">
                    <HiOutlinePlus className="w-4 h-4" /> Add to Blacklist
                </button>
            </div>

            <DataTable url="/blacklist" columns={columns} actions={(row) => (
                <div className="flex gap-1 justify-end">
                    <button onClick={() => handleToggleActive(row.id, row.is_active)}
                        className={`p-2 rounded-lg transition-colors ${row.is_active ? 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10' : 'text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10'}`}
                        title={row.is_active ? 'Deactivate' : 'Activate'}>
                        {row.is_active ? <HiOutlineCheck className="w-5 h-5" /> : <HiOutlineBan className="w-5 h-5" />}
                    </button>
                    <button onClick={() => openEdit(row)} className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors" title="Edit">
                        <HiOutlinePencil className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(row.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Delete">
                        <HiOutlineTrash className="w-5 h-5" />
                    </button>
                </div>
            )} />

            {/* Create/Edit Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Blacklist Entry' : 'Add to Blacklist'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Type *</label>
                        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={inputClass} disabled={!!editItem}>
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                            <option value="ip">IP Address</option>
                            <option value="user">User ID</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Value *</label>
                        <input type="text" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })}
                            placeholder={form.type === 'email' ? 'user@example.com' : form.type === 'phone' ? '+92 300 1234567' : form.type === 'ip' ? '192.168.1.1' : 'User ID'}
                            className={inputClass + ' placeholder-gray-400 font-mono'} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Reason</label>
                        <textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} rows={2} placeholder="Optional reason for blacklisting" className={inputClass + ' placeholder-gray-400 resize-none'} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Expires At</label>
                        <input type="datetime-local" value={form.expires_at} onChange={e => setForm({ ...form, expires_at: e.target.value })} className={inputClass} />
                        <p className="text-xs text-gray-400 mt-1">Leave empty for permanent block</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="bl_is_active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500" />
                        <label htmlFor="bl_is_active" className="text-sm text-gray-700 dark:text-gray-300">Active</label>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-red-500/25 disabled:opacity-50">
                            {processing ? 'Saving...' : editItem ? 'Update Entry' : 'Add to Blacklist'}
                        </button>
                        <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                    </div>
                </form>
            </Modal>
        </DashboardLayout>
    );
}
