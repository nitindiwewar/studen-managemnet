import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  Users,
  Award,
  BookOpen,
  UserPlus,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  RefreshCw,
  Search
} from "lucide-react";
import { StudentService } from "../services/studentService";
import { StudentStats } from "../types";
import StatsCard from "../components/StatsCard";
import Loader from "../components/Loader";

export default function Dashboard() {
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await StudentService.getStats();
      setStats(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch dashboard metrics. Please refresh or try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeleton stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-white rounded-2xl animate-pulse border border-slate-100" />
          <div className="h-32 bg-white rounded-2xl animate-pulse border border-slate-100" />
          <div className="h-32 bg-white rounded-2xl animate-pulse border border-slate-100" />
        </div>
        <div className="h-80 bg-white rounded-2xl animate-pulse border border-slate-100" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 text-center space-y-4 max-w-lg mx-auto">
        <p className="text-sm font-semibold text-red-600">{error}</p>
        <button
          onClick={fetchDashboardStats}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-lg shadow-blue-100/50"
      >
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span className="text-[10px] font-bold tracking-wider uppercase text-blue-100">Portal Dashboard</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Academic Administrator Workspace</h2>
          <p className="text-xs md:text-sm text-blue-100 font-medium">
            Monitor, manage, and inspect student data, subject gradings, and curriculum standing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/students/add")}
            className="px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-[0.98] flex items-center space-x-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enroll Student</span>
          </button>
          <button
            onClick={() => navigate("/students")}
            className="px-5 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-white border border-blue-400/20 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Search Students</span>
          </button>
        </div>
      </motion.div>

      {/* Analytics KPI Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Students */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <StatsCard
            title="Total Registered Students"
            value={stats?.totalStudents || 0}
            icon={<Users className="w-6 h-6 text-blue-600" />}
            subtitle="Enrolled active scholars"
            colorClassName="bg-blue-600"
            badge={{ text: "Active", type: "info" }}
          />
        </motion.div>

        {/* Card 2: Average Marks */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <StatsCard
            title="Global Average Marks"
            value={stats?.averageMarks ? `${stats.averageMarks}%` : "0%"}
            icon={<Award className="w-6 h-6 text-emerald-600" />}
            subtitle="System aggregate scoring"
            colorClassName="bg-emerald-500"
            badge={{ text: "Healthy", type: "success" }}
          />
        </motion.div>

        {/* Card 3: Top Performer */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Performer Spot</span>
              {stats?.topPerformer ? (
                <div className="mt-1.5 space-y-2">
                  <h4 className="text-lg font-bold text-slate-800 leading-snug truncate max-w-[160px] md:max-w-[190px]">
                    {stats.topPerformer.name}
                  </h4>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                      {stats.topPerformer.course}
                    </span>
                    <span className="text-xs font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded">
                      {stats.topPerformer.average}%
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-semibold text-slate-400 mt-2">No performers yet</p>
              )}
            </div>
            {stats?.topPerformer ? (
              <img
                src={stats.topPerformer.avatar}
                alt={stats.topPerformer.name}
                className="w-12 h-12 rounded-full border border-slate-100 bg-slate-50 object-cover group-hover:scale-110 transition-transform duration-300 flex-shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="p-3 rounded-2xl bg-slate-50 text-slate-400">
                <TrendingUp className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
            <span className="text-xs text-slate-500 font-medium">Highest academic average</span>
            {stats?.topPerformer && (
              <Link
                to={`/students/${stats.topPerformer.id}`}
                className="text-[10px] font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
              >
                <span>View profile</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Action Center and Recently Added Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recently Added List (Takes 2 columns) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Recently Enrolled Students</span>
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold">Latest student registrations</p>
            </div>
            <Link
              to="/students"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center space-x-1"
            >
              <span>View Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {stats?.recentStudents && stats.recentStudents.length > 0 ? (
              stats.recentStudents.map((student) => (
                <div
                  key={student.id}
                  className="py-3.5 flex items-center justify-between hover:bg-slate-50/30 px-2 rounded-xl transition-all"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-10 h-10 rounded-full border border-slate-100 bg-slate-50 object-cover flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{student.name}</h4>
                      <span className="text-[10px] text-slate-400 font-semibold truncate block mt-0.5">
                        {student.course}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                      {student.age} yrs
                    </span>
                    <Link
                      to={`/students/${student.id}`}
                      className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
                      title="Inspect Profile"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs font-semibold text-slate-400 text-center py-6">No students found.</p>
            )}
          </div>
        </div>

        {/* Shortcuts Panel (Takes 1 column) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Shortcuts & Tools</h3>
            <p className="text-[11px] text-slate-400 font-semibold">Instant workflow controls</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* Shortcut 1 */}
            <Link
              to="/students/add"
              className="flex items-center space-x-3 p-4 bg-blue-50/50 hover:bg-blue-50 border border-blue-100/40 hover:border-blue-100 rounded-xl transition-all group"
            >
              <div className="p-2 rounded-lg bg-blue-600 text-white group-hover:scale-105 transition-transform">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Enrollment Wizard</h4>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Add a new student profile</p>
              </div>
            </Link>

            {/* Shortcut 2 */}
            <Link
              to="/students"
              className="flex items-center space-x-3 p-4 bg-slate-50 hover:bg-slate-100/75 border border-slate-200/50 rounded-xl transition-all group"
            >
              <div className="p-2 rounded-lg bg-slate-800 text-white group-hover:scale-105 transition-transform">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Student Directory</h4>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Filter, sort and search rosters</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
