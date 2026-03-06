import React, { useEffect, useMemo, useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import DashboardLayout from '../../Components/DashboardLayout';
import { HiOutlinePencil, HiOutlinePlus, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';

const toDateTimeInput = (value) => {
    if (!value) return '';
    const normalized = String(value).replace(' ', 'T');
    return normalized.slice(0, 16);
};

const buildDefaultState = (fields, row = null) => {
    const data = {};

    fields.forEach((field) => {
        const value = row ? row[field.name] : null;

        if (field.type === 'checkbox') {
            data[field.name] = Boolean(value);
            return;
        }

        if (field.type === 'datetime') {
            data[field.name] = value ? toDateTimeInput(value) : '';
            return;
        }

        data[field.name] = value ?? '';
    });

    return data;
};

const formatCellValue = (value, type) => {
    if (value === null || value === undefined || value === '') return '-';
    if (type === 'checkbox') return value ? 'Yes' : 'No';
    return String(value);
};

export default function ShoppingExperienceIndex({
    resources,
    activeResource,
    fields,
    columns,
    records,
    lookups,
    filters,
}) {
    const [search, setSearch] = useState(filters?.search || '');
    const [perPage, setPerPage] = useState(filters?.per_page || 15);
    const [editingId, setEditingId] = useState(null);

    const fieldMap = useMemo(() => {
        const map = {};
        fields.forEach((field) => {
            map[field.name] = field;
        });
        return map;
    }, [fields]);

    const { data, setData, post, put, processing, reset, clearErrors } = useForm(buildDefaultState(fields));

    useEffect(() => {
        setSearch(filters?.search || '');
        setPerPage(filters?.per_page || 15);
        setEditingId(null);
        setData(buildDefaultState(fields));
        clearErrors();
    }, [activeResource, fields, filters, setData, clearErrors]);

    const navigate = (params = {}) => {
        router.get(
            route('shopping-experience.index'),
            {
                resource: activeResource,
                search,
                per_page: perPage,
                ...params,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            }
        );
    };

    const switchResource = (resourceKey) => {
        router.get(
            route('shopping-experience.index'),
            { resource: resourceKey, per_page: perPage },
            { preserveScroll: true, preserveState: false }
        );
    };

    const startEdit = (row) => {
        setEditingId(row.id);
        setData(buildDefaultState(fields, row));
        clearErrors();
    };

    const cancelEdit = () => {
        setEditingId(null);
        reset();
        setData(buildDefaultState(fields));
        clearErrors();
    };

    const submit = (e) => {
        e.preventDefault();

        if (editingId) {
            put(route('shopping-experience.update', { resource: activeResource, id: editingId }), {
                preserveScroll: true,
                onSuccess: () => cancelEdit(),
            });
            return;
        }

        post(route('shopping-experience.store', { resource: activeResource }), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setData(buildDefaultState(fields));
                clearErrors();
            },
        });
    };

    const handleDelete = (id) => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;

        router.delete(route('shopping-experience.destroy', { resource: activeResource, id }), {
            preserveScroll: true,
        });
    };

    return (
        <DashboardLayout title="Shopping Experience">
            <div className="space-y-6">
                <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Resource Selector</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage carts, wishlists, search logs, and product views from one place.</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {resources.map((resource) => (
                            <button
                                key={resource.key}
                                type="button"
                                onClick={() => switchResource(resource.key)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    activeResource === resource.key
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                                }`}
                                title={resource.description}
                            >
                                {resource.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                        <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search records..."
                                    className="w-full md:w-64 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => navigate({ page: 1 })}
                                    className="px-3 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
                                >
                                    Search
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-500 dark:text-gray-400">Rows</label>
                                <select
                                    value={perPage}
                                    onChange={(e) => {
                                        const next = Number(e.target.value);
                                        setPerPage(next);
                                        router.get(
                                            route('shopping-experience.index'),
                                            { resource: activeResource, search, per_page: next, page: 1 },
                                            { preserveScroll: true, preserveState: true, replace: true }
                                        );
                                    }}
                                    className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-2 py-2 text-sm"
                                >
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-slate-800/60">
                                    <tr>
                                        {columns.map((column) => (
                                            <th key={column.key} className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-slate-300 whitespace-nowrap">
                                                {column.label}
                                            </th>
                                        ))}
                                        <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-slate-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-500 dark:text-slate-400">
                                                No records found.
                                            </td>
                                        </tr>
                                    ) : (
                                        records.data.map((row) => (
                                            <tr key={row.id} className="border-t border-gray-100 dark:border-slate-800">
                                                {columns.map((column) => (
                                                    <td key={`${row.id}-${column.key}`} className="px-4 py-3 text-gray-700 dark:text-slate-200 whitespace-nowrap">
                                                        {formatCellValue(row[column.key], fieldMap[column.key]?.type)}
                                                    </td>
                                                ))}
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-end gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => startEdit(row)}
                                                            className="p-2 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                                                            title="Edit"
                                                        >
                                                            <HiOutlinePencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(row.id)}
                                                            className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                                                            title="Delete"
                                                        >
                                                            <HiOutlineTrash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-sm text-gray-500 dark:text-slate-400">
                            <span>
                                Showing {records.from || 0} to {records.to || 0} of {records.total} records
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={records.current_page <= 1}
                                    onClick={() => navigate({ page: records.current_page - 1 })}
                                    className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 disabled:opacity-40"
                                >
                                    Prev
                                </button>
                                <span>
                                    Page {records.current_page} / {records.last_page}
                                </span>
                                <button
                                    type="button"
                                    disabled={records.current_page >= records.last_page}
                                    onClick={() => navigate({ page: records.current_page + 1 })}
                                    className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 disabled:opacity-40"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 h-fit">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                {editingId ? 'Update Record' : 'Create Record'}
                            </h3>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                                >
                                    <HiOutlineX className="w-4 h-4" /> Cancel
                                </button>
                            )}
                        </div>

                        <form onSubmit={submit} className="space-y-3">
                            {fields.map((field) => (
                                <div key={field.name}>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1">
                                        {field.label}
                                    </label>

                                    {field.type === 'select' ? (
                                        <select
                                            value={data[field.name] ?? ''}
                                            onChange={(e) => setData(field.name, e.target.value)}
                                            className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-3 py-2 text-sm"
                                        >
                                            <option value="">{field.nullable ? 'None' : 'Select option'}</option>
                                            {(lookups[field.options] || []).map((option) => (
                                                <option key={option.id} value={option.id}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : field.type === 'checkbox' ? (
                                        <label className="inline-flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={Boolean(data[field.name])}
                                                onChange={(e) => setData(field.name, e.target.checked)}
                                                className="rounded border-gray-300 dark:border-slate-700"
                                            />
                                            <span className="text-sm text-gray-600 dark:text-slate-300">Enabled</span>
                                        </label>
                                    ) : (
                                        <input
                                            type={field.type === 'datetime' ? 'datetime-local' : field.type === 'number' ? 'number' : 'text'}
                                            value={data[field.name] ?? ''}
                                            onChange={(e) => setData(field.name, e.target.value)}
                                            className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-3 py-2 text-sm"
                                        />
                                    )}
                                </div>
                            ))}

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors disabled:opacity-60"
                            >
                                <HiOutlinePlus className="w-4 h-4" />
                                {editingId ? 'Update' : 'Create'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
