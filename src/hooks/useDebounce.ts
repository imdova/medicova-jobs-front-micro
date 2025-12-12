import { useEffect, useRef } from "react";

/**
 * Runs a function after a delay when dependencies stop changing.
 *
 * @param callback - The function to debounce.
 * @param delay - Delay in milliseconds.
 * @param deps - Dependency list.
 */
export function useDebounce(callback: () => void, delay: number, deps: React.DependencyList) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Clear the previous timer
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set a new timer
        timeoutRef.current = setTimeout(() => {
            callback();
        }, delay);

        // Cleanup if dependencies change or component unmounts
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps); // re-run on any dependency change
}
