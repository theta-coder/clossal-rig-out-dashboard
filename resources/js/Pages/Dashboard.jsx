import DashboardLayout from '../Components/DashboardLayout';
import {
    HiOutlineShoppingBag,
    HiOutlineClipboardList,
    HiOutlineUsers,
    HiOutlineCurrencyDollar,
    HiOutlineClock,
    HiOutlineMail,
    HiOutlineChatAlt2,
    HiOutlineTag,
    HiOutlineTrendingUp,
    HiOutlineTrendingDown,
    HiOutlineArrowRight,
} from 'react-icons/hi';

const StatCard = ({ title, value, icon: Icon, iconBg, trend, trendValue }) => (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-950/50 hover:-translate-y-0.5 transition-all duration-300">
        <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{title}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white truncate">{value}</p>
                {trend && (
                    <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                        {trend === 'up'
                            ? <HiOutlineTrendingUp className="w-3.5 h-3.5" />
                            : <HiOutlineTrendingDown className="w-3.5 h-3.5" />
                        }
                        <span>{trendValue} vs last month</span>
                    </div>
                )}
            </div>
            <div className={`p-3 rounded-xl flex-shrink-0 ml-4 ${iconBg}`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
        </div>
    </div>
);

const statusConfig = {
    pending:       { label: 'Pending',        cls: 'bg-amber-100    text-amber-700    dark:bg-amber-500/10    dark:text-amber-400'    },
    confirmed:     { label: 'Confirmed',      cls: 'bg-sky-100      text-sky-700      dark:bg-sky-500/10      dark:text-sky-400'      },
    processing:    { label: 'Processing',     cls: 'bg-blue-100     text-blue-700     dark:bg-blue-500/10     dark:text-blue-400'     },
    ready_to_ship: { label: 'Ready to Ship',  cls: 'bg-indigo-100   text-indigo-700   dark:bg-indigo-500/10   dark:text-indigo-400'   },
    shipped:       { label: 'Shipped',        cls: 'bg-violet-100   text-violet-700   dark:bg-violet-500/10   dark:text-violet-400'   },
    delivered:     { label: 'Delivered',      cls: 'bg-emerald-100  text-emerald-700  dark:bg-emerald-500/10  dark:text-emerald-400'  },
    cancelled:     { label: 'Cancelled',      cls: 'bg-red-100      text-red-700      dark:bg-red-500/10      dark:text-red-400'      },
};

export default function Dashboard({ stats, recentOrders }) {
    const statCards = [
        { title: 'Total Products',   value: stats?.totalProducts   || 0,                                   icon: HiOutlineShoppingBag,     iconBg: 'bg-primary-500', trend: 'up',   trendValue: '+12%' },
        { title: 'Total Orders',     value: stats?.totalOrders     || 0,                                   icon: HiOutlineClipboardList,   iconBg: 'bg-amber-500',   trend: 'up',   trendValue: '+8%'  },
        { title: 'Total Users',      value: stats?.totalUsers      || 0,                                   icon: HiOutlineUsers,           iconBg: 'bg-emerald-500', trend: 'up',   trendValue: '+5%'  },
        { title: 'Revenue',          value: `PKR ${Number(stats?.totalRevenue || 0).toLocaleString()}`,    icon: HiOutlineCurrencyDollar,  iconBg: 'bg-violet-500',  trend: 'up',   trendValue: '+18%' },
        { title: 'Pending Orders',   value: stats?.pendingOrders   || 0,                                   icon: HiOutlineClock,           iconBg: 'bg-orange-500'  },
        { title: 'Categories',       value: stats?.totalCategories || 0,                                   icon: HiOutlineTag,             iconBg: 'bg-cyan-500'    },
        { title: 'Unread Messages',  value: stats?.unreadMessages  || 0,                                   icon: HiOutlineChatAlt2,        iconBg: 'bg-rose-500'    },
        { title: 'Subscribers',      value: stats?.totalSubscribers|| 0,                                   icon: HiOutlineMail,            iconBg: 'bg-indigo-500'  },
    ];

    return (
        <DashboardLayout title="Dashboard">

            {/* ── Stat cards ──────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((s) => <StatCard key={s.title} {...s} />)}
            </div>

            {/* ── Recent Orders ───────────────────────── */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">

                {/* Table header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Orders</h2>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Latest transactions across the store</p>
                    </div>
                    <a
                        href="/orders"
                        className="flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                    >
                        View all <HiOutlineArrowRight className="w-3.5 h-3.5" />
                    </a>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                                <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Order</th>
                                <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Customer</th>
                                <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Date</th>
                                <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Status</th>
                                <th className="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Total</th>
                                <th className="px-6 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                            {recentOrders && recentOrders.length > 0 ? (
                                recentOrders.map((order) => {
                                    const status = statusConfig[order.status] || { label: order.status, cls: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' };
                                    return (
                                        <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                                            <td className="px-6 py-3.5">
                                                <span className="font-semibold text-slate-900 dark:text-white">#{order.order_number}</span>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                                                        {order.user?.name ? order.user.name.charAt(0) : '?'}
                                                    </div>
                                                    <span className="text-slate-700 dark:text-slate-300 font-medium">{order.user?.name || '—'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5 text-slate-500 dark:text-slate-400 text-xs">
                                                {order.created_at
                                                    ? new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                                                    : '—'
                                                }
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize ${status.cls}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-right font-semibold text-slate-900 dark:text-white">
                                                PKR {Number(order.total).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <a href={`/orders/${order.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 inline-flex">
                                                    <HiOutlineArrowRight className="w-3.5 h-3.5" />
                                                </a>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <HiOutlineClipboardList className="w-10 h-10 mx-auto text-slate-200 dark:text-slate-700 mb-3" />
                                        <p className="text-sm text-slate-400 dark:text-slate-500">No recent orders</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
