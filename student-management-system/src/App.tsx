import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BarChart3, Settings as SettingsIcon, AlertCircle } from "lucide-react";
import { Toaster } from "sonner";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import StudentsList from "./pages/StudentsList";
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";
import StudentDetails from "./pages/StudentDetails";

// Polite Mock View for Reports
function ReportsMock() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center space-y-4 max-w-lg mx-auto">
      <div className="flex items-center justify-center text-blue-600 bg-blue-50 w-12 h-12 rounded-xl mx-auto">
        <BarChart3 className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-800">Academic Reporting Dashboard</h3>
      <p className="text-xs text-slate-500 leading-relaxed">
        Curriculum standing metrics, average scoring analytics, and attendance heatmaps are currently compiling. 
        This reporting module is fully prototyped in standard layouts.
      </p>
    </div>
  );
}

// Polite Mock View for Settings
function SettingsMock() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center space-y-4 max-w-lg mx-auto">
      <div className="flex items-center justify-center text-slate-600 bg-slate-100 w-12 h-12 rounded-xl mx-auto">
        <SettingsIcon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-800">System Preferences</h3>
      <p className="text-xs text-slate-500 leading-relaxed">
        Configure database configurations, role-based access scopes, and portal notification frequencies here. 
        Active controls are ready for backend binding.
      </p>
    </div>
  );
}

// Polite Mock View for 404 Fallback
function NotFoundPage() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center space-y-4 max-w-lg mx-auto">
      <div className="flex items-center justify-center text-red-600 bg-red-50 w-12 h-12 rounded-xl mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-800">Page Not Found</h3>
      <p className="text-xs text-slate-500">
        The page you are looking for does not exist. Please use the sidebar to navigate back to safe areas.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" closeButton />
      <DashboardLayout>
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<StudentsList />} />
          <Route path="/students/add" element={<AddStudent />} />
          <Route path="/students/edit/:id" element={<EditStudent />} />
          <Route path="/students/:id" element={<StudentDetails />} />

          {/* Auxiliary Navigation links inside layout */}
          <Route path="/reports" element={<ReportsMock />} />
          <Route path="/settings" element={<SettingsMock />} />

          {/* Catch-all Fallbacks */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}
