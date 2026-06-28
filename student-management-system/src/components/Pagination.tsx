import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  limit: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalRecords,
  onPageChange,
  limit,
}: PaginationProps) {
  if (totalPages <= 1) {
    if (totalRecords === 0) return null;
    return (
      <div className="flex items-center justify-between p-5 border-t border-slate-100 bg-white">
        <p className="text-xs font-semibold text-slate-500">
          Showing <span className="font-bold text-slate-800">{totalRecords}</span> of{" "}
          <span className="font-bold text-slate-800">{totalRecords}</span> students
        </p>
      </div>
    );
  }

  const startIdx = (currentPage - 1) * limit + 1;
  const endIdx = Math.min(currentPage * limit, totalRecords);

  // Generate range of page numbers
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-t border-slate-100 bg-white rounded-b-2xl">
      {/* Records Info */}
      <p className="text-xs font-semibold text-slate-500">
        Showing <span className="font-bold text-slate-800">{startIdx}</span> to{" "}
        <span className="font-bold text-slate-800">{endIdx}</span> of{" "}
        <span className="font-bold text-slate-800">{totalRecords}</span> records
      </p>

      {/* Pages Controls */}
      <div className="flex items-center space-x-1.5">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {pages.map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`min-w-8 h-8 px-2 rounded-lg text-xs font-bold transition-all ${
                currentPage === p
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-100"
                  : "border border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
