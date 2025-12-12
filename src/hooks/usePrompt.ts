"use client";
import { useEffect } from "react";

export const usePrompt = (message: string, isDirty: boolean) => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = message; // Standard for most browsers
        return message;
      }
    };

    const handlePopState = () => {
      if (isDirty && !window.confirm(message)) {
        history.pushState(null, "", window.location.href); // Prevent the navigation
      }
    };

    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isDirty, message]);
};
