import DashboardLayout from '../../Components/DashboardLayout';
import { Link } from '@inertiajs/react';
import { HiOutlineArrowLeft, HiOutlineCursorClick } from 'react-icons/hi';

export default function Clicks({ clicks = { data: [], total: 0, current_page: 1, last_page: 1, from: null, to: null } }) {
    return (
        <DashboardLayout title="Affiliate Clicks">
            <div className="mb-6">
                <Link href={route('dashboard.affiliates.index')} className="inline-flex items-center gap-1.5 text-sm text-primary-500 hover:text-primary-600 font-medium">
                    <HiOutlineArrowLeft className="w-4 h-4" /> Back to Affiliates
                </Link>
            </div>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Affiliate Clicks</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">All traffic clicks tracked via affiliate links</p>
                </div>
                <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{clicks.total.toLocaleString()} total clicks</span>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">ID</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Affiliate</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">IP Address</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Referrer</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {clicks.data.length === 0 && (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No clicks recorded.</td></tr>
                        )}
                        {clicks.data.map((click) => (
                            <tr key={click.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 text-slate-400 font-mono text-xs">#{click.id}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-600">
                                            <HiOutlineCursorClick className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white text-xs">
                                                {click.affiliate?.user?.name ?? `Affiliate #${click.affiliate_id}`}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-mono uppercase">
                                                {click.affiliate?.affiliate_code}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-400">{click.ip_address ?? '—'}</td>
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs max-w-[250px] truncate">{click.referer ?? 'Direct'}</td>
                                <td className="px-6 py-4 text-right text-slate-500 dark:text-slate-400 text-xs">
                                    {click.created_at ? new Date(click.created_at).toLocaleString() : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {clicks.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-sm text-slate-500 dark:text-slate-400">{clicks.from}–{clicks.to} of {clicks.total}</span>
                        <div className="flex gap-2">
                            {clicks.current_page > 1 && <a href={`?page=${clicks.current_page - 1}`} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Prev</a>}
                            {clicks.current_page < clicks.last_page && <a href={`?page=${clicks.current_page + 1}`} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Next</a>}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
