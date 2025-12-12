import { useEffect, useRef } from "react";

type AutoScrollOptions = {
  isDragging: boolean;
  className: string;
  padding?: number;
  speed?: number;
};

export function useAutoScrollOnDrag({
  isDragging,
  className,
  padding = 80,
  speed = 10,
}: AutoScrollOptions) {
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isDragging) return;

    const scrollContainer = document.querySelector<HTMLElement>(className);
    if (!scrollContainer) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { top, bottom } = scrollContainer.getBoundingClientRect();

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        if (e.clientY < top + padding) {
          scrollContainer.scrollTop -= speed;
        } else if (e.clientY > bottom - padding) {
          scrollContainer.scrollTop += speed;
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDragging, className, padding, speed]);
}
