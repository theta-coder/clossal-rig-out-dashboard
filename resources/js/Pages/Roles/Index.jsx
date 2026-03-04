import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import DashboardLayout from '../../Components/DashboardLayout';
import Swal from 'sweetalert2';
import {
    HiOutlineShieldCheck,
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineCheck,
    HiOutlineX,
    HiOutlineIdentification,
    HiOutlineLockClosed
} from 'react-icons/hi';

export default function RolesIndex({ roles, permissions }) {
    const groupedPermissions = permissions.reduce((acc, perm) => {
        if (perm.name === 'dashboard_access') {
            if (!acc['System']) acc['System'] = [];
            acc['System'].push(perm);
            return acc;
        }
        const parts = perm.name.split('_');
        const module = parts.slice(1).join(' ');
        const groupName = module ? module.charAt(0).toUpperCase() + module.slice(1) : 'Other';

        if (!acc[groupName]) acc[groupName] = [];
        acc[groupName].push(perm);
        return acc;
    }, {});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        permissions: []
    });

    const openCreateModal = () => {
        setEditingRole(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (role) => {
        setEditingRole(role);
        setData({
            name: role.name,
            permissions: role.permissions.map(p => p.name)
        });
        setIsModalOpen(true);
    };

    const togglePermission = (permName) => {
        const current = [...data.permissions];
        if (current.includes(permName)) {
            setData('permissions', current.filter(p => p !== permName));
        } else {
            setData('permissions', [...current, permName]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingRole) {
            put(`/roles/${editingRole.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    Swal.fire('Updated!', 'Role has been updated.', 'success');
                }
            });
        } else {
            post('/roles', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    Swal.fire('Created!', 'Role has been created.', 'success');
                }
            });
        }
    };

    const deleteRole = (role) => {
        if (role.name === 'admin') {
            return Swal.fire('Error', 'Cannot delete the admin role!', 'error');
        }

        Swal.fire({
            title: 'Delete Role?',
            text: `Are you sure you want to delete "${role.name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/roles/${role.id}`, {
                    onSuccess: () => Swal.fire('Deleted!', 'Role has been removed.', 'success')
                });
            }
        });
    };

    return (
        <DashboardLayout title="Dynamic Roles & Permissions">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <HiOutlineLockClosed className="w-8 h-8 text-primary-500" />
                        Access Control List
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage system roles and their assigned permissions</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-white rounded-2xl shadow-lg shadow-primary-500/25 transition-all active:scale-95 font-bold text-sm tracking-wide uppercase"
                >
                    <HiOutlinePlus className="w-5 h-5" />
                    Create New Role
                </button>
            </div>

            {/* Roles Table */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-none">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Role Identity</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Capabilities</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                            {roles.map((role) => (
                                <tr key={role.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 rounded-xl bg-primary-100 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 ring-4 ring-primary-50 dark:ring-primary-500/5">
                                                <HiOutlineShieldCheck className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <span className="text-lg font-bold text-gray-900 dark:text-white capitalize">{role.name}</span>
                                                <p className="text-[10px] uppercase font-black tracking-tighter text-gray-400 mt-0.5">ID: {role.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-wrap gap-1.5 max-w-2xl">
                                            {role.permissions.length > 0 ? (
                                                <>
                                                    {role.permissions.slice(0, 8).map(p => (
                                                        <span key={p.id} className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-100 dark:border-emerald-500/20">
                                                            {p.name.split('_')[0]} {p.name.split('_').slice(1).join(' ')}
                                                        </span>
                                                    ))}
                                                    {role.permissions.length > 8 && (
                                                        <span className="px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                                                            +{role.permissions.length - 8} more
                                                        </span>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">No permissions assigned</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(role)}
                                                className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-primary-500 hover:border-primary-500 transition-all active:scale-90"
                                            >
                                                <HiOutlinePencil className="w-5 h-5" />
                                            </button>
                                            {role.name !== 'admin' && (
                                                <button
                                                    onClick={() => deleteRole(role)}
                                                    className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-red-500 hover:border-red-500 transition-all active:scale-90"
                                                >
                                                    <HiOutlineTrash className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 transform transition-all scale-100 opacity-100">
                        <div className="p-8 pb-4 flex items-center justify-between">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                                {editingRole ? 'Modify' : 'Create'} Role
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
                            >
                                <HiOutlineX className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 pt-0">
                            <div className="mb-8">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Role Name</label>
                                <div className="relative">
                                    <HiOutlineIdentification className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Enter role name (e.g. Manager)"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all font-bold text-gray-900 dark:text-white"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        required
                                        disabled={editingRole?.name === 'admin'}
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1 absolute">{errors.name}</p>}
                                </div>
                            </div>

                            <div className="mb-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                <div className="sticky top-0 bg-white dark:bg-gray-900 pb-2 z-10">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Permissions Assignment</label>
                                </div>
                                <div className="space-y-6 mt-2">
                                    {Object.entries(groupedPermissions).map(([group, perms]) => (
                                        <div key={group}>
                                            <h4 className="text-xs font-black text-gray-900 dark:text-white mb-3 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 pb-2">{group}</h4>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                {perms.map(perm => (
                                                    <button
                                                        key={perm.id}
                                                        type="button"
                                                        onClick={() => togglePermission(perm.name)}
                                                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all duration-300 border-2
                                                            ${data.permissions.includes(perm.name)
                                                                ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/20'
                                                                : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-500 hover:border-primary-500 hover:text-primary-500'
                                                            }`}
                                                    >
                                                        <span className="truncate">{perm.name.split('_')[0]}</span>
                                                        {data.permissions.includes(perm.name) ? <HiOutlineCheck className="w-3.5 h-3.5 shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-current opacity-20" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 py-5 rounded-[1.5rem] bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-white font-black uppercase tracking-widest shadow-xl shadow-primary-500/25 transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {editingRole ? 'Save Changes' : 'Launch New Role'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-8 py-5 rounded-[1.5rem] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
