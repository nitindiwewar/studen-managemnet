import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, RotateCcw, AlertCircle } from "lucide-react";
import { Student } from "../types";

interface StudentFormProps {
  initialData?: Student;
  onSubmit: (formData: Omit<Student, "id" | "avatar">) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const COURSES = [
  "Computer Science",
  "Data Science",
  "Information Technology",
  "Software Engineering",
  "Artificial Intelligence",
];

const GENDERS = ["Male", "Female", "Other"];

// Helper to determine subjects based on course
const getSubjectsForCourse = (course: string): string[] => {
  switch (course) {
    case "Computer Science":
      return ["Mathematics", "Programming", "Database Systems", "Web Dev"];
    case "Data Science":
      return ["Mathematics", "Programming", "Statistics", "Machine Learning"];
    case "Information Technology":
      return ["Networking", "Cyber Security", "System Admin", "Cloud Computing"];
    case "Software Engineering":
      return ["Software Design", "Programming", "Data Structures", "Testing"];
    case "Artificial Intelligence":
      return ["Calculus", "Neural Networks", "AI Ethics", "Robotics"];
    default:
      return ["Mathematics", "Programming", "Database Systems", "General Sciences"];
  }
};

// Zod Schema Definition
const studentSchema = z.object({
  name: z.string().trim().min(3, "Full Name must be at least 3 characters."),
  email: z.string().trim().email("Please provide a valid email address."),
  phone: z.string().trim().min(5, "Phone number must be at least 5 characters."),
  age: z.coerce
    .number()
    .min(15, "Age must be at least 15.")
    .max(99, "Age must be under 100."),
  gender: z.string().min(1, "Gender selection is required."),
  course: z.string().min(1, "Course selection is required."),
  address: z.string().trim().min(5, "Please enter a complete address (min 5 chars)."),
  dob: z.string().min(1, "Date of Birth is required."),
  marks: z.record(
    z.string(),
    z.coerce
      .number()
      .min(0, "Marks must be between 0 and 100.")
      .max(100, "Marks must be between 0 and 100.")
  ),
});

type StudentFormValues = z.infer<typeof studentSchema>;

export default function StudentForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save Student",
}: StudentFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      age: 21,
      gender: "",
      course: COURSES[0],
      address: "",
      dob: "",
      marks: {},
    },
  });

  const selectedCourse = watch("course");
  const marksValue = watch("marks") || {};

  // Initialize form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone,
        age: initialData.age,
        gender: initialData.gender,
        course: initialData.course,
        address: initialData.address,
        dob: initialData.dob,
        marks: initialData.marks || {},
      });
    } else {
      // Set default course dynamic marks for new enrollments
      const defaultSubjects = getSubjectsForCourse(COURSES[0]);
      const initialMarks: { [key: string]: number } = {};
      defaultSubjects.forEach((sub) => {
        initialMarks[sub] = 80;
      });
      setValue("marks", initialMarks);
    }
  }, [initialData, reset]);

  // Sync dynamic subjects whenever course is updated
  useEffect(() => {
    if (selectedCourse && !initialData) {
      const defaultSubjects = getSubjectsForCourse(selectedCourse);
      const newMarks: { [key: string]: number } = {};
      defaultSubjects.forEach((sub) => {
        // preserve existing if matching subject, else default to 80
        newMarks[sub] = marksValue[sub] !== undefined ? marksValue[sub] : 80;
      });
      setValue("marks", newMarks);
    }
  }, [selectedCourse, setValue, initialData]);

  const handleFormSubmit = (data: StudentFormValues) => {
    onSubmit({
      ...data,
      age: Number(data.age),
    });
  };

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    if (initialData) {
      reset({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone,
        age: initialData.age,
        gender: initialData.gender,
        course: initialData.course,
        address: initialData.address,
        dob: initialData.dob,
        marks: initialData.marks || {},
      });
    } else {
      reset({
        name: "",
        email: "",
        phone: "",
        age: 21,
        gender: "",
        course: COURSES[0],
        address: "",
        dob: "",
      });
      const defaultSubjects = getSubjectsForCourse(COURSES[0]);
      const initialMarks: { [key: string]: number } = {};
      defaultSubjects.forEach((sub) => {
        initialMarks[sub] = 80;
      });
      setValue("marks", initialMarks);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8 max-w-4xl">
      {/* 1. Personal Information Section */}
      <div className="bg-white dark:bg-[#121b2d] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight">Personal Details</h3>
          <p className="text-xs text-slate-400 font-semibold">Enter student identity details, contact info and demographics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">Full Name *</label>
            <input
              type="text"
              {...register("name")}
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border ${
                errors.name ? "border-red-400 focus:border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
              } focus:bg-white dark:focus:bg-[#121b2d] rounded-xl text-sm font-medium outline-none transition-all dark:text-slate-100`}
              placeholder="e.g. John Doe"
            />
            {errors.name && (
              <span className="text-red-500 text-xs font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">Email Address *</label>
            <input
              type="email"
              {...register("email")}
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border ${
                errors.email ? "border-red-400 focus:border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
              } focus:bg-white dark:focus:bg-[#121b2d] rounded-xl text-sm font-medium outline-none transition-all dark:text-slate-100`}
              placeholder="e.g. john.doe@university.edu"
            />
            {errors.email && (
              <span className="text-red-500 text-xs font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">Phone Number *</label>
            <input
              type="text"
              {...register("phone")}
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border ${
                errors.phone ? "border-red-400 focus:border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
              } focus:bg-white dark:focus:bg-[#121b2d] rounded-xl text-sm font-medium outline-none transition-all dark:text-slate-100`}
              placeholder="e.g. +1 (555) 123-4567"
            />
            {errors.phone && (
              <span className="text-red-500 text-xs font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.phone.message}
              </span>
            )}
          </div>

          {/* Date of Birth */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">Date of Birth *</label>
            <input
              type="date"
              {...register("dob")}
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border ${
                errors.dob ? "border-red-400 focus:border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
              } focus:bg-white dark:focus:bg-[#121b2d] rounded-xl text-sm font-medium outline-none transition-all dark:text-slate-100`}
            />
            {errors.dob && (
              <span className="text-red-500 text-xs font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.dob.message}
              </span>
            )}
          </div>

          {/* Age */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">Age *</label>
            <input
              type="number"
              {...register("age")}
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border ${
                errors.age ? "border-red-400 focus:border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
              } focus:bg-white dark:focus:bg-[#121b2d] rounded-xl text-sm font-medium outline-none transition-all dark:text-slate-100`}
              placeholder="e.g. 21"
              min="15"
              max="99"
            />
            {errors.age && (
              <span className="text-red-500 text-xs font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.age.message}
              </span>
            )}
          </div>

          {/* Gender selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">Gender *</label>
            <select
              {...register("gender")}
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border ${
                errors.gender ? "border-red-400 focus:border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
              } focus:bg-white dark:focus:bg-[#121b2d] rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none transition-all cursor-pointer`}
            >
              <option value="">Select Gender</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            {errors.gender && (
              <span className="text-red-500 text-xs font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.gender.message}
              </span>
            )}
          </div>
        </div>

        {/* Full Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">Residential Address *</label>
          <textarea
            {...register("address")}
            rows={2}
            className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border ${
              errors.address ? "border-red-400 focus:border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
            } focus:bg-white dark:focus:bg-[#121b2d] rounded-xl text-sm font-medium outline-none transition-all resize-none dark:text-slate-100`}
            placeholder="e.g. Apt 4B, 101 Cedar Court, Austin, TX 78701"
          />
          {errors.address && (
            <span className="text-red-500 text-xs font-semibold flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.address.message}
            </span>
          )}
        </div>
      </div>

      {/* 2. Academic Enrollment Section */}
      <div className="bg-white dark:bg-[#121b2d] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight">Academic Program & Subjects Marks</h3>
          <p className="text-xs text-slate-400 font-semibold">Select the active curriculum course and enter subject-wise gradings (0-100%)</p>
        </div>

        {/* Course Dropdown */}
        <div className="max-w-md space-y-1.5">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">Enrolled Course *</label>
          <select
            {...register("course")}
            className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border ${
              errors.course ? "border-red-400 focus:border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
            } focus:bg-white dark:focus:bg-[#121b2d] rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none transition-all cursor-pointer`}
          >
            {COURSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.course && (
            <span className="text-red-500 text-xs font-semibold flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.course.message}
            </span>
          )}
        </div>

        {/* Dynamic Subjects Grid based on selected Course */}
        {selectedCourse && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-4">
              Subject Grades for {selectedCourse}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.keys(marksValue).map((subject) => (
                <div key={subject} className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block truncate" title={subject}>
                    {subject} (%)
                  </label>
                  <input
                    type="number"
                    {...register(`marks.${subject}` as any)}
                    className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/40 border ${
                      errors.marks?.[subject] ? "border-red-400 focus:border-red-500" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
                    } focus:bg-white dark:focus:bg-[#121b2d] rounded-xl text-sm font-bold outline-none transition-all dark:text-slate-100`}
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                  {errors.marks?.[subject] && (
                    <span className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-1">
                      {errors.marks[subject]?.message}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Action Buttons */}
      <div className="flex items-center justify-end space-x-3.5 pt-4">
        {/* Reset */}
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center space-x-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-transparent dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 px-6 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Form</span>
        </button>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 transition-all active:scale-[0.98] disabled:cursor-not-allowed cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? "Saving..." : submitLabel}</span>
        </button>
      </div>
    </form>
  );
}
