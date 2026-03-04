import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import DashboardLayout from '../../Components/DashboardLayout';

export default function OrdersShow({ order }) {
    const { data, setData, put, processing } = useForm({ status: order.status, notes: order.notes || '' });
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
        confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
        ready_to_ship: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400',
        shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
        delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
        cancelled: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
    };
    const handleUpdate = (e) => { e.preventDefault(); put(`/orders/${order.id}`); };

    return (
        <DashboardLayout title={`Order #${order.order_number}`}>
            <div className="max-w-4xl">
                <div className="mb-6"><Link href="/orders" className="text-sm text-primary-500 hover:text-primary-600">← Back to Orders</Link></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Items */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                            <div className="p-5 border-b border-gray-100 dark:border-gray-800"><h3 className="font-semibold text-gray-900 dark:text-white">Order Items</h3></div>
                            <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                {order.items?.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 p-4">
                                        <img src={item.product_image ? `/storage/${item.product_image}` : ''} alt="" className="w-14 h-14 rounded-xl object-cover bg-gray-100 dark:bg-gray-800" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{item.product_name}</p>
                                            <p className="text-xs text-gray-500">{item.size}{item.color ? ` / ${item.color}` : ''} × {item.quantity}</p>
                                        </div>
                                        <p className="font-mono font-medium text-gray-900 dark:text-white">${Number(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="p-5 border-t border-gray-100 dark:border-gray-800 space-y-2">
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="text-gray-900 dark:text-white">${Number(order.subtotal).toFixed(2)}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Shipping</span><span className="text-gray-900 dark:text-white">${Number(order.shipping_cost).toFixed(2)}</span></div>
                                <div className="flex justify-between text-base font-bold border-t border-gray-100 dark:border-gray-800 pt-2"><span className="text-gray-900 dark:text-white">Total</span><span className="text-gray-900 dark:text-white">${Number(order.total).toFixed(2)}</span></div>
                            </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                            <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Order Timeline</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-6">
                                    {order.status_histories?.map((history, idx) => (
                                        <div key={history.id} className="relative flex gap-4">
                                            {idx !== order.status_histories.length - 1 && (
                                                <div className="absolute left-[11px] top-6 bottom-0 w-px bg-gray-100 dark:bg-gray-800"></div>
                                            )}
                                            <div className={`mt-1.5 w-[22px] h-[22px] rounded-full border-4 border-white dark:border-gray-900 shadow-sm z-10 ${statusColors[history.status]?.split(' ')[0] || 'bg-gray-400'}`}></div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">{history.status.replace(/_/g, ' ')}</p>
                                                    <span className="text-[10px] text-gray-400 font-mono">{new Date(history.created_at).toLocaleString()}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-0.5">{history.notes}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Customer</h3>
                            <div className="text-sm space-y-1">
                                <p className="font-medium text-gray-900 dark:text-white">{order.user?.name}</p>
                                <p className="text-gray-500">{order.user?.email}</p>
                            </div>
                        </div>
                        {order.address && (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-2">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Shipping Address</h3>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    <p>{order.address.name}</p><p>{order.address.street}</p><p>{order.address.city}, {order.address.zip}</p><p>{order.address.phone}</p>
                                </div>
                            </div>
                        )}
                        {/* Update Status */}
                        <form onSubmit={handleUpdate} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Update Status</h3>
                            <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500">
                                {['pending', 'confirmed', 'ready_to_ship', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s} className="capitalize">{s.replace(/_/g, ' ')}</option>)}
                            </select>
                            <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} placeholder="Notes..." rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 text-sm placeholder-gray-400"></textarea>
                            <button type="submit" disabled={processing} className="w-full px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50">{processing ? 'Updating...' : 'Update Order'}</button>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
