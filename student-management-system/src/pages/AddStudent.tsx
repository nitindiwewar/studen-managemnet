import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, UserPlus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { StudentService } from "../services/studentService";
import StudentForm from "../components/StudentForm";

export default function AddStudent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFormSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      setServerError(null);
      await StudentService.createStudent(formData);
      toast.success(`Successfully enrolled ${formData.name}!`);
      navigate("/students");
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.error || "Failed to create student. Please verify all inputs and try again.";
      setServerError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button and title */}
      <div className="space-y-4">
        <Link
          to="/students"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              <span>Enroll New Scholar</span>
            </h2>
            <p className="text-xs text-slate-400 font-semibold">Register a student record, enter bio details, and assign initial subject grades</p>
          </div>
          <div className="hidden sm:flex items-center space-x-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-xs font-bold border border-blue-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Wizard Active</span>
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
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Enroll Scholar"
        />
      </div>
    </div>
  );
}
