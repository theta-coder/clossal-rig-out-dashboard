import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HiOutlineHome,
    HiOutlineTag,
    HiOutlineShoppingBag,
    HiOutlineClipboardList,
    HiOutlineUsers,
    HiOutlineStar,
    HiOutlineGift,
    HiOutlineMail,
    HiOutlineChatAlt2,
    HiOutlineCog,
    HiOutlineChevronLeft,
    HiOutlineMenu,
    HiOutlineArrowsExpand,
    HiOutlineColorSwatch,
    HiOutlineShieldCheck,
} from 'react-icons/hi';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HiOutlineHome, permission: 'dashboard_access' },
    { name: 'Categories', href: '/categories', icon: HiOutlineTag, permission: 'show_categories' },
    { name: 'Products', href: '/products', icon: HiOutlineShoppingBag, permission: 'show_products' },
    { name: 'Sizes', href: '/sizes', icon: HiOutlineArrowsExpand, permission: 'show_sizes' },
    { name: 'Colors', href: '/colors', icon: HiOutlineColorSwatch, permission: 'show_colors' },
    { name: 'Orders', href: '/orders', icon: HiOutlineClipboardList, permission: 'show_orders' },
    { name: 'Users', href: '/users', icon: HiOutlineUsers, permission: 'show_users' },
    { name: 'Roles', href: '/roles', icon: HiOutlineShieldCheck, permission: 'show_roles' },
    { name: 'Reviews', href: '/reviews', icon: HiOutlineStar, permission: 'show_reviews' },
    { name: 'Coupons', href: '/coupons', icon: HiOutlineGift, permission: 'show_coupons' },
    { name: 'Subscribers', href: '/subscribers', icon: HiOutlineMail, permission: 'show_subscribers' },
    { name: 'Messages', href: '/messages', icon: HiOutlineChatAlt2, permission: 'show_messages' },
    { name: 'Settings', href: '/settings', icon: HiOutlineCog, permission: 'show_settings' },
];

export default function Sidebar({ collapsed, setCollapsed }) {
    const { url, props: { auth } } = usePage();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (href) => {
        if (href === '/') return url === '/';
        return url.startsWith(href);
    };

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
                {!collapsed && (
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">UT</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">Urban Threads</span>
                    </Link>
                )}
                {collapsed && (
                    <div className="w-8 h-8 mx-auto rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">UT</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const active = isActive(item.href);
                    // Check permissions
                    const hasPermission = auth.roles?.includes('admin') || auth.permissions?.includes(item.permission);

                    if (!hasPermission) return null;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                                ${active
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                }
                                ${collapsed ? 'justify-center' : ''}
                            `}
                            title={collapsed ? item.name : undefined}
                        >
                            <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : ''}`} />
                            {!collapsed && <span>{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* User info */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-800">
                <div className={`flex items-center gap-3 px-2 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 ${collapsed ? 'justify-center' : ''}`}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold uppercase">
                            {auth?.user?.name ? auth.user.name.charAt(0) : 'A'}
                        </span>
                    </div>
                    {!collapsed && (
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{auth?.user?.name || 'Admin'}</p>
                            <span className="text-[9px] font-black uppercase tracking-widest bg-primary-500 text-white px-1.5 py-0.5 rounded-full">
                                {auth?.roles?.[0] || 'admin'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Collapse button (desktop) */}
            <div className="hidden lg:block p-3 border-t border-gray-200 dark:border-gray-800">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex items-center justify-center w-full py-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                    <HiOutlineChevronLeft className={`w-5 h-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700"
            >
                <HiOutlineMenu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile sidebar */}
            <aside
                className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
                onClick={() => setMobileOpen(false)}
            >
                {sidebarContent}
            </aside>

            {/* Desktop sidebar */}
            <aside
                className={`hidden lg:block fixed inset-y-0 left-0 z-30 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300
                    ${collapsed ? 'w-[70px]' : 'w-64'}
                `}
            >
                {sidebarContent}
            </aside>
        </>
    );
}
