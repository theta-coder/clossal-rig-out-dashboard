import DashboardLayout from '../../../Components/DashboardLayout';
import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { HiOutlineCash, HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineX } from 'react-icons/hi';

export default function Index({ accounts }) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        bank_name: '', account_title: '', account_number: '',
        iban: '', branch_code: '', branch_name: '',
        type: 'current', is_active: true,
    });

    const openEdit = (acc) => {
        setEditing(acc);
        setData({ bank_name: acc.bank_name, account_title: acc.account_title, account_number: acc.account_number, iban: acc.iban ?? '', branch_code: acc.branch_code ?? '', branch_name: acc.branch_name ?? '', type: acc.type, is_active: !!acc.is_active });
        setShowForm(true);
    };

    const closeForm = () => { setShowForm(false); setEditing(null); reset(); };

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            put(route('system.bank-accounts.update', editing.id), { onSuccess: closeForm });
        } else {
            post(route('system.bank-accounts.store'), { onSuccess: closeForm });
        }
    };

    const destroy = (id) => {
        if (confirm('Delete this bank account?')) {
            router.delete(route('system.bank-accounts.destroy', id));
        }
    };

    const typeColors = { current: 'bg-blue-500/10 text-blue-600', savings: 'bg-emerald-500/10 text-emerald-600', business: 'bg-violet-500/10 text-violet-600' };

    return (
        <DashboardLayout title="Store Bank Accounts">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Store Bank Accounts</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage bank accounts used for COD refunds and withdrawals</p>
                </div>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-md shadow-primary-500/20 transition-all">
                    <HiOutlinePlus className="w-5 h-5" /> Add Account
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">{editing ? 'Edit' : 'Add'} Bank Account</h3>
                            <button onClick={closeForm}><HiOutlineX className="w-5 h-5 text-slate-400 hover:text-slate-700 dark:hover:text-white" /></button>
                        </div>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Bank Name</label>
                                    <input value={data.bank_name} onChange={e => setData('bank_name', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="HBL" />
                                    {errors.bank_name && <p className="text-red-500 text-xs mt-1">{errors.bank_name}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Account Type</label>
                                    <select value={data.type} onChange={e => setData('type', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm">
                                        <option value="current">Current</option>
                                        <option value="savings">Savings</option>
                                        <option value="business">Business</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Account Title</label>
                                <input value={data.account_title} onChange={e => setData('account_title', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="Urban Threads Pvt Ltd" />
                                {errors.account_title && <p className="text-red-500 text-xs mt-1">{errors.account_title}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Account Number</label>
                                <input value={data.account_number} onChange={e => setData('account_number', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="0001234567890" />
                                {errors.account_number && <p className="text-red-500 text-xs mt-1">{errors.account_number}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">IBAN</label>
                                    <input value={data.iban} onChange={e => setData('iban', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="PK36SCBL..." />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Branch Code</label>
                                    <input value={data.branch_code} onChange={e => setData('branch_code', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="0148" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Branch Name</label>
                                <input value={data.branch_name} onChange={e => setData('branch_name', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="Gulberg Branch, Lahore" />
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
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Bank</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Account Title</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Account No.</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Type</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {accounts.data?.length === 0 && (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No bank accounts added.</td></tr>
                        )}
                        {accounts.data?.map((acc) => (
                            <tr key={acc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600"><HiOutlineCash className="w-4 h-4" /></div>
                                        <span className="font-semibold text-slate-900 dark:text-white">{acc.bank_name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{acc.account_title}</td>
                                <td className="px-6 py-4 font-mono text-slate-900 dark:text-white text-xs">{acc.account_number}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${typeColors[acc.type] ?? 'bg-slate-100 text-slate-500'}`}>{acc.type}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${acc.is_active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                                        {acc.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => openEdit(acc)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                                            <HiOutlinePencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => destroy(acc.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
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
