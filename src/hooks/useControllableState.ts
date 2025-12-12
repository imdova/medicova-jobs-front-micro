import { useState, useCallback } from "react";

export function useControllableState<T>({
  value,
  onChange,
  defaultValue,
}: {
  value?: T;
  onChange?: (next: T | ((prev: T) => T)) => void;
  defaultValue: T;
}): [T, (next: T | ((prev: T) => T)) => void] {
  const [internalValue, setInternalValue] = useState<T>(defaultValue);
  const isControlled = value !== undefined && onChange !== undefined;
  const state = isControlled ? (value as T) : internalValue;

  const setState = useCallback(
    (next: T | ((prev: T) => T)) => {
      if (isControlled) {
        onChange?.(next);
      } else {
        setInternalValue(next);
      }
    },
    [isControlled, onChange],
  );

  return [state, setState];
}
