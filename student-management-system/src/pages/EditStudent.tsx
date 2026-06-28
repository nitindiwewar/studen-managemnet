import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Edit3, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { StudentService } from "../services/studentService";
import { Student } from "../types";
import StudentForm from "../components/StudentForm";

export default function EditStudent() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await StudentService.getStudentById(id);
        setStudent(data);
      } catch (err: any) {
        console.error(err);
        setError("Could not locate the requested student profile or access was denied.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetail();
  }, [id]);

  const handleFormSubmit = async (formData: any) => {
    if (!id) return;
    try {
      setIsSubmitting(true);
      setServerError(null);
      await StudentService.updateStudent(id, formData);
      toast.success("Student profile successfully updated!");
      navigate(`/students/${id}`); // redirect to student profile view
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.error || "Failed to save student details. Please try again.";
      setServerError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 bg-slate-200 rounded animate-pulse w-32" />
        <div className="h-10 bg-slate-200 rounded animate-pulse w-2/3" />
        <div className="bg-white p-6 rounded-2xl animate-pulse space-y-6 border border-slate-100">
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="grid grid-cols-2 gap-6">
            <div className="h-10 bg-slate-200 rounded" />
            <div className="h-10 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="bg-red-50/50 border border-red-100 rounded-2xl p-8 text-center space-y-4 max-w-lg mx-auto">
        <div className="flex items-center justify-center text-red-600">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Student Profile Not Found</h3>
        <p className="text-xs text-slate-500">{error || "The requested student could not be resolved."}</p>
        <Link
          to="/students"
          className="inline-flex items-center space-x-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Directory</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button and title */}
      <div className="space-y-4">
        <Link
          to={`/students/${student.id}`}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Student Profile</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-600" />
              <span>Modify Student Information</span>
            </h2>
            <p className="text-xs text-slate-400 font-semibold">Update bio credentials, address locations, or course grade marks for {student.name}</p>
          </div>
          <div className="hidden sm:flex items-center space-x-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-xs font-bold border border-blue-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ID: {student.id}</span>
          </div>
        </div>
      </div>

      {/* Server side error alert */}
      {serverError && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 max-w-4xl text-xs font-semibold text-red-600 flex items-center space-x-2">
          <span>{serverError}</span>
        </div>
      )}

      {/* Core form */}
      <div className="bg-slate-50/50 p-1 rounded-2xl">
        <StudentForm
          initialData={student}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Save Student Changes"
        />
      </div>
    </div>
  );
}
