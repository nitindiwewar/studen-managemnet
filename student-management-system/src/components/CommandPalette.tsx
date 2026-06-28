import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Search, GraduationCap, LayoutDashboard, Plus, Moon, Sun, ArrowRight, CornerDownLeft, Sparkles } from "lucide-react";
import { StudentService } from "../services/studentService";
import { Student } from "../types";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  toggleDark: () => void;
}

export default function CommandPalette({ isOpen, onClose, isDark, toggleDark }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setActiveIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Search API Call with simple Debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await StudentService.getStudents({ search: query, limit: 5 });
        setResults(data.students);
        setActiveIndex(0);
      } catch (err) {
        console.error("Command palette search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Navigation Links
  const navItems = [
    { label: "Go to Dashboard", path: "/", icon: LayoutDashboard, category: "Navigation" },
    { label: "View Student Directory", path: "/students", icon: GraduationCap, category: "Navigation" },
    { label: "Enroll New Student", path: "/students/add", icon: Plus, category: "Navigation" },
  ];

  // Quick Action Utilities
  const actions = [
    {
      label: `Switch to ${isDark ? "Light" : "Dark"} Mode`,
      action: () => {
        toggleDark();
        onClose();
      },
      icon: isDark ? Sun : Moon,
      category: "Preferences",
    },
  ];

  // Combined searchable list for keyboard index navigation
  const visibleNavs = query.trim() ? [] : navItems;
  const visibleActions = query.trim() ? [] : actions;
  const totalItemsCount = visibleNavs.length + visibleActions.length + results.length;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % totalItemsCount);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + totalItemsCount) % totalItemsCount);
    } else if (e.key === "Enter") {
      e.preventDefault();
      triggerSelected();
    }
  };

  const triggerSelected = () => {
    if (totalItemsCount === 0) return;

    if (!query.trim()) {
      // Standard static commands when input is empty
      if (activeIndex < visibleNavs.length) {
        navigate(visibleNavs[activeIndex].path);
        onClose();
      } else {
        const actionIdx = activeIndex - visibleNavs.length;
        if (visibleActions[actionIdx]) {
          visibleActions[actionIdx].action();
        }
      }
    } else {
      // Dynamic student matching results
      const selectedStudent = results[activeIndex];
      if (selectedStudent) {
        navigate(`/students/details/${selectedStudent.id}`);
        onClose();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 md:p-20" onKeyDown={handleKeyDown}>
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative mx-auto max-w-xl overflow-hidden rounded-2xl bg-white dark:bg-[#121b2d] border border-slate-200/80 dark:border-slate-800 shadow-2xl mt-10 md:mt-16"
          >
            {/* Input Header */}
            <div className="flex items-center space-x-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search students, navigate pages, or enter commands..."
                className="flex-1 bg-transparent border-0 outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm focus:ring-0 w-full"
              />
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400">ESC</span>
              </div>
            </div>

            {/* Results Section */}
            <div className="max-h-96 overflow-y-auto p-2 space-y-1">
              {loading && results.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400 font-semibold flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                  <span>Searching student database...</span>
                </div>
              )}

              {!loading && query.trim() && results.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400 font-semibold space-y-1">
                  <p>No matching student records found</p>
                  <p className="text-[10px] font-medium text-slate-400/80">Try entering a different name or email</p>
                </div>
              )}

              {/* Suggestions when input is empty */}
              {!query.trim() && (
                <>
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Quick Navigation
                  </div>
                  {visibleNavs.map((item, idx) => {
                    const isSelected = activeIndex === idx;
                    return (
                      <button
                        key={item.label}
                        onClick={() => {
                          navigate(item.path);
                          onClose();
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all text-xs font-semibold ${
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {isSelected && (
                          <div className="flex items-center space-x-1 text-[10px] text-blue-500 font-bold">
                            <span>Go</span>
                            <CornerDownLeft className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}

                  <div className="px-3 py-1.5 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Commands & Preferences
                  </div>
                  {visibleActions.map((item, idx) => {
                    const actualIdx = visibleNavs.length + idx;
                    const isSelected = activeIndex === actualIdx;
                    return (
                      <button
                        key={item.label}
                        onClick={item.action}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all text-xs font-semibold ${
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {isSelected && (
                          <div className="flex items-center space-x-1 text-[10px] text-blue-500 font-bold">
                            <span>Run</span>
                            <CornerDownLeft className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </>
              )}

              {/* Search Results */}
              {query.trim() && results.length > 0 && (
                <>
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Student Matches</span>
                    <span className="text-[9px] font-medium text-slate-400/60 lowercase">({results.length} found)</span>
                  </div>
                  {results.map((student, idx) => {
                    const isSelected = activeIndex === idx;
                    return (
                      <button
                        key={student.id}
                        onClick={() => {
                          navigate(`/students/details/${student.id}`);
                          onClose();
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200/80 dark:border-slate-700 bg-slate-50 p-0.5"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate leading-tight">{student.name}</p>
                            <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">{student.course} • {student.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 px-1.5 py-0.5 rounded uppercase">
                            View Profile
                          </span>
                          {isSelected && <ArrowRight className="w-3.5 h-3.5 text-blue-500" />}
                        </div>
                      </button>
                    );
                  })}
                </>
              )}
            </div>

            {/* Command Palette Footer */}
            <div className="bg-slate-50 dark:bg-slate-900/40 px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-semibold flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <span className="px-1 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">↑↓</span>
                  <span>to navigate</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="px-1 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">Enter</span>
                  <span>to select</span>
                </span>
              </div>
              <div className="flex items-center space-x-1 text-slate-400">
                <Sparkles className="w-3 h-3 text-blue-500" />
                <span>Spotlight Command Bar</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
