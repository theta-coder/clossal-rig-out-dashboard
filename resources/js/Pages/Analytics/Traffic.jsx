import DashboardLayout from '../../Components/DashboardLayout';
import { HiOutlineGlobe, HiOutlineLocationMarker, HiOutlineDesktopComputer, HiOutlineLink } from 'react-icons/hi';

export default function Traffic({ traffic }) {
    return (
        <DashboardLayout title="Traffic Sources">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Visitor Channels</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track where your customers are coming from</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {traffic.map((source) => (
                    <div key={source.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600">
                                {['Facebook', 'Instagram'].includes(source.source) ? <HiOutlineLink className="w-6 h-6" /> : <HiOutlineGlobe className="w-6 h-6" />}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white uppercase text-xs tracking-widest">{source.source}</h3>
                                <p className="text-2xl font-black text-slate-900 dark:text-white">{source.sessions.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                            <span>Bounce Rate</span>
                            <span className="text-slate-900 dark:text-white">{source.bounce_rate}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}
