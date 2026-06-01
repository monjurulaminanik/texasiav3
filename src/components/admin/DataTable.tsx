"use client";

import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchKey: keyof T;
  searchPlaceholder?: string;
  actions?: (row: T) => React.ReactNode;
}

export default function DataTable<T>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  actions,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter based on search query
  const filteredData = data.filter((row) => {
    const val = row[searchKey];
    if (!val) return false;
    return String(val).toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Paginate data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className="space-y-4">
      {/* Search Input Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
            className="w-full bg-[#040d1a]/50 border border-[#0f2545] rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#d4a574] transition-premium"
          />
        </div>
        <div className="text-xs text-slate-400">
          Showing {Math.min(filteredData.length, (currentPage - 1) * itemsPerPage + 1)}-
          {Math.min(filteredData.length, currentPage * itemsPerPage)} of {filteredData.length} records
        </div>
      </div>

      {/* Table grid wrapper */}
      <div className="bg-[#081a33]/20 border border-[#0f2545] rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#081a33]/80 text-slate-400 border-b border-[#0f2545] font-semibold">
              <tr>
                {columns.map((col, index) => (
                  <th key={index} className={`px-6 py-4 ${col.className || ""}`}>
                    {col.header}
                  </th>
                ))}
                {actions && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0f2545]/30 bg-[#081a33]/10">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No records found matching criteria.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-[#0b2545]/20 transition-premium">
                    {columns.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className={`px-6 py-4 text-slate-300 font-medium ${col.className || ""}`}
                      >
                        {col.accessor(row)}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-6 py-4 text-right">{actions(row)}</td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-[#0f2545] bg-[#081a33]/40 cursor-pointer disabled:opacity-40 transition-premium"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <span className="text-xs text-slate-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-[#0f2545] bg-[#081a33]/40 cursor-pointer disabled:opacity-40 transition-premium"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
