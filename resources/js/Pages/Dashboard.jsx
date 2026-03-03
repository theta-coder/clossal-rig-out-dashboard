import React from 'react';
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
} from 'react-icons/hi';

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
    <div className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all duration-300 overflow-hidden">
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 ${color}`}></div>
        <div className="flex items-start justify-between relative">
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                {trend && (
                    <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {trend === 'up' ? <HiOutlineTrendingUp className="w-4 h-4" /> : <HiOutlineTrendingDown className="w-4 h-4" />}
                        <span>{trendValue}</span>
                    </div>
                )}
            </div>
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
    </div>
);

export default function Dashboard({ stats, recentOrders }) {
    const statCards = [
        { title: 'Total Products', value: stats?.totalProducts || 0, icon: HiOutlineShoppingBag, color: 'bg-primary-500', trend: 'up', trendValue: '+12%' },
        { title: 'Total Orders', value: stats?.totalOrders || 0, icon: HiOutlineClipboardList, color: 'bg-amber-500', trend: 'up', trendValue: '+8%' },
        { title: 'Total Users', value: stats?.totalUsers || 0, icon: HiOutlineUsers, color: 'bg-emerald-500', trend: 'up', trendValue: '+5%' },
        { title: 'Revenue', value: `$${Number(stats?.totalRevenue || 0).toLocaleString()}`, icon: HiOutlineCurrencyDollar, color: 'bg-violet-500', trend: 'up', trendValue: '+18%' },
        { title: 'Pending Orders', value: stats?.pendingOrders || 0, icon: HiOutlineClock, color: 'bg-orange-500' },
        { title: 'Categories', value: stats?.totalCategories || 0, icon: HiOutlineTag, color: 'bg-cyan-500' },
        { title: 'Unread Messages', value: stats?.unreadMessages || 0, icon: HiOutlineChatAlt2, color: 'bg-rose-500' },
        { title: 'Subscribers', value: stats?.totalSubscribers || 0, icon: HiOutlineMail, color: 'bg-indigo-500' },
    ];

    const statusColors = {
        processing: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
        shipped: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
        delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
        cancelled: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
    };

    return (
        <DashboardLayout title="Dashboard">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
                    <a href="/orders" className="text-sm text-primary-500 hover:text-primary-600 font-medium">View All</a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800">
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Order</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Customer</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                            {recentOrders && recentOrders.length > 0 ? (
                                recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">#{order.order_number}</td>
                                        <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{order.user?.name || '—'}</td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || ''}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-right font-medium text-gray-900 dark:text-white">${Number(order.total).toFixed(2)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-5 py-12 text-center text-gray-400">No recent orders</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
