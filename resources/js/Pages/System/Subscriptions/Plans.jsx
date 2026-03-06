import DashboardLayout from '../../../Components/DashboardLayout';
import { useForm, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { HiOutlineStar, HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineX, HiOutlineUsers } from 'react-icons/hi';

export default function Plans({ plans }) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '', slug: '', description: '', price: '', billing_cycle: 'monthly',
        free_shipping_orders: '', discount_percentage: '', loyalty_points_multiplier: '',
        is_active: true,
    });

    const openEdit = (p) => {
        setEditing(p);
        setData({ name: p.name, slug: p.slug, description: p.description ?? '', price: p.price, billing_cycle: p.billing_cycle, free_shipping_orders: p.free_shipping_orders ?? '', discount_percentage: p.discount_percentage ?? '', loyalty_points_multiplier: p.loyalty_points_multiplier ?? '', is_active: !!p.is_active });
        setShowForm(true);
    };

    const closeForm = () => { setShowForm(false); setEditing(null); reset(); };

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            put(route('system.subscription-plans.update', editing.id), { onSuccess: closeForm });
        } else {
            post(route('system.subscription-plans.store'), { onSuccess: closeForm });
        }
    };

    const destroy = (id) => {
        if (confirm('Delete this subscription plan?')) router.delete(route('system.subscription-plans.destroy', id));
    };

    const cycleColors = { monthly: 'bg-blue-500/10 text-blue-600', quarterly: 'bg-violet-500/10 text-violet-600', yearly: 'bg-emerald-500/10 text-emerald-600' };

    return (
        <DashboardLayout title="Subscription Plans">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Subscription Plans</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Define membership tiers and recurring billing</p>
                </div>
                <div className="flex gap-3">
                    <Link href={route('system.user-subscriptions.index')} className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                        <HiOutlineUsers className="w-4 h-4" /> User Subscriptions
                    </Link>
                    <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-md shadow-primary-500/20 transition-all">
                        <HiOutlinePlus className="w-5 h-5" /> Add Plan
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">{editing ? 'Edit' : 'Add'} Plan</h3>
                            <button onClick={closeForm}><HiOutlineX className="w-5 h-5 text-slate-400 hover:text-slate-700 dark:hover:text-white" /></button>
                        </div>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Name</label>
                                    <input value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="Premium" />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Slug</label>
                                    <input value={data.slug} onChange={e => setData('slug', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="premium" />
                                    {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Description</label>
                                <textarea rows={2} value={data.description} onChange={e => setData('description', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm resize-none" placeholder="Unlimited free shipping + exclusive discounts" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Price (RS)</label>
                                    <input type="number" step="0.01" value={data.price} onChange={e => setData('price', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="999" />
                                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Billing Cycle</label>
                                    <select value={data.billing_cycle} onChange={e => setData('billing_cycle', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm">
                                        <option value="monthly">Monthly</option>
                                        <option value="quarterly">Quarterly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Free Shipping Orders</label>
                                    <input type="number" value={data.free_shipping_orders} onChange={e => setData('free_shipping_orders', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="Unlimited" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Discount %</label>
                                    <input type="number" step="0.01" value={data.discount_percentage} onChange={e => setData('discount_percentage', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="10" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Points Multiplier</label>
                                    <input type="number" step="0.01" value={data.loyalty_points_multiplier} onChange={e => setData('loyalty_points_multiplier', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm" placeholder="2x" />
                                </div>
                            </div>
                            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="rounded" />
                                Active
                            </label>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={closeForm} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50">
                                    {editing ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.data?.length === 0 && (
                    <div className="col-span-3 py-16 text-center text-slate-400">No subscription plans yet.</div>
                )}
                {plans.data?.map((p) => (
                    <div key={p.id} className={`bg-white dark:bg-slate-900 rounded-2xl border ${p.is_active ? 'border-primary-200 dark:border-primary-800' : 'border-slate-200 dark:border-slate-800'} shadow-sm p-6 relative`}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-600">
                                <HiOutlineStar className="w-5 h-5" />
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                                    <HiOutlinePencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => destroy(p.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                    <HiOutlineTrash className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{p.name}</h3>
                        <p className="text-xs text-slate-400 mt-1 mb-4">{p.description}</p>
                        <div className="flex items-baseline gap-1 mb-4">
                            <span className="text-3xl font-black text-slate-900 dark:text-white">RS {Number(p.price).toLocaleString()}</span>
                            <span className="text-sm text-slate-400">/{p.billing_cycle}</span>
                        </div>
                        <div className="space-y-2 mb-4">
                            {p.discount_percentage > 0 && <p className="text-xs text-slate-600 dark:text-slate-400">• {p.discount_percentage}% discount on all orders</p>}
                            {p.free_shipping_orders > 0 && <p className="text-xs text-slate-600 dark:text-slate-400">• {p.free_shipping_orders} free shipping orders</p>}
                            {p.loyalty_points_multiplier > 1 && <p className="text-xs text-slate-600 dark:text-slate-400">• {p.loyalty_points_multiplier}x loyalty points</p>}
                        </div>
                        <div className="flex items-center justify-between">
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${cycleColors[p.billing_cycle]}`}>{p.billing_cycle}</span>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                <HiOutlineUsers className="w-3.5 h-3.5" />
                                {p.subscriptions_count ?? 0} subscribers
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}
