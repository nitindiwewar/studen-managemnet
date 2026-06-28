import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  children: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: "danger" | "info" | "success";
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  type = "info",
}: ModalProps) {
  if (!isOpen) return null;

  const accentColors = {
    danger: {
      iconBg: "bg-red-50 text-red-600 border border-red-100",
      confirmBtn: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    },
    info: {
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
      confirmBtn: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    },
    success: {
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      confirmBtn: "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500",
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Card Content Container */}
      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden transform transition-transform duration-300 scale-100 animate-slide-up z-10">
        <div className="p-6">
          <div className="flex items-start space-x-4">
            {/* Action Icon */}
            {type === "danger" && (
              <div className={`p-3 rounded-xl flex-shrink-0 ${accentColors.danger.iconBg}`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
            )}

            {/* Header Content */}
            <div className="flex-1 space-y-1.5">
              <h3 className="text-base font-bold text-slate-800 tracking-tight leading-6">{title}</h3>
              <div className="text-sm text-slate-500 leading-relaxed">{children}</div>
            </div>

            {/* Close Cross */}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-slate-50/70 border-t border-slate-100 px-6 py-4 flex items-center justify-end space-x-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl transition-all"
          >
            {cancelLabel}
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-xs font-bold rounded-xl shadow-sm transition-all active:scale-[0.98] ${accentColors[type].confirmBtn}`}
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
