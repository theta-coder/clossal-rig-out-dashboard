import DashboardLayout from '../../../Components/DashboardLayout';
import { HiOutlineDocumentSearch, HiOutlineClock, HiOutlineUser, HiOutlineTag } from 'react-icons/hi';

export default function Audit({ logs }) {
    return (
        <DashboardLayout title="Admin Audit Logs">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Audit Trail</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track administrative actions and system changes</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Admin</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Action</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Module</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {logs.data.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <HiOutlineUser className="w-4 h-4 text-slate-500" />
                                        </div>
                                        <span className="font-medium text-slate-900 dark:text-white">{log.user?.name || 'System'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-slate-600 dark:text-slate-400 font-medium">{log.action}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 capitalize text-xs text-slate-500 dark:text-slate-400">
                                        <HiOutlineTag className="w-3.5 h-3.5 text-primary-500" />
                                        {log.module}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex flex-col items-end">
                                        <span className="text-slate-900 dark:text-white font-medium">{new Date(log.created_at).toLocaleDateString()}</span>
                                        <span className="text-[10px] text-slate-400 uppercase tracking-tighter">{new Date(log.created_at).toLocaleTimeString()}</span>
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
