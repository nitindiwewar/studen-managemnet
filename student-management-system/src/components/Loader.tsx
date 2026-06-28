import React from "react";

interface LoaderProps {
  type?: "spinner" | "skeleton-card" | "skeleton-table" | "skeleton-details";
  count?: number;
}

export default function Loader({ type = "spinner", count = 3 }: LoaderProps) {
  if (type === "skeleton-details") {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Back and Action Buttons Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="h-4 bg-slate-200 rounded w-40" />
          <div className="flex items-center space-x-2">
            <div className="h-9 bg-slate-200 rounded-xl w-28" />
            <div className="h-9 bg-slate-200 rounded-xl w-32" />
          </div>
        </div>

        {/* Grid Layout Container Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card Skeleton */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-slate-200" />
              <div className="space-y-2 w-full flex flex-col items-center">
                <div className="h-5 bg-slate-200 rounded w-1/2" />
                <div className="h-3 bg-slate-200 rounded w-1/3" />
              </div>
              <div className="h-6 bg-slate-200 rounded-full w-36" />
            </div>

            <div className="border-t border-slate-50 pt-5 space-y-3.5">
              <div className="flex justify-between">
                <div className="h-3 bg-slate-200 rounded w-12" />
                <div className="h-3 bg-slate-200 rounded w-16" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 bg-slate-200 rounded w-14" />
                <div className="h-3 bg-slate-200 rounded w-12" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 bg-slate-200 rounded w-12" />
                <div className="h-3 bg-slate-200 rounded w-14" />
              </div>
            </div>
          </div>

          {/* Right Column: Academic Details Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
              <div className="h-5 bg-slate-200 rounded w-40" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-12" />
                    <div className="h-5 bg-slate-200 rounded w-16" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="h-5 bg-slate-200 rounded w-48" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-slate-50">
                    <div className="h-4 bg-slate-200 rounded w-24" />
                    <div className="h-4 bg-slate-200 rounded w-12" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "skeleton-card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse space-y-4"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-2/3" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <div className="h-3 bg-slate-200 rounded w-5/6" />
              <div className="h-3 bg-slate-200 rounded w-4/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "skeleton-table") {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
        <div className="p-5 border-b border-slate-100 flex justify-between">
          <div className="h-5 bg-slate-200 rounded w-1/4" />
          <div className="h-5 bg-slate-200 rounded w-1/6" />
        </div>
        <div className="divide-y divide-slate-100">
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="p-5 flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-3 w-1/4">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
                <div className="space-y-1 w-full">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
              <div className="h-4 bg-slate-200 rounded w-1/6" />
              <div className="h-4 bg-slate-200 rounded w-1/12" />
              <div className="h-4 bg-slate-200 rounded w-1/6" />
              <div className="h-4 bg-slate-200 rounded w-12" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[300px] space-y-3">
      <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-slate-500 text-sm font-medium animate-pulse">Loading data, please wait...</p>
    </div>
  );
}
