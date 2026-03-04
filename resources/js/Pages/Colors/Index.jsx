import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import DashboardLayout from '../../Components/DashboardLayout';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiX } from 'react-icons/hi';

export default function ColorsIndex({ colors }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingColor, setEditingColor] = useState(null);
    const [formData, setFormData] = useState({ name: '', code: '#000000' });

    const openModal = (color = null) => {
        if (color) {
            setEditingColor(color);
            setFormData({ name: color.name, code: color.code || '#000000' });
        } else {
            setEditingColor(null);
            setFormData({ name: '', code: '#000000' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingColor(null);
        setFormData({ name: '', code: '#000000' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingColor) {
            router.put(`/colors/${editingColor.id}`, formData, {
                onSuccess: () => closeModal(),
            });
        } else {
            router.post('/colors', formData, {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Delete Color?',
            text: "This will remove this color globally.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/colors/${id}`);
            }
        });
    };

    return (
        <DashboardLayout title="Master Colors">
            <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage global product colors (Black, Red, etc.)</p>
                <button
                    onClick={() => openModal()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-primary-500/25"
                >
                    <HiOutlinePlus className="w-4 h-4" /> Add Color
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700/50">
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Preview</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Color Name</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Hex Code</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {colors.map((color) => (
                            <tr key={color.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="w-8 h-8 rounded-full border border-gray-200" style={{ backgroundColor: color.code }}></div>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white uppercase">{color.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-mono tracking-tighter">{color.code}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => openModal(color)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <HiOutlinePencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(color.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <HiOutlineTrash className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-xl font-bold dark:text-white uppercase tracking-tight">{editingColor ? 'Edit Color' : 'Add New Color'}</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-black dark:hover:text-white"><HiX className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-black uppercase tracking-widest text-gray-500 mb-2">Color Name (e.g. Jet Black)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 transition-all dark:text-white font-bold"
                                    placeholder="Enter color name..."
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-black uppercase tracking-widest text-gray-500 mb-2">HEX Code</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        className="w-12 h-12 border-none bg-transparent cursor-pointer p-0 overflow-hidden rounded-full shadow-sm"
                                    />
                                    <input
                                        type="text"
                                        required
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        className="flex-1 bg-gray-50 dark:bg-gray-900 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 transition-all dark:text-white font-mono uppercase"
                                        placeholder="#000000"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-8">
                                <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-900 transition-all shadow-lg">Save Color</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
