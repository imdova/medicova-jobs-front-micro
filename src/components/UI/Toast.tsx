import { useAppDispatch } from "@/store/hooks";
import { removeToast } from "@/store/slices/toastSlice";
import { Toast as ToastType } from "@/types";
import React, { useEffect, useRef } from "react";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";

interface Props {
  toast: ToastType;
}

const toastTypeConfig = {
  success: {
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    accent: "bg-emerald-500",
  },
  error: {
    bg: "bg-rose-50",
    text: "text-rose-800",
    border: "border-rose-200",
    icon: <XCircle className="h-5 w-5 text-rose-500" />,
    accent: "bg-rose-500",
  },
  info: {
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-200",
    icon: <Info className="h-5 w-5 text-blue-500" />,
    accent: "bg-blue-500",
  },
  warning: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    accent: "bg-amber-500",
  },
};

export const Toast: React.FC<Props> = ({ toast }) => {
  const dispatch = useAppDispatch();
  const { id, title, message, type = "info", duration = 5000 } = toast;
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!duration || duration === 0) return;

    const timer = setTimeout(() => {
      dismissToast();
    }, duration);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const dismissToast = () => {
    if (toastRef.current) {
      toastRef.current.classList.add("opacity-0", "scale-95");
      setTimeout(() => {
        dispatch(removeToast(id));
      }, 200);
    } else {
      dispatch(removeToast(id));
    }
  };

  const config = toastTypeConfig[type];

  return (
    <div
      ref={toastRef}
      role="alert"
      aria-live={type === "error" ? "assertive" : "polite"}
      aria-atomic="true"
      className={`pointer-events-auto relative w-full max-w-md overflow-hidden rounded-lg border shadow-sm transition-all duration-200 ${config.bg} ${config.border} scale-100 transform-gpu opacity-100`}
      onMouseEnter={(e) => {
        const timer = (e.currentTarget as HTMLElement).dataset.timer;
        if (timer) clearTimeout(Number(timer));
      }}
      onMouseLeave={(e) => {
        if (!duration || duration === 0) return;
        const timer = setTimeout(() => {
          dismissToast();
        }, duration);
        (e.currentTarget as HTMLElement).dataset.timer = String(timer);
      }}
    >
      {/* Accent bar */}
      <div className={`absolute left-0 top-0 h-full w-1 ${config.accent}`} />

      <div className="flex p-4">
        <div className="flex-shrink-0 pt-0.5">{config.icon}</div>

        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${config.text}`}>{title}</h3>
          )}
          {message && (
            <div className={`mt-1 text-sm ${config.text}`}>{message}</div>
          )}
        </div>

        <div className="ml-4 flex flex-shrink-0">
          <button
            type="button"
            onClick={dismissToast}
            className={`inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.text} transition-opacity duration-150 hover:opacity-70`}
          >
            <span className="sr-only">Close</span>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {duration > 0 && (
        <div className={`h-0.5 w-full ${config.accent} bg-opacity-30`}>
          <div
            className={`h-full ${config.accent} animate-progress`}
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      )}
    </div>
  );
};
