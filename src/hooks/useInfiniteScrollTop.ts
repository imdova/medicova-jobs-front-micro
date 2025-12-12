import { useEffect, useRef } from "react";

interface UseInfiniteScrollTopOptions {
  containerRef: React.RefObject<HTMLElement>;
  onLoadMore: () => void;
  offset?: number;
  enabled?: boolean;
}

export const useInfiniteScrollTop = ({
  containerRef,
  onLoadMore,
  offset = 100,
  enabled = true,
}: UseInfiniteScrollTopOptions) => {
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;

    const handleScroll = () => {
      if (!container) return;

      const scrollTop = container.scrollTop;

      if (scrollTop <= offset) {
        if (!hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          onLoadMore();
        }
      } else {
        // Reset lock when user scrolls away from top
        hasTriggeredRef.current = false;
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [containerRef, onLoadMore, offset, enabled]);
};
