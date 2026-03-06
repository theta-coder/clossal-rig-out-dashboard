import DashboardLayout from '../../../Components/DashboardLayout';
import { HiOutlineMail, HiOutlineCheckCircle, HiOutlineExclamation } from 'react-icons/hi';

export default function Emails({ logs }) {
    return (
        <DashboardLayout title="System Email Logs">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Email History</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monitor all emails sent by the system</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Recipient</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Subject</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Sent At</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {logs.data.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px] uppercase tracking-tighter">{log.recipient_email}</span>
                                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{log.type}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 max-w-[300px] truncate">{log.subject}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1">
                                        <HiOutlineCheckCircle className="w-4 h-4 text-emerald-500" />
                                        <span className="text-[10px] font-bold text-emerald-600 uppercase">Delivered</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right text-slate-400 dark:text-slate-500 text-xs">
                                    {new Date(log.created_at).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
