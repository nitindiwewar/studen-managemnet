import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  GraduationCap,
  UserPlus,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  User,
  Sun,
  Moon
} from "lucide-react";
import CommandPalette from "../components/CommandPalette";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const menuItems = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "Students", path: "/students", icon: GraduationCap },
    { label: "Add Student", path: "/students/add", icon: UserPlus },
    { label: "Reports", path: "/reports", icon: BarChart3, badge: "Mock" },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  const handleLogout = () => {
    // Elegant standard toast/alert mock
    alert("You have logged out successfully (Session demonstration completed).");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* 1. SIDEBAR (DESKTOP) */}
      <aside className="hidden lg:flex flex-col w-64 bg-white text-slate-600 border-r border-slate-200/80 flex-shrink-0 z-30">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 space-x-3 bg-white">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            S
          </div>
          <span className="font-bold text-slate-800 text-base tracking-tight">
            EduPortal
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all group ${
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5"
                    : "hover:bg-slate-50 hover:text-slate-800 text-slate-500"
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <item.icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-400 border border-slate-200/60"}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Footer Account info */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-50 transition-all">
            <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
              ND
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-slate-800 truncate">Nitin Diwewar</h5>
              <span className="text-[10px] text-slate-400 font-semibold truncate block">Admin User</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2.5 px-4 py-2.5 mt-2 rounded-xl text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. MOBILE DRAWER NAVIGATION */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Sidebar Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative flex flex-col w-72 max-w-xs bg-white text-slate-600 h-full shadow-2xl z-10 border-r border-slate-200"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base">
                    S
                  </div>
                  <span className="font-bold text-slate-800 text-base tracking-tight">EduPortal</span>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Menu Items */}
              <motion.nav 
                initial="closed"
                animate="open"
                variants={{
                  open: {
                    transition: { staggerChildren: 0.04, delayChildren: 0.1 }
                  },
                  closed: {}
                }}
                className="flex-1 p-4 space-y-1.5 overflow-y-auto"
              >
                {menuItems.map((item) => {
                  const isActive =
                    item.path === "/"
                      ? location.pathname === "/"
                      : location.pathname.startsWith(item.path);

                  return (
                    <motion.div
                      key={item.label}
                      variants={{
                        open: { opacity: 1, x: 0 },
                        closed: { opacity: 0, x: -16 }
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all group ${
                          isActive
                            ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5"
                            : "hover:bg-slate-50 hover:text-slate-800 text-slate-500"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-400 border border-slate-200/60"}`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.nav>

              {/* Mobile Drawer Account Footer */}
              <div className="p-4 border-t border-slate-100">
                <div className="flex items-center space-x-3 p-2 rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                    ND
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-800 truncate">Nitin Diwewar</h5>
                    <span className="text-[10px] text-slate-400 font-semibold truncate block">Admin User</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2.5 px-4 py-2.5 mt-2 rounded-xl text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. MAIN WORKSPACE CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* TOP NAVBAR */}
        <header className="h-16 border-b border-slate-200/80 bg-white flex items-center justify-between px-6 z-20 flex-shrink-0">
          {/* Hamburger (Mobile) & Title */}
          <div className="flex items-center space-x-3.5">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
            >
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="text-sm font-bold text-slate-800 tracking-tight flex items-center space-x-2">
              <span className="hidden sm:inline-block text-slate-400 font-medium">EduPortal</span>
              <span className="hidden sm:inline-block text-slate-300">/</span>
              <span>Student Management</span>
            </h1>
          </div>

          {/* Utility Tools */}
          <div className="flex items-center space-x-4">
            {/* Quick search badge */}
            <div 
              onClick={() => setIsCommandOpen(true)}
              className="hidden md:flex items-center justify-between px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs text-slate-400 font-medium w-48 cursor-pointer transition-all"
            >
              <div className="flex items-center space-x-2">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>Search platform...</span>
              </div>
              <span className="text-[9px] bg-slate-200/60 dark:bg-slate-700/60 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400 font-bold">Ctrl K</span>
            </div>

            {/* Notifications */}
            <button className="relative p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all" title="Notifications">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-600 rounded-full" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all flex items-center justify-center"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-4.5 h-4.5 text-amber-400 animate-spin-slow" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-slate-500" />
              )}
            </button>

            {/* Small divider */}
            <div className="w-[1px] h-6 bg-slate-200" />

            {/* Mini User Account profile dropdown mock */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                ND
              </div>
              <span className="hidden md:inline-block text-xs font-bold text-slate-600 truncate max-w-[120px]">
                Nitin Diwewar
              </span>
            </div>
          </div>
        </header>

        {/* MAIN BODY VIEWPORT */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Command Palette Spotlight */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        isDark={isDark}
        toggleDark={() => setIsDark(!isDark)}
      />
    </div>
  );
}
