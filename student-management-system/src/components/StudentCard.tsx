import React from "react";
import { Link } from "react-router-dom";
import { Eye, Edit2, Trash2, Mail, Phone, GraduationCap, Award } from "lucide-react";
import { Student } from "../types";

interface StudentCardProps {
  student: Student;
  onDelete: (id: string) => void;
  key?: React.Key;
}

export default function StudentCard({ student, onDelete }: StudentCardProps) {
  // Simple helper to calculate average marks
  const getAverageMarks = (marks: { [key: string]: number }): number => {
    const values = Object.values(marks);
    if (values.length === 0) return 0;
    return Math.round((values.reduce((sum, val) => sum + val, 0) / values.length) * 10) / 10;
  };

  const avg = getAverageMarks(student.marks);

  // Dynamic Course Color Badges
  const courseColors: { [key: string]: string } = {
    "Computer Science": "bg-blue-50 text-blue-700 border border-blue-100",
    "Data Science": "bg-purple-50 text-purple-700 border border-purple-100",
    "Information Technology": "bg-cyan-50 text-cyan-700 border border-cyan-100",
    "Software Engineering": "bg-emerald-50 text-emerald-700 border border-emerald-100",
    "Artificial Intelligence": "bg-indigo-50 text-indigo-700 border border-indigo-100",
  };

  const courseBadge = courseColors[student.course] || "bg-slate-50 text-slate-700 border border-slate-100";

  // Dynamic Grade Badges
  const getGrade = (avgMarks: number) => {
    if (avgMarks >= 90) return { label: "A+", color: "bg-emerald-100 text-emerald-800" };
    if (avgMarks >= 80) return { label: "A", color: "bg-emerald-50 text-emerald-700" };
    if (avgMarks >= 70) return { label: "B", color: "bg-blue-50 text-blue-700" };
    if (avgMarks >= 60) return { label: "C", color: "bg-amber-50 text-amber-700" };
    if (avgMarks >= 50) return { label: "D", color: "bg-orange-50 text-orange-700" };
    return { label: "F", color: "bg-red-50 text-red-700" };
  };

  const grade = getGrade(avg);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col justify-between group">
      {/* Top Banner Accent */}
      <div className="h-2 bg-slate-50 border-b border-slate-100 flex justify-end px-4 pt-1" />

      <div className="p-5 space-y-4">
        {/* Avatar and Identity */}
        <div className="flex items-start space-x-4">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-12 h-12 rounded-full border border-slate-100 bg-slate-50 object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
              {student.name}
            </h4>
            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${courseBadge}`}>
              {student.course}
            </span>
          </div>
        </div>

        {/* Contact details */}
        <div className="space-y-2 text-xs text-slate-500 font-medium pt-1">
          <div className="flex items-center space-x-2 truncate">
            <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{student.email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{student.phone}</span>
          </div>
        </div>

        {/* Academic Standings */}
        <div className="bg-slate-50/70 rounded-xl p-3 flex justify-between items-center border border-slate-100/50">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 font-semibold">Average:</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-slate-800">{avg}%</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${grade.color}`}>
              {grade.label}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action footer */}
      <div className="bg-slate-50/50 border-t border-slate-100 px-5 py-3.5 flex items-center justify-between">
        <Link
          to={`/students/${student.id}`}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline transition-all"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Full Profile</span>
        </Link>

        <div className="flex items-center space-x-2">
          {/* Edit */}
          <Link
            to={`/students/edit/${student.id}`}
            className="p-1.5 hover:bg-blue-50 text-slate-500 hover:text-blue-600 border border-transparent hover:border-blue-100 rounded-lg transition-all"
            title="Edit student"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Link>
          {/* Delete */}
          <button
            onClick={() => onDelete(student.id)}
            className="p-1.5 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-transparent hover:border-red-100 rounded-lg transition-all"
            title="Delete student"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
