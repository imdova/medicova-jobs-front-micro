import { useEffect } from "react";

interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  offset?: number;
  enabled?: boolean;
}

export const useInfiniteScroll = ({
  onLoadMore,
  offset = 100,
  enabled = true,
}: UseInfiniteScrollOptions) => {
  useEffect(() => {
    if (!enabled) return;

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const fullHeight = document.documentElement.scrollHeight;

        if (scrollTop + windowHeight >= fullHeight - offset) {
          onLoadMore();
        }
        ticking = false;
      });

      ticking = true;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onLoadMore, offset, enabled]);
};
