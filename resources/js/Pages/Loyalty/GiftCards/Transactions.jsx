import DashboardLayout from '../../../Components/DashboardLayout';
import { HiOutlineCreditCard, HiOutlineArrowUp, HiOutlineArrowDown } from 'react-icons/hi';

export default function Transactions({ transactions }) {
    return (
        <DashboardLayout title="Gift Card Transactions">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Gift Card Transactions</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">All credit and debit transactions on gift cards</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">ID</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Gift Card</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Order</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Type</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Amount</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {transactions.data?.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 dark:text-slate-600">No transactions found.</td>
                            </tr>
                        )}
                        {transactions.data?.map((tx) => (
                            <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs">#{tx.id}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600">
                                            <HiOutlineCreditCard className="w-4 h-4" />
                                        </div>
                                        <span className="font-semibold text-slate-900 dark:text-white uppercase tracking-widest text-xs">
                                            {tx.gift_card?.code ?? `Card #${tx.gift_card_id}`}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                    {tx.order ? `#${tx.order.order_number}` : '—'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                                        tx.type === 'credit'
                                            ? 'bg-emerald-500/10 text-emerald-600'
                                            : 'bg-red-500/10 text-red-600'
                                    }`}>
                                        {tx.type === 'credit'
                                            ? <HiOutlineArrowUp className="w-3 h-3" />
                                            : <HiOutlineArrowDown className="w-3 h-3" />
                                        }
                                        {tx.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                                    RS {Number(tx.amount).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-right text-slate-500 dark:text-slate-400 text-xs">
                                    {tx.created_at ? new Date(tx.created_at).toLocaleDateString() : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                {transactions.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            {transactions.from}–{transactions.to} of {transactions.total}
                        </span>
                        <div className="flex gap-2">
                            {transactions.current_page > 1 && (
                                <a href={`?page=${transactions.current_page - 1}`} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Prev</a>
                            )}
                            {transactions.current_page < transactions.last_page && (
                                <a href={`?page=${transactions.current_page + 1}`} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Next</a>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
