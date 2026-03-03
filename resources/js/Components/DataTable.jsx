import React, { useEffect, useRef, useState } from 'react';
import axiosLib from 'axios';
import { HiOutlineSearch, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

// Create a clean axios instance without Inertia interceptors
const http = axiosLib.create();

export default function DataTable({ url, columns, actions, refreshKey = 0 }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [sortCol, setSortCol] = useState(null);
    const [sortDir, setSortDir] = useState('asc');
    const debounceRef = useRef(null);
    const drawRef = useRef(1);

    const fetchData = async () => {
        setLoading(true);
        try {
            const draw = drawRef.current++;
            const params = {
                draw,
                start: page * perPage,
                length: perPage,
                'search[value]': search,
                'search[regex]': false,
            };

            columns.forEach((col, i) => {
                params[`columns[${i}][data]`] = col.data;
                params[`columns[${i}][name]`] = col.data;
                params[`columns[${i}][searchable]`] = col.searchable !== false;
                params[`columns[${i}][orderable]`] = col.orderable !== false;
            });

            if (sortCol !== null) {
                params['order[0][column]'] = sortCol;
                params['order[0][dir]'] = sortDir;
            }

            const response = await http.get(url, {
                params,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                }
            });

            setData(response.data.data || []);
            setTotalRecords(response.data.recordsFiltered || 0);
        } catch (err) {
            console.error('DataTable fetch error:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [page, perPage, sortCol, sortDir, refreshKey]);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setPage(0);
            fetchData();
        }, 400);
        return () => clearTimeout(debounceRef.current);
    }, [search]);

    const handleSort = (index) => {
        if (columns[index].orderable === false) return;
        if (sortCol === index) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortCol(index);
            setSortDir('asc');
        }
    };

    const totalPages = Math.ceil(totalRecords / perPage);

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2 w-full sm:w-auto">
                    <HiOutlineSearch className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 w-full sm:w-64"
                    />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>Show</span>
                    <select
                        value={perPage}
                        onChange={(e) => { setPerPage(Number(e.target.value)); setPage(0); }}
                        className="bg-gray-100 dark:bg-gray-800 border-none rounded-lg px-2 py-1 text-sm text-gray-700 dark:text-gray-300 outline-none cursor-pointer"
                    >
                        {[10, 25, 50, 100].map(n => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                    <span>entries</span>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                            {columns.map((col, i) => (
                                <th
                                    key={col.data}
                                    className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 whitespace-nowrap
                                        ${col.orderable !== false ? 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none' : ''}`}
                                    onClick={() => handleSort(i)}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.title}
                                        {sortCol === i && (
                                            <span className="text-primary-500">{sortDir === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {actions && (
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-12 text-center">
                                    <div className="flex items-center justify-center gap-2 text-gray-400">
                                        <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                                        <span>Loading...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-12 text-center text-gray-400">
                                    No records found
                                </td>
                            </tr>
                        ) : (
                            data.map((row, idx) => (
                                <tr key={row.id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    {columns.map((col) => (
                                        <td key={col.data} className="px-4 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                            {col.render ? col.render(row[col.data], row) : row[col.data]}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {actions(row)}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Showing {totalRecords === 0 ? 0 : page * perPage + 1} to {Math.min((page + 1) * perPage, totalRecords)} of {totalRecords} entries
                </p>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setPage(Math.max(0, page - 1))}
                        disabled={page === 0}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <HiOutlineChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i;
                        } else if (page < 3) {
                            pageNum = i;
                        } else if (page > totalPages - 4) {
                            pageNum = totalPages - 5 + i;
                        } else {
                            pageNum = page - 2 + i;
                        }
                        return (
                            <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all
                                    ${page === pageNum
                                        ? 'bg-primary-500 text-white shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                {pageNum + 1}
                            </button>
                        );
                    })}
                    <button
                        onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                        disabled={page >= totalPages - 1}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <HiOutlineChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
