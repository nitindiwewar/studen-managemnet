import React from "react";
import { Search, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCourse: string;
  setSelectedCourse: (course: string) => void;
  sortBy: string;
  setSortBy: (field: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  courses: string[];
  onReset: () => void;
}

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  selectedCourse,
  setSelectedCourse,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  courses,
  onReset,
}: SearchBarProps) {
  const isFiltered = searchQuery !== "" || selectedCourse !== "" || sortBy !== "name" || sortOrder !== "asc";

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search students by name, email, or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-sm font-medium outline-none transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dynamic Controls Grid */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Course Filter */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-600 outline-none border-none cursor-pointer py-1 pr-4"
            >
              <option value="">All Courses</option>
              {courses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Field */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-600 outline-none border-none cursor-pointer py-1 pr-4"
            >
              <option value="name">Sort by Name</option>
              <option value="marks">Sort by Average Marks</option>
            </select>
          </div>

          {/* Sort Order Toggle */}
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="bg-slate-50 border border-slate-200 hover:bg-slate-100 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 cursor-pointer select-none transition-all"
          >
            {sortOrder === "asc" ? "Ascending (A-Z)" : "Descending (Z-A)"}
          </button>

          {/* Clear Button */}
          {isFiltered && (
            <button
              onClick={onReset}
              className="flex items-center space-x-1 hover:bg-red-50 text-red-600 border border-transparent hover:border-red-100 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
