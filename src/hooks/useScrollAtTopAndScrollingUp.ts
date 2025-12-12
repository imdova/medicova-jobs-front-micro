import { useEffect, useRef } from "react";

interface UseTriggerOnScrollUpAtTopOptions {
  onTrigger: () => void;
}

function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): T {
  let timer: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  }) as T;
}

export const useTriggerOnScrollUpAtTop = (
  ref: React.RefObject<HTMLElement>,
  { onTrigger }: UseTriggerOnScrollUpAtTopOptions,
) => {
  const debouncedTrigger = useRef(debounce(onTrigger, 300));

  useEffect(() => {
    if (!ref.current) return;

    const container = ref.current;

    const handleWheel = (e: WheelEvent) => {
      const atTop = container.scrollTop <= 0;
      const scrollingUp = e.deltaY < 0;

      if (atTop && scrollingUp) {
        debouncedTrigger.current();
      }
    };

    container.addEventListener("wheel", handleWheel);

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [ref]);
};
