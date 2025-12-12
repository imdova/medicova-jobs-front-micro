import React, { useEffect, useState } from "react";

interface ErrorMessageProps {
  title?: string;
  message: string;
  duration?: number; // in ms (optional)
  onClose?: () => void; // called when auto-hide completes
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  duration = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div role="alert" className="mt-4 border-s-4 border-red-700 bg-red-50 p-4">
      <div className="flex items-center gap-2 text-red-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-5"
        >
          <path
            fillRule="evenodd"
            d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
            clipRule="evenodd"
          />
        </svg>
        <strong className="font-medium">
          {title || "Something went wrong"}
        </strong>
      </div>
      <p className="mt-2 text-sm text-red-700">{message}</p>
    </div>
  );
};

export default ErrorMessage;
