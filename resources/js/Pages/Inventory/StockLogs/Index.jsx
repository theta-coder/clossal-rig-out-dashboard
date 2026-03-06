import DashboardLayout from '../../../Components/DashboardLayout';
import { HiOutlineCube, HiOutlinePlus, HiOutlineTrendingUp, HiOutlineRefresh } from 'react-icons/hi';
import { Link } from '@inertiajs/react';

export default function Index({ logs = { data: [], current_page: 1, last_page: 1, total: 0, from: null, to: null } }) {
    return (
        <DashboardLayout title="Inventory Stock Logs">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Detailed Stock History</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track every movement of your products</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Product</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Change</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Reason</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {logs.data.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 dark:text-slate-600">
                                    No stock log entries found.
                                </td>
                            </tr>
                        )}
                        {logs.data.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
                                            <HiOutlineCube className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">{log.product?.name || 'Unknown'}</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 tracking-wider truncate max-w-[200px]">{log.variant?.sku || 'N/A'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-600 dark:text-slate-400 uppercase">
                                    <span className={log.quantity_change > 0 ? 'text-emerald-600' : 'text-red-500'}>
                                        {log.quantity_change > 0 ? '+' : ''}{log.quantity_change}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-400 dark:text-slate-500 uppercase text-xs">{log.reason ?? '—'}</td>
                                <td className="px-6 py-4 text-right text-slate-400 dark:text-slate-500 text-xs">
                                    {log.created_at ? new Date(log.created_at).toLocaleString() : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                {logs.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            {logs.from ?? 0}–{logs.to ?? 0} of {logs.total}
                        </span>
                        <div className="flex gap-2">
                            {logs.current_page > 1 && (
                                <a href={`?page=${logs.current_page - 1}`} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
                                    Prev
                                </a>
                            )}
                            {logs.current_page < logs.last_page && (
                                <a href={`?page=${logs.current_page + 1}`} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
                                    Next
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
