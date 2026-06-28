import React from "react";
import { Link } from "react-router-dom";
import { Eye, Edit2, Trash2, Mail, Phone } from "lucide-react";
import { Student } from "../types";

interface StudentTableProps {
  students: Student[];
  onDelete: (id: string) => void;
}

export default function StudentTable({
  students,
  onDelete,
}: StudentTableProps) {
  // Safe helper to calculate average marks
  const getAverageMarks = (marks?: { [key: string]: number }): number => {
    if (!marks) return 0;

    const values = Object.values(marks);

    if (values.length === 0) return 0;

    return (
      Math.round(
        (values.reduce((sum, val) => sum + Number(val), 0) / values.length) * 10
      ) / 10
    );
  };

  const courseColors: { [key: string]: string } = {
    "Computer Science":
      "bg-blue-50 text-blue-700 border border-blue-100",
    "Data Science":
      "bg-purple-50 text-purple-700 border border-purple-100",
    "Information Technology":
      "bg-cyan-50 text-cyan-700 border border-cyan-100",
    "Software Engineering":
      "bg-emerald-50 text-emerald-700 border border-emerald-100",
    "Artificial Intelligence":
      "bg-indigo-50 text-indigo-700 border border-indigo-100",
  };

  const getGrade = (avgMarks: number) => {
    if (avgMarks >= 90)
      return {
        label: "A+",
        color: "bg-emerald-50 text-emerald-700 border-emerald-100",
      };

    if (avgMarks >= 80)
      return {
        label: "A",
        color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      };

    if (avgMarks >= 70)
      return {
        label: "B",
        color: "bg-blue-50 text-blue-700 border-blue-100",
      };

    if (avgMarks >= 60)
      return {
        label: "C",
        color: "bg-amber-50 text-amber-700 border border-amber-100",
      };

    if (avgMarks >= 50)
      return {
        label: "D",
        color: "bg-orange-50 text-orange-700 border border-orange-100",
      };

    return {
      label: "F",
      color: "bg-red-50 text-red-700 border-red-100",
    };
  };

  return (
    <div className="w-full overflow-x-auto rounded-t-2xl border border-slate-100 bg-white">
      <table className="w-full border-collapse text-left text-sm text-slate-500">
        <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
          <tr>
            <th className="px-6 py-4">Student</th>
            <th className="px-6 py-4">Course</th>
            <th className="px-6 py-4">Phone</th>
            <th className="px-6 py-4 text-center">Avg Marks</th>
            <th className="px-6 py-4 text-center">Grade</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {students.map((student) => {
            const avg = getAverageMarks(student.marks);
            const grade = getGrade(avg);

            const badgeColor =
              courseColors[student.course] ||
              "bg-slate-50 text-slate-700 border border-slate-100";

            return (
              <tr
                key={student.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        student.avatar ||
                        "https://ui-avatars.com/api/?name=" +
                          encodeURIComponent(student.name)
                      }
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />

                    <div>
                      <p className="font-semibold text-slate-800">
                        {student.name}
                      </p>

                      <p className="text-xs text-slate-500 flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {student.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeColor}`}
                  >
                    {student.course}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="flex items-center">
                    <Phone className="w-3 h-3 mr-1" />
                    {student.phone}
                  </span>
                </td>

                <td className="px-6 py-4 text-center font-bold">
                  {avg}%
                </td>

                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold border ${grade.color}`}
                  >
                    {grade.label}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/students/${student.id}`}
                      className="p-2 rounded hover:bg-slate-100"
                    >
                      <Eye size={16} />
                    </Link>

                    <Link
                      to={`/students/edit/${student.id}`}
                      className="p-2 rounded hover:bg-blue-100"
                    >
                      <Edit2 size={16} />
                    </Link>

                    <button
                      onClick={() => onDelete(String(student.id))}
                      className="p-2 rounded hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {students.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="text-center py-10 text-slate-500"
              >
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}