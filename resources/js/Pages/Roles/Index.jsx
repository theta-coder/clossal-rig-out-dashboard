import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import DashboardLayout from '../../Components/DashboardLayout';
import Swal from 'sweetalert2';
import {
    HiOutlineShieldCheck,
    HiOutlineUsers,
    HiOutlineCheck,
    HiOutlineX,
    HiOutlineShoppingBag,
    HiOutlineClipboardList,
    HiOutlineTag,
    HiOutlineStar,
    HiOutlineGift,
    HiOutlineCog,
    HiOutlineChatAlt2,
    HiOutlineMail,
} from 'react-icons/hi';

const permissions = [
    { name: 'Dashboard Access',   icon: HiOutlineShieldCheck,   admin: true,  customer: false },
    { name: 'Manage Products',    icon: HiOutlineShoppingBag,   admin: true,  customer: false },
    { name: 'Manage Orders',      icon: HiOutlineClipboardList, admin: true,  customer: false },
    { name: 'Manage Categories',  icon: HiOutlineTag,           admin: true,  customer: false },
    { name: 'Manage Users',       icon: HiOutlineUsers,         admin: true,  customer: false },
    { name: 'Manage Coupons',     icon: HiOutlineGift,          admin: true,  customer: false },
    { name: 'Manage Reviews',     icon: HiOutlineStar,          admin: true,  customer: false },
    { name: 'Manage Settings',    icon: HiOutlineCog,           admin: true,  customer: false },
    { name: 'Contact Messages',   icon: HiOutlineChatAlt2,      admin: true,  customer: false },
    { name: 'Newsletter Access',  icon: HiOutlineMail,          admin: true,  customer: false },
    { name: 'Shop (Frontend)',    icon: HiOutlineShoppingBag,   admin: true,  customer: true  },
    { name: 'Place Orders',       icon: HiOutlineClipboardList, admin: true,  customer: true  },
    { name: 'Write Reviews',      icon: HiOutlineStar,          admin: true,  customer: true  },
    { name: 'Save Favorites',     icon: HiOutlineShieldCheck,   admin: true,  customer: true  },
];

const Badge = ({ role }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide
        ${role === 'admin'
            ? 'bg-primary-100 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
        }`}>
        {role}
    </span>
);

export default function RolesIndex({ adminCount, customerCount, users }) {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    const filtered = users.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                            u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = filter === 'all' || u.role === filter;
        return matchSearch && matchRole;
    });

    const handleRoleChange = (user, newRole) => {
        if (user.role === newRole) return;

        Swal.fire({
            title: 'Change Role?',
            html: `Change <strong>${user.name}</strong> to <strong>${newRole}</strong>?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#6366f1',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, change it',
        }).then((result) => {
            if (result.isConfirmed) {
                router.patch(`/roles/${user.id}`, { role: newRole });
            }
        });
    };

    return (
        <DashboardLayout title="Roles & Permissions">

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 bg-primary-500"></div>
                    <div className="flex items-center gap-4 relative">
                        <div className="p-3 rounded-xl bg-primary-500 shadow-lg shadow-primary-500/25">
                            <HiOutlineShieldCheck className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-0.5">Admin Users</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{adminCount}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Full dashboard access</p>
                        </div>
                    </div>
                </div>

                <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 bg-gray-500"></div>
                    <div className="flex items-center gap-4 relative">
                        <div className="p-3 rounded-xl bg-gray-500 shadow-lg shadow-gray-500/25">
                            <HiOutlineUsers className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-0.5">Customer Users</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{customerCount}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Frontend shop access only</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Permissions Matrix */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden mb-8">
                <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">Permissions Matrix</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">What each role can access</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 w-1/2">Permission</th>
                                <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-primary-500">Admin</th>
                                <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Customer</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                            {permissions.map((perm) => (
                                <tr key={perm.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2.5">
                                            <perm.icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">{perm.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-center">
                                        {perm.admin
                                            ? <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/10"><HiOutlineCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /></span>
                                            : <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-500/10"><HiOutlineX className="w-3.5 h-3.5 text-red-500" /></span>
                                        }
                                    </td>
                                    <td className="px-5 py-3 text-center">
                                        {perm.customer
                                            ? <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/10"><HiOutlineCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /></span>
                                            : <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-500/10"><HiOutlineX className="w-3.5 h-3.5 text-red-500" /></span>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Users Role Management */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-gray-100 dark:border-gray-800">
                    <div>
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white">User Role Management</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Assign or change roles for any user</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-48"
                        />
                        {/* Filter */}
                        <select
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                            className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="customer">Customer</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">User</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Current Role</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Joined</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Change Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                            {filtered.length > 0 ? filtered.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <Badge role={user.role} />
                                    </td>
                                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400 text-xs">
                                        {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleRoleChange(user, 'admin')}
                                                disabled={user.role === 'admin'}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                                                    ${user.role === 'admin'
                                                        ? 'bg-primary-500 text-white cursor-default shadow-md shadow-primary-500/25'
                                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-500/10 hover:text-primary-600 dark:hover:text-primary-400'
                                                    }`}
                                            >
                                                Admin
                                            </button>
                                            <button
                                                onClick={() => handleRoleChange(user, 'customer')}
                                                disabled={user.role === 'customer'}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                                                    ${user.role === 'customer'
                                                        ? 'bg-gray-500 text-white cursor-default shadow-md shadow-gray-500/25'
                                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200'
                                                    }`}
                                            >
                                                Customer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-5 py-12 text-center text-gray-400 text-sm">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                    <p className="text-xs text-gray-400">
                        Showing {filtered.length} of {users.length} users
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}
