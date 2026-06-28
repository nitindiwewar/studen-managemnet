import React from "react";
import { GraduationCap, Plus, Search, FolderOpen, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  iconType?: "search" | "students";
}

export default function EmptyState({
  title = "No data found",
  description = "There are no records to display matching your criteria.",
  actionLabel,
  onAction,
  iconType = "students",
}: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center p-10 md:p-14 text-center bg-white dark:bg-[#121b2d] rounded-2xl border border-dashed border-slate-200/80 dark:border-slate-800 shadow-sm min-h-[400px] max-w-lg mx-auto relative overflow-hidden"
    >
      {/* Dynamic Background Glowing Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Illustrative Animated Icon Container */}
      <div className="relative mb-6">
        <motion.div
          animate={{ 
            y: [0, -6, 0],
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30 shadow-sm relative z-10"
        >
          {iconType === "search" ? (
            <Search className="w-9 h-9" />
          ) : (
            <GraduationCap className="w-10 h-10" />
          )}
        </motion.div>

        {/* Floating Secondary Decorative Icons */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1 -right-1 w-6 h-6 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 shadow-sm"
        >
          <FolderOpen className="w-3.5 h-3.5" />
        </motion.div>
        
        <div className="absolute -bottom-1.5 -left-1.5 w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <span className="text-[10px] font-bold">+</span>
        </div>
      </div>

      {/* Heading & Subtitle */}
      <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 tracking-tight mb-2.5 z-10">
        {title}
      </h3>
      <p className="text-xs text-slate-400 dark:text-slate-400 font-semibold mb-8 max-w-sm leading-relaxed z-10">
        {description}
      </p>

      {/* Elegant Action Button */}
      {actionLabel && onAction && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAction}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 transition-all z-10 cursor-pointer"
        >
          {iconType === "students" && <Plus className="w-4 h-4" />}
          <span>{actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5 opacity-80" />
        </motion.button>
      )}
    </motion.div>
  );
}
