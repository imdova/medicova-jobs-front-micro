import { useEffect, useRef } from "react";

export const useDetectScrollUp = (
  containerRef: React.RefObject<HTMLElement>,
  threshold: number, // Default scroll up distance to trigger
  onScrollUp: () => void,
) => {
  const lastScrollTopRef = useRef<number | null>(null);
  const triggerPointRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScrollTop = container.scrollTop;

      if (lastScrollTopRef.current === null) {
        lastScrollTopRef.current = currentScrollTop;
        triggerPointRef.current = currentScrollTop;
        return;
      }

      if (currentScrollTop < lastScrollTopRef.current) {
        // User is scrolling up
        if (triggerPointRef.current !== null) {
          const scrolledUpDistance = triggerPointRef.current - currentScrollTop;
          if (scrolledUpDistance >= threshold) {
            onScrollUp();
            // Reset trigger point so it doesn't keep firing until user scrolls down again
            triggerPointRef.current = currentScrollTop;
          }
        }
      } else {
        // User scrolled down, reset trigger point
        triggerPointRef.current = currentScrollTop;
      }

      lastScrollTopRef.current = currentScrollTop;
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [containerRef, threshold, onScrollUp]);
};
