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
    HiOutlineSpeakerphone,
} from 'react-icons/hi';

const navGroups = [
    {
        label: 'Overview',
        items: [
            { name: 'Dashboard', href: '/dashboard', icon: HiOutlineHome, permission: 'dashboard_access' },
        ],
    },
    {
        label: 'Catalog',
        items: [
            { name: 'Categories',  href: '/categories', icon: HiOutlineTag,          permission: 'show_categories' },
            { name: 'Products',    href: '/products',   icon: HiOutlineShoppingBag,  permission: 'show_products'   },
            { name: 'Sizes',       href: '/sizes',      icon: HiOutlineArrowsExpand, permission: 'show_sizes'      },
            { name: 'Colors',      href: '/colors',     icon: HiOutlineColorSwatch,  permission: 'show_colors'     },
        ],
    },
    {
        label: 'Commerce',
        items: [
            { name: 'Orders',  href: '/orders',  icon: HiOutlineClipboardList, permission: 'show_orders'  },
            { name: 'Coupons', href: '/coupons', icon: HiOutlineGift,          permission: 'show_coupons' },
        ],
    },
    {
        label: 'Community',
        items: [
            { name: 'Users',         href: '/users',         icon: HiOutlineUsers,        permission: 'show_users'         },
            { name: 'Roles',         href: '/roles',         icon: HiOutlineShieldCheck,  permission: 'show_roles'         },
            { name: 'Reviews',       href: '/reviews',       icon: HiOutlineStar,         permission: 'show_reviews'       },
            { name: 'Subscribers',   href: '/subscribers',   icon: HiOutlineMail,         permission: 'show_subscribers'   },
            { name: 'Messages',      href: '/messages',      icon: HiOutlineChatAlt2,     permission: 'show_messages'      },
            { name: 'Announcements', href: '/announcements', icon: HiOutlineSpeakerphone, permission: 'show_announcements' },
        ],
    },
    {
        label: 'System',
        items: [
            { name: 'Settings', href: '/settings', icon: HiOutlineCog, permission: 'show_settings' },
        ],
    },
];

export default function Sidebar({ collapsed, setCollapsed }) {
    const { url, props: { auth } } = usePage();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (href) => {
        if (href === '/') return url === '/';
        return url.startsWith(href);
    };

    const hasPermission = (permission) =>
        auth.roles?.includes('admin') || auth.permissions?.includes(permission);

    const SidebarContent = () => (
        <div className="flex flex-col h-full">

            {/* ── Logo ─────────────────────────────── */}
            <div className={`flex items-center h-16 px-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0 ${collapsed ? 'justify-center' : 'gap-3'}`}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary-500/30">
                    <span className="text-white font-bold text-xs tracking-wide">UT</span>
                </div>
                {!collapsed && (
                    <div className="min-w-0">
                        <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Urban Threads</span>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest leading-none mt-0.5">Admin Panel</p>
                    </div>
                )}
            </div>

            {/* ── Navigation ───────────────────────── */}
            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-4">
                {navGroups.map((group) => {
                    const visibleItems = group.items.filter(item => hasPermission(item.permission));
                    if (visibleItems.length === 0) return null;

                    return (
                        <div key={group.label}>
                            {!collapsed && (
                                <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 select-none">
                                    {group.label}
                                </p>
                            )}
                            {collapsed && (
                                <div className="border-t border-slate-100 dark:border-slate-800 mx-2 mb-2" />
                            )}

                            <div className="space-y-0.5">
                                {visibleItems.map((item) => {
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            title={collapsed ? item.name : undefined}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                                ${collapsed ? 'justify-center' : ''}
                                                ${active
                                                    ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                                }
                                            `}
                                        >
                                            <item.icon className="w-5 h-5 flex-shrink-0" />
                                            {!collapsed && <span className="truncate">{item.name}</span>}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </nav>

            {/* ── User info ────────────────────────── */}
            <div className="px-3 py-3 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
                <div className={`flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 px-3 py-2.5 ${collapsed ? 'justify-center' : ''}`}>
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-white text-xs font-bold uppercase">
                            {auth?.user?.name ? auth.user.name.charAt(0) : 'A'}
                        </span>
                    </div>
                    {!collapsed && (
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate leading-tight">
                                {auth?.user?.name || 'Admin'}
                            </p>
                            <span className="inline-block text-[9px] font-black uppercase tracking-widest bg-primary-500/10 text-primary-600 dark:text-primary-400 px-1.5 py-0.5 rounded-md mt-0.5">
                                {auth?.roles?.[0] || 'admin'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Collapse toggle (desktop) ─────────── */}
            <div className="hidden lg:block px-3 pb-3 flex-shrink-0">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex items-center justify-center w-full py-2 rounded-lg text-slate-400 dark:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <HiOutlineChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
                    {!collapsed && <span className="ml-2 text-xs font-medium">Collapse</span>}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* ── Mobile toggle button ──────────────── */}
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-700"
            >
                <HiOutlineMenu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>

            {/* ── Mobile overlay ────────────────────── */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ── Mobile sidebar ────────────────────── */}
            <aside
                className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
                onClick={() => setMobileOpen(false)}
            >
                <SidebarContent />
            </aside>

            {/* ── Desktop sidebar ───────────────────── */}
            <aside
                className={`hidden lg:block fixed inset-y-0 left-0 z-30 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300
                    ${collapsed ? 'w-[70px]' : 'w-64'}
                `}
            >
                <SidebarContent />
            </aside>
        </>
    );
}
