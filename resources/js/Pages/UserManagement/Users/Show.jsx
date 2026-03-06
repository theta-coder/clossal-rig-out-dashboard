import React, { useState } from 'react';
import { Link, Head, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import DashboardLayout from '../../../Components/DashboardLayout';
import { HiOutlinePencil, HiOutlineUser, HiOutlinePhone, HiOutlineMail, HiOutlineCalendar, HiOutlineShieldCheck, HiOutlineTrash, HiOutlineDeviceMobile } from 'react-icons/hi';

const tabs = ['Overview', 'Orders', 'Addresses', 'Social Logins', 'Device Tokens', 'Activity Log', 'OTP History', 'Terms'];

function Badge({ color, children }) {
    const colors = {
        green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
        red: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
        blue: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
        violet: 'bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400',
        amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
        gray: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    };
    return <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color] || colors.gray}`}>{children}</span>;
}

function Card({ title, children, className = '' }) {
    return (
        <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 ${className}`}>
            {title && <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>}
            {children}
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{value || '—'}</span>
        </div>
    );
}

function EmptyState({ text }) {
    return <p className="text-sm text-gray-400 dark:text-gray-500 py-8 text-center">{text}</p>;
}

export default function UsersShow({ user, roles }) {
    const [activeTab, setActiveTab] = useState(0);

    const handleDeleteDeviceToken = (tokenId) => {
        Swal.fire({
            title: 'Remove Device?', text: 'The device will be unlinked from this user.', icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Yes, remove!'
        }).then((result) => {
            if (result.isConfirmed) router.delete(route('users.remove-device-token', [user.id, tokenId]));
        });
    };

    return (
        <DashboardLayout title="User Details">
            <Head title={user.name} />
            <div className="max-w-5xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <Link href={route('users.index')} className="text-sm text-primary-500 hover:text-primary-600">← Back to Users</Link>
                    <Link href={route('users.edit', user.id)} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium transition-all">
                        <HiOutlinePencil className="w-4 h-4" /> Edit User
                    </Link>
                </div>

                {/* User Profile Card */}
                <Card className="mb-6">
                    <div className="flex items-start gap-5">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold ${user.is_blocked ? 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400' : 'bg-primary-100 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400'}`}>
                            {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                                {roles?.map((role, i) => <Badge key={i} color={role === 'admin' ? 'violet' : 'gray'}>{role}</Badge>)}
                                {user.is_blocked && <Badge color="red">Blocked</Badge>}
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
                                <span className="flex items-center gap-1.5"><HiOutlineMail className="w-4 h-4" /> {user.email}</span>
                                {user.phone && <span className="flex items-center gap-1.5"><HiOutlinePhone className="w-4 h-4" /> {user.phone}</span>}
                                {user.gender && <span className="flex items-center gap-1.5"><HiOutlineUser className="w-4 h-4" /> {user.gender}</span>}
                                {user.date_of_birth && <span className="flex items-center gap-1.5"><HiOutlineCalendar className="w-4 h-4" /> {user.date_of_birth}</span>}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">Rs {Number(user.total_spent || 0).toLocaleString()}</p>
                            <p className="text-xs text-gray-400">Total Spent</p>
                        </div>
                    </div>
                </Card>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 overflow-x-auto bg-gray-100 dark:bg-gray-800/50 rounded-xl p-1">
                    {tabs.map((tab, i) => (
                        <button key={tab} onClick={() => setActiveTab(i)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === i ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card title="Account Info">
                            <InfoRow label="User ID" value={`#${user.id}`} />
                            <InfoRow label="Email Verified" value={user.email_verified_at ? '✅ Yes' : '❌ No'} />
                            <InfoRow label="Phone Verified" value={user.phone_verified_at ? '✅ Yes' : '❌ No'} />
                            <InfoRow label="Referral Code" value={user.referral_code} />
                            <InfoRow label="Joined" value={user.created_at} />
                        </Card>
                        <Card title="Statistics">
                            <InfoRow label="Total Orders" value={user.total_orders || user.orders?.length || 0} />
                            <InfoRow label="Total Spent" value={`Rs ${Number(user.total_spent || 0).toLocaleString()}`} />
                            <InfoRow label="Favorites" value={user.favorites?.length || 0} />
                            <InfoRow label="Reviews" value={user.reviews?.length || 0} />
                            <InfoRow label="Addresses" value={user.addresses?.length || 0} />
                        </Card>
                        <Card title="Security">
                            <InfoRow label="Social Logins" value={user.social_logins?.length || 0} />
                            <InfoRow label="Device Tokens" value={user.device_tokens?.length || 0} />
                            <InfoRow label="Terms Accepted" value={user.terms_acceptances?.length || 0} />
                            <InfoRow label="Status" value={user.is_blocked ? '🚫 Blocked' : '✅ Active'} />
                        </Card>
                    </div>
                )}

                {activeTab === 1 && (
                    <Card title={`Orders (${user.orders?.length || 0})`}>
                        {user.orders?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead><tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left py-3 px-3 text-gray-500 font-medium">ID</th>
                                        <th className="text-left py-3 px-3 text-gray-500 font-medium">Status</th>
                                        <th className="text-left py-3 px-3 text-gray-500 font-medium">Items</th>
                                        <th className="text-right py-3 px-3 text-gray-500 font-medium">Total</th>
                                        <th className="text-left py-3 px-3 text-gray-500 font-medium">Date</th>
                                    </tr></thead>
                                    <tbody>
                                        {user.orders.map(order => (
                                            <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <td className="py-3 px-3 font-medium text-gray-900 dark:text-white">#{order.id}</td>
                                                <td className="py-3 px-3"><Badge color={order.status === 'delivered' ? 'green' : order.status === 'cancelled' ? 'red' : 'amber'}>{order.status}</Badge></td>
                                                <td className="py-3 px-3 text-gray-600 dark:text-gray-400">{order.items?.length || 0} items</td>
                                                <td className="py-3 px-3 text-right font-medium text-gray-900 dark:text-white">Rs {Number(order.total || 0).toLocaleString()}</td>
                                                <td className="py-3 px-3 text-gray-500">{order.created_at}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : <EmptyState text="No orders yet." />}
                    </Card>
                )}

                {activeTab === 2 && (
                    <Card title={`Addresses (${user.addresses?.length || 0})`}>
                        {user.addresses?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {user.addresses.map(addr => (
                                    <div key={addr.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-gray-900 dark:text-white">{addr.name}</span>
                                            <div className="flex gap-2">
                                                <Badge color={addr.type === 'shipping' ? 'blue' : 'violet'}>{addr.type}</Badge>
                                                {addr.is_default && <Badge color="green">Default</Badge>}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{addr.street}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{addr.city} {addr.zip}</p>
                                        {addr.phone && <p className="text-sm text-gray-500 mt-1">📞 {addr.phone}</p>}
                                    </div>
                                ))}
                            </div>
                        ) : <EmptyState text="No addresses added." />}
                    </Card>
                )}

                {activeTab === 3 && (
                    <Card title={`Social Logins (${user.social_logins?.length || 0})`}>
                        {user.social_logins?.length > 0 ? (
                            <div className="space-y-3">
                                {user.social_logins.map(sl => (
                                    <div key={sl.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-700 flex items-center justify-center text-lg font-bold shadow-sm">
                                                {sl.provider === 'google' ? '🔴' : sl.provider === 'facebook' ? '🔵' : '🟢'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white capitalize">{sl.provider}</p>
                                                <p className="text-xs text-gray-400">{sl.provider_email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right text-xs text-gray-400">
                                            <p>ID: {sl.provider_id}</p>
                                            {sl.token_expires_at && <p>Expires: {sl.token_expires_at}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : <EmptyState text="No social logins connected." />}
                    </Card>
                )}

                {activeTab === 4 && (
                    <Card title={`Device Tokens (${user.device_tokens?.length || 0})`}>
                        {user.device_tokens?.length > 0 ? (
                            <div className="space-y-3">
                                {user.device_tokens.map(dt => (
                                    <div key={dt.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                                        <div className="flex items-center gap-3">
                                            <HiOutlineDeviceMobile className="w-6 h-6 text-gray-400" />
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{dt.device_name || 'Unknown Device'}</p>
                                                <p className="text-xs text-gray-400">Platform: {dt.platform} • FCM: {dt.fcm_token?.substring(0, 20)}...</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge color={dt.is_active ? 'green' : 'gray'}>{dt.is_active ? 'Active' : 'Inactive'}</Badge>
                                            <button onClick={() => handleDeleteDeviceToken(dt.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                                <HiOutlineTrash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : <EmptyState text="No device tokens registered." />}
                    </Card>
                )}

                {activeTab === 5 && (
                    <Card title={`Activity Log (Latest 50)`}>
                        {user.activity_logs?.length > 0 ? (
                            <div className="space-y-2">
                                {user.activity_logs.map(log => (
                                    <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-primary-400 flex-shrink-0"></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900 dark:text-white font-medium">{log.action}</p>
                                            {log.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{log.description}</p>}
                                            <div className="flex gap-4 mt-1 text-xs text-gray-400">
                                                {log.ip_address && <span>IP: {log.ip_address}</span>}
                                                <span>{log.created_at}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : <EmptyState text="No activity logs found." />}
                    </Card>
                )}

                {activeTab === 6 && (
                    <Card title={`OTP History (${user.otp_verifications?.length || 0})`}>
                        {user.otp_verifications?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead><tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left py-3 px-3 text-gray-500 font-medium">Type</th>
                                        <th className="text-left py-3 px-3 text-gray-500 font-medium">Target</th>
                                        <th className="text-left py-3 px-3 text-gray-500 font-medium">Status</th>
                                        <th className="text-left py-3 px-3 text-gray-500 font-medium">Attempts</th>
                                        <th className="text-left py-3 px-3 text-gray-500 font-medium">IP</th>
                                        <th className="text-left py-3 px-3 text-gray-500 font-medium">Created</th>
                                    </tr></thead>
                                    <tbody>
                                        {user.otp_verifications.map(otp => (
                                            <tr key={otp.id} className="border-b border-gray-100 dark:border-gray-800">
                                                <td className="py-3 px-3 capitalize">{otp.type}</td>
                                                <td className="py-3 px-3 text-gray-600 dark:text-gray-400">{otp.phone || otp.email}</td>
                                                <td className="py-3 px-3"><Badge color={otp.is_used ? 'green' : 'amber'}>{otp.is_used ? 'Used' : 'Pending'}</Badge></td>
                                                <td className="py-3 px-3">{otp.attempts}</td>
                                                <td className="py-3 px-3 text-gray-400 font-mono text-xs">{otp.ip_address}</td>
                                                <td className="py-3 px-3 text-gray-500">{otp.created_at}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : <EmptyState text="No OTP verifications found." />}
                    </Card>
                )}

                {activeTab === 7 && (
                    <Card title={`Terms & Conditions Acceptances (${user.terms_acceptances?.length || 0})`}>
                        {user.terms_acceptances?.length > 0 ? (
                            <div className="space-y-3">
                                {user.terms_acceptances.map(ta => (
                                    <div key={ta.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                                        <div className="flex items-center gap-3">
                                            <HiOutlineShieldCheck className="w-5 h-5 text-emerald-500" />
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">Version {ta.terms_version}</p>
                                                <p className="text-xs text-gray-400">Type: {ta.type} • IP: {ta.ip_address}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-500">{ta.accepted_at}</span>
                                    </div>
                                ))}
                            </div>
                        ) : <EmptyState text="No terms acceptances recorded." />}
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}
