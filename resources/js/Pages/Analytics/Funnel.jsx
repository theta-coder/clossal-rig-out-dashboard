import DashboardLayout from '../../Components/DashboardLayout';
import { HiOutlinePresentationChartBar, HiOutlineTrendingUp, HiOutlineRefresh } from 'react-icons/hi';

export default function Funnel({ funnel }) {
    const steps = [
        { label: 'Sessions', value: funnel?.sessions || 0, color: 'bg-primary-500' },
        { label: 'Product Viewed', value: funnel?.product_views || 0, color: 'bg-violet-500' },
        { label: 'Add to Cart', value: funnel?.cart_additions || 0, color: 'bg-sky-500' },
        { label: 'Initiate Checkout', value: funnel?.checkout_starts || 0, color: 'bg-indigo-500' },
        { label: 'Purchase', value: funnel?.conversions || 0, color: 'bg-emerald-500' },
    ];

    const max = Math.max(...steps.map(s => s.value), 1);

    return (
        <DashboardLayout title="Conversion Funnel">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sales Pipeline</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Analyze user drop-off across the shopping journey</p>
                </div>
                <button className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-primary-600 transition-all">
                    <HiOutlineRefresh className="w-5 h-5" />
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-4xl mx-auto">
                <div className="space-y-8">
                    {steps.map((step, i) => (
                        <div key={i} className="relative">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-slate-700 dark:text-slate-300 uppercase text-xs tracking-wider">{step.label}</span>
                                <span className="font-bold text-slate-900 dark:text-white">{step.value.toLocaleString()}</span>
                            </div>
                            <div className="h-10 w-full bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden shadow-inner">
                                <div
                                    className={`h-full ${step.color} transition-all duration-1000 ease-out flex items-center justify-end px-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]`}
                                    style={{ width: `${(step.value / max) * 100}%` }}
                                >
                                    <span className="text-[10px] font-bold text-white/80">
                                        {i > 0 ? `${((step.value / steps[0].value) * 100).toFixed(1)}%` : '100%'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
