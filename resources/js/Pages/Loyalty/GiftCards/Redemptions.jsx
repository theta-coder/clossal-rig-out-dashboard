import DashboardLayout from '../../../Components/DashboardLayout';
import { HiOutlineTicket } from 'react-icons/hi';

export default function Redemptions({ redemptions }) {
    return (
        <DashboardLayout title="Gift Card Redemptions">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Gift Card Redemptions</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">History of gift cards redeemed against orders</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">ID</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Gift Card</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Order</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Amount Used</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Redeemed At</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {redemptions.data?.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 dark:text-slate-600">No redemptions found.</td>
                            </tr>
                        )}
                        {redemptions.data?.map((r) => (
                            <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs">#{r.id}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-violet-500/10 text-violet-600">
                                            <HiOutlineTicket className="w-4 h-4" />
                                        </div>
                                        <span className="font-semibold text-slate-900 dark:text-white uppercase tracking-widest text-xs">
                                            {r.gift_card?.code ?? `Card #${r.gift_card_id}`}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                    {r.order ? `#${r.order.order_number}` : '—'}
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                                    RS {Number(r.amount_used).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-right text-slate-500 dark:text-slate-400 text-xs">
                                    {r.redeemed_at ? new Date(r.redeemed_at).toLocaleString() : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {redemptions.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            {redemptions.from}–{redemptions.to} of {redemptions.total}
                        </span>
                        <div className="flex gap-2">
                            {redemptions.current_page > 1 && (
                                <a href={`?page=${redemptions.current_page - 1}`} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Prev</a>
                            )}
                            {redemptions.current_page < redemptions.last_page && (
                                <a href={`?page=${redemptions.current_page + 1}`} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Next</a>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
