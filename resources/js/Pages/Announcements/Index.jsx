import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import DashboardLayout from '../../Components/DashboardLayout';
import Swal from 'sweetalert2';
import {
    HiOutlineSpeakerphone,
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineX,
    HiOutlineCheck,
} from 'react-icons/hi';

export default function AnnouncementsIndex({ announcements }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        message: '',
        link_text: '',
        link_url: '',
        is_active: false
    });

    const openCreateModal = () => {
        setEditingAnnouncement(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (ann) => {
        setEditingAnnouncement(ann);
        setData({
            message: ann.message,
            link_text: ann.link_text || '',
            link_url: ann.link_url || '',
            is_active: ann.is_active
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingAnnouncement) {
            put(`/announcements/${editingAnnouncement.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    Swal.fire('Updated!', 'Announcement has been updated.', 'success');
                }
            });
        } else {
            post('/announcements', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    Swal.fire('Created!', 'Announcement has been created.', 'success');
                }
            });
        }
    };

    const toggleStatus = (ann) => {
        router.put(`/announcements/${ann.id}/toggle`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire('Updated!', 'Announcement status has been updated.', 'success');
            }
        });
    };

    const deleteAnnouncement = (ann) => {
        Swal.fire({
            title: 'Delete Announcement?',
            text: `Are you sure you want to delete this announcement?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/announcements/${ann.id}`, {
                    onSuccess: () => Swal.fire('Deleted!', 'Announcement has been removed.', 'success')
                });
            }
        });
    };

    return (
        <DashboardLayout title="Announcements">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <HiOutlineSpeakerphone className="w-8 h-8 text-primary-500" />
                        Announcement Banner
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage the top banner announcements shown on the website</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-white rounded-2xl shadow-lg shadow-primary-500/25 transition-all active:scale-95 font-bold text-sm tracking-wide uppercase"
                >
                    <HiOutlinePlus className="w-5 h-5" />
                    New Announcement
                </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-none">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Message</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Link</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                            {announcements.length > 0 ? announcements.map((ann) => (
                                <tr key={ann.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{ann.message}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        {ann.link_text ? (
                                            <a href={ann.link_url} target="_blank" rel="noreferrer" className="text-sm text-primary-500 hover:underline">
                                                {ann.link_text}
                                            </a>
                                        ) : (
                                            <span className="text-sm text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5">
                                        <button
                                            onClick={() => toggleStatus(ann)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${ann.is_active ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${ann.is_active ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                        {ann.is_active && (
                                            <span className="ml-3 text-xs font-bold text-primary-500 uppercase">Active</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(ann)}
                                                className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-primary-500 hover:border-primary-500 transition-all active:scale-90"
                                            >
                                                <HiOutlinePencil className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => deleteAnnouncement(ann)}
                                                className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-red-500 hover:border-red-500 transition-all active:scale-90"
                                            >
                                                <HiOutlineTrash className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No announcements found. Create one!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                        <div className="p-8 pb-4 flex items-center justify-between">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                                {editingAnnouncement ? 'Edit' : 'Create'} Announcement
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
                            >
                                <HiOutlineX className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-5">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Message Text</label>
                                <input
                                    type="text"
                                    value={data.message}
                                    onChange={e => setData('message', e.target.value)}
                                    placeholder="e.g. Free shipping on all orders over PKR 5,000"
                                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary-500 outline-none transition-all font-medium text-gray-900 dark:text-white"
                                    required
                                />
                                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Link Text (Optional)</label>
                                    <input
                                        type="text"
                                        value={data.link_text}
                                        onChange={e => setData('link_text', e.target.value)}
                                        placeholder="e.g. Shop Now"
                                        className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary-500 outline-none transition-all font-medium text-gray-900 dark:text-white"
                                    />
                                    {errors.link_text && <p className="text-red-500 text-xs mt-1">{errors.link_text}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Link URL (Optional)</label>
                                    <input
                                        type="text"
                                        value={data.link_url}
                                        onChange={e => setData('link_url', e.target.value)}
                                        placeholder="e.g. /shop or https://..."
                                        className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary-500 outline-none transition-all font-medium text-gray-900 dark:text-white"
                                    />
                                    {errors.link_url && <p className="text-red-500 text-xs mt-1">{errors.link_url}</p>}
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="relative flex items-center justify-center w-6 h-6 bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg">
                                        <input
                                            type="checkbox"
                                            className="opacity-0 absolute w-full h-full cursor-pointer"
                                            checked={data.is_active}
                                            onChange={e => setData('is_active', e.target.checked)}
                                        />
                                        {data.is_active && <HiOutlineCheck className="w-5 h-5 text-primary-500 absolute" />}
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Set as Active Announcement</span>
                                </label>
                                <p className="text-xs text-gray-500 mt-1 ml-9">Only one announcement can be active at a time. This will hide the others.</p>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-white font-black uppercase tracking-widest shadow-xl shadow-primary-500/25 transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {editingAnnouncement ? 'Save Changes' : 'Publish'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
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
