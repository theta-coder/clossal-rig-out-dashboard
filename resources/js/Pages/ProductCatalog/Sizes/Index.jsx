import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import DashboardLayout from '../../../Components/DashboardLayout';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiX } from 'react-icons/hi';

export default function SizesIndex({ sizes }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSize, setEditingSize] = useState(null);
    const [formData, setFormData] = useState({ name: '' });

    const openModal = (size = null) => {
        if (size) {
            setEditingSize(size);
            setFormData({ name: size.name });
        } else {
            setEditingSize(null);
            setFormData({ name: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSize(null);
        setFormData({ name: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingSize) {
            router.put(`/sizes/${editingSize.id}`, formData, {
                onSuccess: () => closeModal(),
            });
        } else {
            router.post('/sizes', formData, {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Delete Size?',
            text: "Products linked to this size might be affected.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/sizes/${id}`);
            }
        });
    };

    return (
        <DashboardLayout title="Master Sizes">
            <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage global product sizes (S, M, L, etc.)</p>
                <button
                    onClick={() => openModal()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-primary-500/25"
                >
                    <HiOutlinePlus className="w-4 h-4" /> Add Size
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700/50">
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">ID</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Size Name</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {sizes.map((size) => (
                            <tr key={size.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{size.id}</td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white uppercase">{size.name}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => openModal(size)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <HiOutlinePencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(size.id)}
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
                            <h3 className="text-xl font-bold dark:text-white uppercase tracking-tight">{editingSize ? 'Edit Size' : 'Add New Size'}</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-black dark:hover:text-white"><HiX className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-6">
                                <label className="block text-sm font-black uppercase tracking-widest text-gray-500 mb-2">Size Code (e.g. XL)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 transition-all dark:text-white font-bold"
                                    placeholder="Enter size code..."
                                />
                            </div>
                            <div className="flex gap-3 mt-8">
                                <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-900 transition-all shadow-lg">Save Size</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}








