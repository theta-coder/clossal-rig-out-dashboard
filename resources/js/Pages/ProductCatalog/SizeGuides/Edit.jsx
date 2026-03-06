import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import DashboardLayout from '../../../Components/DashboardLayout';
import { HiOutlineArrowLeft, HiOutlineSave, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';

export default function SizeGuidesEdit({ sizeGuide, categories }) {
    const { data, setData, put, processing, errors } = useForm({
        name: sizeGuide.name || '',
        category_id: sizeGuide.category_id || '',
        columns: sizeGuide.columns || ['Size', 'Chest', 'Length', 'Shoulder', 'Sleeve'],
        rows: sizeGuide.rows.map(row => ({
            size_label: row.size_label || '',
            measurements: row.measurements || {}
        })),
    });

    const addColumn = () => {
        const colName = prompt('Enter column name:');
        if (colName && !data.columns.includes(colName)) {
            const newCols = [...data.columns, colName];
            const newRows = data.rows.map(row => ({
                ...row,
                measurements: { ...row.measurements, [colName]: '' }
            }));
            setData(d => ({ ...d, columns: newCols, rows: newRows }));
        }
    };

    const removeColumn = (colName) => {
        if (colName === 'Size') return;
        const newCols = data.columns.filter(c => c !== colName);
        const newRows = data.rows.map(row => {
            const newMeas = { ...row.measurements };
            delete newMeas[colName];
            return { ...row, measurements: newMeas };
        });
        setData(d => ({ ...d, columns: newCols, rows: newRows }));
    };

    const addRow = () => {
        const newMeas = {};
        data.columns.filter(c => c !== 'Size').forEach(c => newMeas[c] = '');
        setData('rows', [...data.rows, { size_label: '', measurements: newMeas }]);
    };

    const removeRow = (index) => {
        const newRows = [...data.rows];
        newRows.splice(index, 1);
        setData('rows', newRows);
    };

    const updateRowLabel = (index, value) => {
        const newRows = [...data.rows];
        newRows[index].size_label = value;
        setData('rows', newRows);
    };

    const updateMeasurement = (rowIndex, colName, value) => {
        const newRows = [...data.rows];
        newRows[rowIndex].measurements[colName] = value;
        setData('rows', newRows);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('size-guides.update', sizeGuide.id));
    };

    return (
        <DashboardLayout title="Edit Size Guide">
            <Head title={`Edit - ${sizeGuide.name}`} />

            <div className="mb-6 flex items-center justify-between">
                <Link href={route('size-guides.index')} className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm font-medium">
                    <HiOutlineArrowLeft className="w-4 h-4" /> Back to Guides
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Chart Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Guide Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apply to Category</label>
                            <select
                                value={data.category_id}
                                onChange={e => setData('category_id', e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            {errors.category_id && <p className="mt-1 text-xs text-red-500">{errors.category_id}</p>}
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Measurement Table</h2>
                            <button
                                type="button"
                                onClick={addColumn}
                                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
                            >
                                Add Column
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={addRow}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400 rounded-lg text-xs font-bold hover:bg-primary-100 transition-colors"
                        >
                            <HiOutlinePlus className="w-4 h-4" /> Add Row
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-700/50">
                                    {data.columns.map((col, idx) => (
                                        <th key={idx} className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 group relative">
                                            {col}
                                            {col !== 'Size' && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeColumn(col)}
                                                    className="ml-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <HiOutlineTrash className="w-3 h-3 inline" />
                                                </button>
                                            )}
                                        </th>
                                    ))}
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {data.rows.map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                                        {data.columns.map((col, colIdx) => (
                                            <td key={colIdx} className="px-4 py-3">
                                                {col === 'Size' ? (
                                                    <input
                                                        type="text"
                                                        value={row.size_label}
                                                        onChange={e => updateRowLabel(index, e.target.value)}
                                                        className="w-16 px-2 py-1 rounded bg-transparent border border-gray-200 dark:border-gray-600 text-sm font-bold text-center"
                                                        placeholder="S"
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={row.measurements[col] || ''}
                                                        onChange={e => updateMeasurement(index, col, e.target.value)}
                                                        className="w-full px-2 py-1 rounded bg-transparent border border-gray-200 dark:border-gray-600 text-sm"
                                                        placeholder="-"
                                                    />
                                                )}
                                            </td>
                                        ))}
                                        <td className="px-4 py-3 text-right">
                                            {data.rows.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeRow(index)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
                                                >
                                                    <HiOutlineTrash className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/25 transition-all flex items-center justify-center gap-2"
                    >
                        <HiOutlineSave className="w-5 h-5" /> {processing ? 'Updating...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </DashboardLayout>
    );
}
