import { useEffect } from "react";

export const useScrollToBottom = (
  ref: React.RefObject<HTMLElement>,
  trigger?: any
) => {
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [ref, trigger]);
};
