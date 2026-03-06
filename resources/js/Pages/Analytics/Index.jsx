import DashboardLayout from '../../Components/DashboardLayout';
import { HiOutlineTrendingUp, HiOutlineTrendingDown, HiOutlineViewGrid, HiOutlineUsers, HiOutlineShoppingBag, HiOutlineFire } from 'react-icons/hi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    </div>
);

export default function Index({ dailySales, monthlySales, topProducts, topCustomers }) {
    return (
        <DashboardLayout title="Analytics Overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Revenue" value="PKR 2.4M" icon={HiOutlineTrendingUp} color="emerald" />
                <StatCard title="Active Users" value="1.2k" icon={HiOutlineUsers} color="blue" />
                <StatCard title="Total Sales" value="842" icon={HiOutlineShoppingBag} color="violet" />
                <StatCard title="Conversion Rate" value="3.2%" icon={HiOutlineFire} color="orange" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Daily Sales Trend</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dailySales}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="total_revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Top Selling Products</h3>
                    <div className="space-y-4">
                        {topProducts.map((tp, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-xs">{i + 1}</div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{tp.product?.name || 'Product'}</span>
                                </div>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">{tp.units_sold} sold</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
