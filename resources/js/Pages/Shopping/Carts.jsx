import DashboardLayout from '../../Components/DashboardLayout';
import { HiOutlineShoppingBag, HiOutlinePlus, HiOutlineTrendingUp, HiOutlineTrash } from 'react-icons/hi';
import { Link } from '@inertiajs/react';

export default function Carts({ carts }) {
    return (
        <DashboardLayout title="Active Shopping Carts">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Carts</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track abandoned and active shopping sessions</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Cart Info</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Items</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Value Estimate</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Last Activity</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {carts.data.map((cart) => (
                            <tr key={cart.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-primary-500/10 text-primary-600 flex items-center justify-center font-bold">
                                            <HiOutlineShoppingBag className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">{cart.user?.name || 'Guest User'}</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 tracking-wider truncate max-w-[200px]">{cart.user?.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400 uppercase">{cart.items?.length || 0} ITEMS</td>
                                <td className="px-6 py-4 font-black text-slate-900 dark:text-white uppercase tracking-tighter">RS 0</td>
                                <td className="px-6 py-4 text-slate-400 dark:text-slate-500 text-xs">
                                    {new Date(cart.updated_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
