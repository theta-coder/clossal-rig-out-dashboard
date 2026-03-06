import DashboardLayout from '../../Components/DashboardLayout';
import { Link } from '@inertiajs/react';
import { HiOutlineArrowLeft, HiOutlineTrendingUp } from 'react-icons/hi';

export default function Conversions({ conversions = { data: [], total: 0, current_page: 1, last_page: 1, from: null, to: null } }) {
    return (
        <DashboardLayout title="Affiliate Conversions">
            <div className="mb-6">
                <Link href={route('dashboard.affiliates.index')} className="inline-flex items-center gap-1.5 text-sm text-primary-500 hover:text-primary-600 font-medium">
                    <HiOutlineArrowLeft className="w-4 h-4" /> Back to Affiliates
                </Link>
            </div>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Affiliate Conversions</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">All sales conversions tracked via affiliate links</p>
                </div>
                <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{conversions.total.toLocaleString()} total conversions</span>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">ID</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Affiliate</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Order</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Commission</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {conversions.data.length === 0 && (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No conversions recorded.</td></tr>
                        )}
                        {conversions.data.map((conv) => (
                            <tr key={conv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 text-slate-400 font-mono text-xs">#{conv.id}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600">
                                            <HiOutlineTrendingUp className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white text-xs">
                                                {conv.affiliate?.user?.name ?? `Affiliate #${conv.affiliate_id}`}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-mono uppercase">
                                                {conv.affiliate?.affiliate_code}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                                    {conv.order_id ? `#${conv.order_id}` : '—'}
                                </td>
                                <td className="px-6 py-4 font-bold text-emerald-600 text-xs">
                                    RS {Number(conv.commission_amount ?? 0).toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                                        conv.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600'
                                        : conv.status === 'pending' ? 'bg-amber-500/10 text-amber-600'
                                        : 'bg-red-500/10 text-red-600'
                                    }`}>
                                        {conv.status ?? 'pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-slate-500 dark:text-slate-400 text-xs">
                                    {conv.created_at ? new Date(conv.created_at).toLocaleString() : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {conversions.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-sm text-slate-500 dark:text-slate-400">{conversions.from}–{conversions.to} of {conversions.total}</span>
                        <div className="flex gap-2">
                            {conversions.current_page > 1 && <a href={`?page=${conversions.current_page - 1}`} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Prev</a>}
                            {conversions.current_page < conversions.last_page && <a href={`?page=${conversions.current_page + 1}`} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Next</a>}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
