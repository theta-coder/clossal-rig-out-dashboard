import DashboardLayout from '../../Components/DashboardLayout';
import { Link, router } from '@inertiajs/react';
import {
    HiOutlineArrowLeft, HiOutlineCheck, HiOutlineCursorClick,
    HiOutlineTrendingUp, HiOutlineGlobe, HiOutlineCash,
} from 'react-icons/hi';

const statusColors = {
    active: 'bg-emerald-500/10 text-emerald-600',
    pending: 'bg-amber-500/10 text-amber-600',
    suspended: 'bg-red-500/10 text-red-600',
};

const conversionStatus = {
    pending: 'bg-amber-500/10 text-amber-600',
    approved: 'bg-emerald-500/10 text-emerald-600',
    rejected: 'bg-red-500/10 text-red-600',
};

export default function Show({ affiliate, clicks = [], conversions = [] }) {
    const approve = () => {
        router.post(route('dashboard.affiliates.approve', affiliate.id));
    };

    return (
        <DashboardLayout title={`Affiliate — ${affiliate.user?.name ?? affiliate.affiliate_code}`}>
            <div className="mb-6">
                <Link href={route('dashboard.affiliates.index')} className="inline-flex items-center gap-1.5 text-sm text-primary-500 hover:text-primary-600 font-medium">
                    <HiOutlineArrowLeft className="w-4 h-4" /> Back to Affiliates
                </Link>
            </div>

            {/* Header card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-6 shadow-sm">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-violet-500/10 text-violet-600 flex items-center justify-center text-2xl font-black">
                            {affiliate.user?.name?.charAt(0) ?? 'A'}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{affiliate.user?.name ?? `User #${affiliate.user_id}`}</h2>
                            <p className="text-sm text-slate-400">{affiliate.user?.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                    {affiliate.affiliate_code}
                                </span>
                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${statusColors[affiliate.status] ?? 'bg-slate-100 text-slate-500'}`}>
                                    {affiliate.status}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {affiliate.status === 'pending' && (
                            <button onClick={approve} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all">
                                <HiOutlineCheck className="w-4 h-4" /> Approve
                            </button>
                        )}
                        {affiliate.website && (
                            <a href={affiliate.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                <HiOutlineGlobe className="w-4 h-4" /> Website
                            </a>
                        )}
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Commission Rate</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{affiliate.commission_rate}%</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Clicks</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{clicks.length}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Conversions</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{conversions.length}</p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Total Earnings</p>
                        <p className="text-2xl font-black text-emerald-600">RS {Number(affiliate.total_earnings ?? 0).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Clicks */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                        <HiOutlineCursorClick className="w-4 h-4 text-blue-500" />
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">Recent Clicks</h3>
                        <span className="ml-auto text-xs text-slate-400">{clicks.length} total</span>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto">
                        {clicks.length === 0 && (
                            <p className="px-6 py-8 text-center text-sm text-slate-400">No clicks recorded yet.</p>
                        )}
                        {clicks.map((click) => (
                            <div key={click.id} className="px-6 py-3 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{click.ip_address ?? '—'}</p>
                                    <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{click.referer ?? 'Direct'}</p>
                                </div>
                                <span className="text-[10px] text-slate-400">
                                    {click.created_at ? new Date(click.created_at).toLocaleDateString() : '—'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Conversions */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                        <HiOutlineTrendingUp className="w-4 h-4 text-emerald-500" />
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">Recent Conversions</h3>
                        <span className="ml-auto text-xs text-slate-400">{conversions.length} total</span>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto">
                        {conversions.length === 0 && (
                            <p className="px-6 py-8 text-center text-sm text-slate-400">No conversions yet.</p>
                        )}
                        {conversions.map((conv) => (
                            <div key={conv.id} className="px-6 py-3 flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Order #{conv.order?.order_number ?? conv.order_id}</p>
                                    <p className="text-[10px] text-slate-400">RS {Number(conv.amount ?? 0).toLocaleString()}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-emerald-600">+RS {Number(conv.commission ?? 0).toLocaleString()}</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${conversionStatus[conv.status] ?? 'bg-slate-100 text-slate-500'}`}>
                                        {conv.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
