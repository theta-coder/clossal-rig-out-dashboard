import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import DashboardLayout from '../../Components/DashboardLayout';

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
    confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
    ready_to_ship: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400',
    shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
    delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
    requested: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    approved: 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400',
    rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
    received: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400',
    refunded: 'bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400',
    draft: 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400',
    issued: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
    paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    partially_refunded: 'bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400',
    failed: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
    processed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    collected: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    submitted: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
    verified: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    shortage: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
    excess: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400',
};

const formatStatus = (value) => {
    if (!value) return '-';
    return String(value)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

const formatDateTime = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleString();
};

const resolveImageUrl = (value) => {
    if (!value) return null;
    const src = String(value).trim();
    if (!src) return null;
    if (/^https?:\/\//i.test(src)) return src;
    if (src.startsWith('/')) return src;
    if (src.startsWith('storage/') || src.startsWith('assets/')) return `/${src}`;
    if (src.startsWith('public/')) return `/${src.replace(/^public\//, '')}`;
    return `/storage/${src}`;
};

function ProductThumb({ src, alt }) {
    const [failed, setFailed] = React.useState(false);

    if (!src || failed) {
        return (
            <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] text-gray-500">
                No image
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            onError={() => setFailed(true)}
            className="w-14 h-14 rounded-xl object-cover bg-gray-100 dark:bg-gray-800"
        />
    );
}

function Card({ title, children }) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

function DataGrid({ columns, rows, emptyText = 'No records found.' }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                        {columns.map((col) => (
                            <th key={col.key} className="text-left py-2.5 pr-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="py-6 text-gray-500 dark:text-gray-400">
                                {emptyText}
                            </td>
                        </tr>
                    ) : (
                        rows.map((row, index) => (
                            <tr key={row.id || index} className="border-b border-gray-50 dark:border-gray-800/40 last:border-b-0">
                                {columns.map((col) => (
                                    <td key={col.key} className="py-2.5 pr-4 text-gray-800 dark:text-gray-200 whitespace-nowrap align-top">
                                        {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '-')}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default function OrdersShow({ order }) {
    const { data, setData, put, processing } = useForm({ status: order.status, notes: order.notes || '' });
    const handleUpdate = (e) => {
        e.preventDefault();
        put(`/orders/${order.id}`);
    };

    const returnItems = (order.returns || []).flatMap((ret) =>
        (ret.items || []).map((item) => ({
            ...item,
            return_number: ret.return_number,
        }))
    );

    const refundBanks = (order.returns || [])
        .filter((ret) => ret.refund_bank_detail)
        .map((ret) => ({
            ...ret.refund_bank_detail,
            return_number: ret.return_number,
        }));

    const shipping = {
        name: order.address?.name || order.shipping_name || '-',
        street: order.address?.street || order.shipping_street || '-',
        city: order.address?.city || order.shipping_city || '-',
        zip: order.address?.zip || order.shipping_zip || '-',
        phone: order.address?.phone || order.shipping_phone || '-',
        email: order.address?.email || order.shipping_email || '-',
    };

    return (
        <DashboardLayout title={`Order #${order.order_number}`}>
            <div className="max-w-7xl">
                <div className="mb-6">
                    <Link href="/orders" className="text-sm text-primary-500 hover:text-primary-600">
                        ← Back to Orders
                    </Link>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    <div className="xl:col-span-8 space-y-6">
                        <Card title="Order Items">
                            <div className="space-y-4">
                                {(order.items || []).length === 0 ? (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No order items found.</p>
                                ) : (
                                    (order.items || []).map((item) => {
                                        const image = resolveImageUrl(
                                            item.product_image || item.product?.images?.[0]?.image_path
                                        );

                                        return (
                                            <div key={item.id} className="flex items-center gap-4 border-b border-gray-50 dark:border-gray-800/50 pb-4 last:border-0 last:pb-0">
                                                <ProductThumb src={image} alt={item.product_name} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                                        {item.product_name || item.product?.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {item.size || '-'}
                                                        {item.color ? ` / ${item.color}` : ''} × {item.quantity}
                                                    </p>
                                                </div>
                                                <p className="font-mono font-medium text-gray-900 dark:text-white">
                                                    {formatCurrency((item.price || 0) * (item.quantity || 0))}
                                                </p>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="text-gray-900 dark:text-white">{formatCurrency(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="text-gray-900 dark:text-white">{formatCurrency(order.shipping_cost)}</span>
                                </div>
                                <div className="flex justify-between text-base font-bold border-t border-gray-100 dark:border-gray-800 pt-2">
                                    <span className="text-gray-900 dark:text-white">Total</span>
                                    <span className="text-gray-900 dark:text-white">{formatCurrency(order.total)}</span>
                                </div>
                            </div>
                        </Card>

                        <Card title="Order Status">
                            <div className="mb-4">
                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || ''}`}>
                                    {formatStatus(order.status)}
                                </span>
                            </div>
                            <DataGrid
                                columns={[
                                    { key: 'status', label: 'Status', render: (val) => formatStatus(val) },
                                    { key: 'notes', label: 'Notes' },
                                    { key: 'created_at', label: 'Date', render: (val) => formatDateTime(val) },
                                ]}
                                rows={order.status_histories || []}
                                emptyText="No status history found."
                            />
                        </Card>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Order Tracking">
                                <DataGrid
                                    columns={[
                                        { key: 'courier', label: 'Courier' },
                                        { key: 'tracking_number', label: 'Tracking #' },
                                        { key: 'tracking_url', label: 'Tracking URL' },
                                        { key: 'estimated_delivery', label: 'ETA', render: (val) => formatDateTime(val) },
                                        { key: 'actual_delivery', label: 'Delivered', render: (val) => formatDateTime(val) },
                                    ]}
                                    rows={order.tracking ? [{
                                        courier: order.tracking.courier_company?.name || order.tracking.courier_name || '-',
                                        tracking_number: order.tracking.tracking_number || '-',
                                        tracking_url: order.tracking.tracking_url || '-',
                                        estimated_delivery: order.tracking.estimated_delivery,
                                        actual_delivery: order.tracking.actual_delivery,
                                    }] : []}
                                    emptyText="No tracking record found."
                                />
                            </Card>

                            <Card title="Invoices">
                                <DataGrid
                                    columns={[
                                        { key: 'invoice_number', label: 'Invoice #' },
                                        {
                                            key: 'status',
                                            label: 'Status',
                                            render: (val) => (
                                                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[val] || ''}`}>
                                                    {formatStatus(val)}
                                                </span>
                                            ),
                                        },
                                        { key: 'total', label: 'Total', render: (val) => formatCurrency(val) },
                                        { key: 'issued_at', label: 'Issued At', render: (val) => formatDateTime(val) },
                                    ]}
                                    rows={order.invoice ? [order.invoice] : []}
                                    emptyText="No invoice found."
                                />
                            </Card>
                        </div>

                        <Card title="Payments">
                            <DataGrid
                                columns={[
                                    { key: 'transaction_ref', label: 'Reference' },
                                    { key: 'gateway', label: 'Gateway', render: (val) => formatStatus(val) },
                                    { key: 'method', label: 'Method' },
                                    {
                                        key: 'status',
                                        label: 'Status',
                                        render: (val) => (
                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[val] || ''}`}>
                                                {formatStatus(val)}
                                            </span>
                                        ),
                                    },
                                    { key: 'amount', label: 'Amount', render: (val) => formatCurrency(val) },
                                    { key: 'payment_at', label: 'Paid At', render: (val) => formatDateTime(val) },
                                ]}
                                rows={order.payment_transactions || []}
                                emptyText="No payment transactions found."
                            />
                        </Card>

                        <Card title="Returns">
                            <DataGrid
                                columns={[
                                    { key: 'return_number', label: 'Return #' },
                                    {
                                        key: 'status',
                                        label: 'Status',
                                        render: (val) => (
                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[val] || ''}`}>
                                                {formatStatus(val)}
                                            </span>
                                        ),
                                    },
                                    { key: 'reason', label: 'Reason', render: (val) => formatStatus(val) },
                                    { key: 'refund_amount', label: 'Refund', render: (val) => formatCurrency(val) },
                                    { key: 'refund_method', label: 'Method', render: (val) => formatStatus(val) },
                                    { key: 'refunded_at', label: 'Refunded At', render: (val) => formatDateTime(val) },
                                ]}
                                rows={order.returns || []}
                                emptyText="No returns found."
                            />
                        </Card>

                        <Card title="Return Items">
                            <DataGrid
                                columns={[
                                    { key: 'return_number', label: 'Return #' },
                                    { key: 'order_item_name', label: 'Order Item' },
                                    { key: 'quantity', label: 'Qty' },
                                    { key: 'refund_amount', label: 'Refund', render: (val) => formatCurrency(val) },
                                    { key: 'reason', label: 'Reason' },
                                ]}
                                rows={returnItems.map((item) => ({
                                    ...item,
                                    order_item_name: item.order_item?.product_name || `Order Item #${item.order_item_id}`,
                                }))}
                                emptyText="No return items found."
                            />
                        </Card>

                        <Card title="Refund Banks">
                            <DataGrid
                                columns={[
                                    { key: 'return_number', label: 'Return #' },
                                    { key: 'bank_name', label: 'Bank' },
                                    { key: 'account_title', label: 'Account Title' },
                                    { key: 'account_number', label: 'Account #' },
                                    { key: 'iban', label: 'IBAN' },
                                    {
                                        key: 'status',
                                        label: 'Status',
                                        render: (val) => (
                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[val] || ''}`}>
                                                {formatStatus(val)}
                                            </span>
                                        ),
                                    },
                                ]}
                                rows={refundBanks}
                                emptyText="No refund bank detail found."
                            />
                        </Card>

                        <Card title="COD Collections">
                            <DataGrid
                                columns={[
                                    { key: 'rider_name', label: 'Rider' },
                                    { key: 'amount_collected', label: 'Collected', render: (val) => formatCurrency(val) },
                                    { key: 'amount_submitted', label: 'Submitted', render: (val) => formatCurrency(val) },
                                    {
                                        key: 'status',
                                        label: 'Status',
                                        render: (val) => (
                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[val] || ''}`}>
                                                {formatStatus(val)}
                                            </span>
                                        ),
                                    },
                                    { key: 'collected_at', label: 'Collected At', render: (val) => formatDateTime(val) },
                                    { key: 'verified_by_name', label: 'Verified By' },
                                ]}
                                rows={(order.cod_collections || []).map((entry) => ({
                                    ...entry,
                                    rider_name: entry.rider?.user?.name || `Rider #${entry.rider_id}`,
                                    verified_by_name: entry.verifier?.name || '-',
                                }))}
                                emptyText="No COD collection records found."
                            />
                        </Card>
                    </div>

                    <div className="xl:col-span-4 space-y-6">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Customer</h3>
                            <div className="text-sm space-y-1">
                                <p className="font-medium text-gray-900 dark:text-white">{order.user?.name || 'Guest'}</p>
                                <p className="text-gray-500">{order.user?.email || shipping.email}</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Shipping Address</h3>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                <p>{shipping.name}</p>
                                <p>{shipping.street}</p>
                                <p>{shipping.city}, {shipping.zip}</p>
                                <p>{shipping.phone}</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdate} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Update Status</h3>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                {['pending', 'confirmed', 'ready_to_ship', 'shipped', 'delivered', 'cancelled'].map((s) => (
                                    <option key={s} value={s}>
                                        {formatStatus(s)}
                                    </option>
                                ))}
                            </select>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Notes..."
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 text-sm placeholder-gray-400"
                            />
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                            >
                                {processing ? 'Updating...' : 'Update Order'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
