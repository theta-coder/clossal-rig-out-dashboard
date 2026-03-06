import DashboardLayout from '../../../Components/DashboardLayout';
import { Link, router } from '@inertiajs/react';
import { HiOutlineArrowLeft, HiOutlineSpeakerphone, HiOutlineCalendar, HiOutlineCurrencyDollar, HiOutlineTrendingUp, HiOutlineCursorClick } from 'react-icons/hi';

const statusColors = {
    draft: 'bg-slate-100 dark:bg-slate-800 text-slate-500',
    active: 'bg-emerald-500/10 text-emerald-600',
    paused: 'bg-amber-500/10 text-amber-600',
    completed: 'bg-blue-500/10 text-blue-600',
};

export default function Show({ campaign, metrics = null }) {
    return (
        <DashboardLayout title={campaign.name}>
            <div className="mb-6">
                <Link href={route('dashboard.campaigns.index')} className="inline-flex items-center gap-1.5 text-sm text-primary-500 hover:text-primary-600 font-medium">
                    <HiOutlineArrowLeft className="w-4 h-4" /> Back to Campaigns
                </Link>
            </div>

            {/* Header */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-primary-500/10 text-primary-600">
                            <HiOutlineSpeakerphone className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{campaign.name}</h2>
                            <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mt-0.5">{campaign.type}</p>
                            {campaign.description && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl">{campaign.description}</p>
                            )}
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${statusColors[campaign.status] ?? 'bg-slate-100 text-slate-500'}`}>
                        {campaign.status ?? 'draft'}
                    </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div>
                        <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Budget</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">RS {Number(campaign.budget ?? 0).toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Start Date</p>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : '—'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-semibold uppercase mb-1">End Date</p>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : '—'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Created</p>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {campaign.created_at ? new Date(campaign.created_at).toLocaleDateString() : '—'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-600">
                            <HiOutlineCursorClick className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Clicks</p>
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{(metrics?.clicks ?? 0).toLocaleString()}</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                            <HiOutlineTrendingUp className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conversions</p>
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{(metrics?.conversions ?? 0).toLocaleString()}</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
                            <HiOutlineCurrencyDollar className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Revenue</p>
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">RS {Number(metrics?.revenue ?? 0).toLocaleString()}</p>
                </div>
            </div>

            {/* Additional metrics detail */}
            {metrics && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Performance Details</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Impressions</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">{Number(metrics.impressions ?? 0).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-semibold mb-1">CTR</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                                {metrics.impressions > 0 ? ((metrics.clicks / metrics.impressions) * 100).toFixed(2) : '0.00'}%
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Conv. Rate</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                                {metrics.clicks > 0 ? ((metrics.conversions / metrics.clicks) * 100).toFixed(2) : '0.00'}%
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Cost per Conv.</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                                RS {metrics.conversions > 0 ? Number(campaign.budget / metrics.conversions).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '—'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
