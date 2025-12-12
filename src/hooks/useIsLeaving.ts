"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

type NavigationType = "link" | "navigation" | "unload" | "manual";

interface PendingNavigation {
  type: NavigationType;
  event?: Event;
  url?: string;
  message?: string;
}

interface UseIsLeavingOptions {
  preventDefault?: boolean;
  preventLinks?: boolean;
  defaultMessage?: string;
  excludePatterns?: string[];
  preventExternalLinks?: boolean;
}

interface UseIsLeavingReturn {
  isLeaving: boolean;
  pendingNavigation: PendingNavigation | null;
  handleUserDecision: (wantsToLeave: boolean) => void;
  setLeavingManually: (
    isLeaving: boolean,
    options?: { url?: string; message?: string },
  ) => void;
}

const defaultOptions: Required<UseIsLeavingOptions> = {
  preventDefault: true,
  preventLinks: true,
  defaultMessage: "Are you sure you want to leave?",
  excludePatterns: ["#", "javascript:", "mailto:", "tel:"],
  preventExternalLinks: true,
};

const useIsLeaving = (
  options: UseIsLeavingOptions = {},
): UseIsLeavingReturn => {
  const {
    preventDefault,
    preventLinks,
    defaultMessage,
    excludePatterns,
    preventExternalLinks,
  } = { ...defaultOptions, ...options };
  const route = useRouter();
  const [isLeaving, setIsLeaving] = useState<boolean>(false);
  const [pendingNavigation, setPendingNavigation] =
    useState<PendingNavigation | null>(null);

  const setLeavingManually = useCallback(
    (shouldLeave: boolean, opts?: { url?: string; message?: string }) => {
      setIsLeaving(shouldLeave);
      if (shouldLeave) {
        setPendingNavigation({
          type: "manual",
          url: opts?.url,
          message: opts?.message || defaultMessage,
        });
      } else {
        setPendingNavigation(null);
      }
    },
    [defaultMessage],
  );

  const handleUserDecision = useCallback(
    async (wantsToLeave: boolean) => {
      if (!pendingNavigation) return;

      if (wantsToLeave) {
        const { type, event, url } = pendingNavigation;

        window.removeEventListener("beforeunload", handleBeforeUnload);
        switch (type) {
          case "link":
            route.push(url!);
            break;
          case "navigation":
            window.history.go((event as PopStateEvent).state || -1);
            break;
          case "unload":
            if (url) {
              window.location.href = url;
            } else {
              window.location.reload();
            }
            break;
          case "manual":
            if (url) {
              window.location.href = url;
            }
            break;
        }
      }

      setIsLeaving(false);
      setPendingNavigation(null);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pendingNavigation],
  );

  const handleBeforeUnload = useCallback(
    (event: BeforeUnloadEvent) => {
      if (!preventDefault) return;

      setPendingNavigation({
        type: "unload",
        event,
        message: defaultMessage,
      });
      event.preventDefault();
    },
    [preventDefault, defaultMessage],
  );

  const shouldPreventNavigation = useCallback(
    (anchor: HTMLAnchorElement): boolean => {
      const href = anchor.getAttribute("href");
      if (!href) return false;

      // Check for excluded patterns
      if (excludePatterns.some((pattern) => href.startsWith(pattern))) {
        return false;
      }

      // Don't prevent navigation for _blank targets or downloads
      if (
        anchor.getAttribute("target") === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return false;
      }

      // Check for external links if preventExternalLinks is true
      if (preventExternalLinks) {
        try {
          const url = new URL(href, window.location.origin);
          if (url.origin !== window.location.origin) {
            return true;
          }
        } catch (e) {
          // Invalid URL, prevent navigation to be safe
          return true;
        }
      }

      return true;
    },
    [excludePatterns, preventExternalLinks],
  );

  const handleLinkClick = useCallback(
    (event: MouseEvent) => {
      if (!preventDefault || !preventLinks) return;

      const target = event.target as HTMLElement;
      const anchor = target.closest("a");

      if (!anchor) return;

      if (shouldPreventNavigation(anchor as HTMLAnchorElement)) {
        event.preventDefault();
        setIsLeaving(true);
        setPendingNavigation({
          type: "link",
          event,
          url: anchor.href,
          message: defaultMessage,
        });
      }
    },
    [preventDefault, preventLinks, shouldPreventNavigation, defaultMessage],
  );

  const handlePopState = useCallback(
    (event: PopStateEvent) => {
      if (!preventDefault) return;

      event.preventDefault();
      setIsLeaving(true);
      setPendingNavigation({
        type: "navigation",
        event,
        message: defaultMessage,
      });
    },
    [preventDefault, defaultMessage],
  );

  useEffect(() => {
    if (preventDefault) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("popstate", handlePopState);
    }

    if (preventDefault && preventLinks) {
      document.addEventListener(
        "click",
        handleLinkClick as EventListener,
        true,
      );
    }

    return () => {
      if (preventDefault) {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("popstate", handlePopState);
      }

      if (preventDefault && preventLinks) {
        document.removeEventListener(
          "click",
          handleLinkClick as EventListener,
          true,
        );
      }
    };
  }, [
    preventDefault,
    preventLinks,
    handleBeforeUnload,
    handleLinkClick,
    handlePopState,
  ]);

  return {
    isLeaving,
    pendingNavigation,
    handleUserDecision,
    setLeavingManually,
  };
};

export default useIsLeaving;
