import DashboardLayout from '../../../Components/DashboardLayout';
import { HiOutlineGift, HiOutlineCreditCard, HiOutlineUsers, HiOutlineSwitchHorizontal } from 'react-icons/hi';

export default function Index({ points }) {
    return (
        <DashboardLayout title="Loyalty Points">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Customer Loyalty</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage reward points and customer tiers</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Customer</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Points Balance</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Tier</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Last Updated</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {points.data.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-primary-500/10 text-primary-600 flex items-center justify-center font-bold">
                                            {p.user?.name?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white uppercase">{p.user?.name || 'User'}</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500">{p.user?.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                    {p.points} <span className="text-xs font-normal text-slate-400">pts</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 font-bold text-[10px] uppercase tracking-wider">Gold Tier</span>
                                </td>
                                <td className="px-6 py-4 text-right text-slate-400 dark:text-slate-500 text-xs">
                                    {new Date(p.updated_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
