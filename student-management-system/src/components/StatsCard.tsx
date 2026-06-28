import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  badge?: {
    text: string;
    type: "success" | "warning" | "info" | "neutral";
  };
  colorClassName?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  subtitle,
  badge,
  colorClassName = "bg-blue-500",
}: StatsCardProps) {
  const badgeColors = {
    success: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border border-amber-100",
    info: "bg-blue-50 text-blue-700 border border-blue-100",
    neutral: "bg-slate-50 text-slate-700 border border-slate-100",
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden group">
      {/* Visual top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${colorClassName}`} />

      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
          <h3 className="text-3xl font-bold text-slate-800 tracking-tight mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl bg-slate-50 text-slate-700 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
        <span className="text-xs text-slate-500 font-medium">{subtitle || "Aggregated System Data"}</span>
        {badge && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColors[badge.type]}`}>
            {badge.text}
          </span>
        )}
      </div>
    </div>
  );
}
