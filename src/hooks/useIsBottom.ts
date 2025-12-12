import { useEffect, useState, RefObject } from "react";

export const useIsBottom = (
  containerRef: RefObject<HTMLElement>,
  offset: number = 10,
) => {
  const [isBottom, setIsBottom] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceToBottom = scrollHeight - scrollTop - clientHeight;
      setIsBottom(distanceToBottom <= offset);
    };

    container.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [containerRef, offset]);

  return isBottom;
};
