import DashboardLayout from '../../../Components/DashboardLayout';
import { HiOutlineCash, HiOutlinePlus, HiOutlineTrendingUp, HiOutlineRefresh } from 'react-icons/hi';
import { Link } from '@inertiajs/react';

export default function Index({ wallets }) {
    return (
        <DashboardLayout title="Customer Wallets">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Store Wallets</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage customer account balances and store credit</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Customer</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Balance</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Currency</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {wallets.data.map((w) => (
                            <tr key={w.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                                            <HiOutlineCash className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">{w.user?.name || 'Customer'}</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 tracking-wider truncate max-w-[200px]">{w.user?.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">{Number(w.balance).toLocaleString()}</span>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-400 dark:text-slate-500 uppercase">{w.currency}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-xs font-bold text-primary-600 hover:text-primary-700 tracking-widest uppercase">Manage Credit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
