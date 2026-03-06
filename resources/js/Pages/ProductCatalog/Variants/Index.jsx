import React, { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import DashboardLayout from '../../../Components/DashboardLayout';
import DataTable from '../../../Components/DataTable';
import { HiOutlineTrash, HiOutlinePencil, HiOutlinePlus, HiOutlineX } from 'react-icons/hi';

const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm";

function VariantModal({ product, available_sizes, available_colors, variant, onClose }) {
    const isEdit = !!variant;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        size_id:    variant?.size_id   ?? '',
        color_id:   variant?.color_id  ?? '',
        sku:        variant?.sku       ?? '',
        barcode:    variant?.barcode   ?? '',
        stock:      variant?.stock     ?? 0,
        price:      variant?.price     ?? '',
        weight:     variant?.weight    ?? '',
        is_active:  variant?.is_active ?? true,
        images:     [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = isEdit
            ? `/products/${product.id}/variants/${variant.id}`
            : `/products/${product.id}/variants`;

        const options = { onSuccess: () => { reset(); onClose(); } };

        if (isEdit) {
            router.post(url, { ...data, _method: 'PUT' }, options);
        } else {
            post(url, options);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 w-full max-w-lg shadow-2xl">
                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                        {isEdit ? 'Edit Variant' : 'Add Variant'}
                    </h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <HiOutlineX className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Size</label>
                            <select value={data.size_id} onChange={e => setData('size_id', e.target.value)} className={inputClass}>
                                <option value="">— No Size —</option>
                                {available_sizes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Color</label>
                            <select value={data.color_id} onChange={e => setData('color_id', e.target.value)} className={inputClass}>
                                <option value="">— No Color —</option>
                                {available_colors.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">SKU</label>
                            <input type="text" value={data.sku} onChange={e => setData('sku', e.target.value)} placeholder="e.g. SHIRT-RED-L" className={inputClass} />
                            {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Barcode</label>
                            <input type="text" value={data.barcode} onChange={e => setData('barcode', e.target.value)} placeholder="Optional" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Stock <span className="text-red-400">*</span></label>
                            <input type="number" min="0" value={data.stock} onChange={e => setData('stock', e.target.value)} className={inputClass} />
                            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Price Override</label>
                            <input type="number" step="0.01" min="0" value={data.price} onChange={e => setData('price', e.target.value)} placeholder="Leave blank to use product price" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Weight (kg)</label>
                            <input type="number" step="0.01" min="0" value={data.weight} onChange={e => setData('weight', e.target.value)} placeholder="Optional" className={inputClass} />
                        </div>
                        <div className="flex items-end pb-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Images</label>
                        <input type="file" multiple accept="image/*" onChange={e => setData('images', e.target.files)} className="w-full text-sm text-gray-600 dark:text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-primary-50 file:text-primary-600 dark:file:bg-primary-500/10 dark:file:text-primary-400 hover:file:bg-primary-100" />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={processing} className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 disabled:opacity-50 transition-all">
                            {processing ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Variant'}
                        </button>
                        <button type="button" onClick={onClose} className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function VariantsIndex({ product, available_sizes, available_colors }) {
    const [modal, setModal] = useState(null); // null | 'add' | variant object

    const columns = [
        { data: 'id', title: 'ID' },
        {
            data: 'image', title: 'Image', render: (val) => val
                ? <img src={val} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-gray-800" />
                : <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800" />
        },
        { data: 'sku', title: 'SKU', render: (val) => <span className="font-mono text-xs">{val}</span> },
        { data: 'size', title: 'Size' },
        {
            data: 'color', title: 'Color', render: (val, row) => (
                <div className="flex items-center gap-2">
                    {row.color_code && <span className="w-3 h-3 rounded-full inline-block border border-gray-200" style={{ backgroundColor: row.color_code }} />}
                    <span>{val}</span>
                </div>
            )
        },
        { data: 'stock', title: 'Stock', render: (val) => <span className={`font-mono font-medium ${val <= 5 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>{val}</span> },
        { data: 'price', title: 'Price' },
        {
            data: 'is_active', title: 'Status', render: (val) => (
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${val === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>{val}</span>
            )
        },
    ];

    return (
        <DashboardLayout title={`Variants — ${product.name}`}>
            {modal && (
                <VariantModal
                    product={product}
                    available_sizes={available_sizes}
                    available_colors={available_colors}
                    variant={modal === 'add' ? null : modal}
                    onClose={() => setModal(null)}
                />
            )}

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <Link href="/products" className="text-sm text-primary-500 hover:text-primary-600">← Back to Products</Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage size/color variants for <span className="font-medium text-gray-700 dark:text-gray-300">{product.name}</span></p>
                </div>
                <button
                    onClick={() => setModal('add')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/25 transition-all"
                >
                    <HiOutlinePlus className="w-4 h-4" /> Add Variant
                </button>
            </div>

            <DataTable
                url={`/products/${product.id}/variants`}
                columns={columns}
                actions={(row) => (
                    <>
                        <button
                            onClick={() => setModal(row)}
                            className="p-2 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 transition-colors"
                        >
                            <HiOutlinePencil className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => {
                                Swal.fire({
                                    title: 'Delete Variant?',
                                    text: 'This will also delete all variant images.',
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#d33',
                                    cancelButtonColor: '#3085d6',
                                    confirmButtonText: 'Yes, delete it!',
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        router.delete(`/products/${product.id}/variants/${row.id}`);
                                    }
                                });
                            }}
                            className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
                        >
                            <HiOutlineTrash className="w-4 h-4" />
                        </button>
                    </>
                )}
            />
        </DashboardLayout>
    );
}
