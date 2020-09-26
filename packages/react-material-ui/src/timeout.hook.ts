import { useRef } from 'react';

export function useTimeout(): (
  callback: Function,
  delay?: number
) => () => void {
  const debouncedTimeoutRef = useRef<
    ReturnType<typeof setTimeout> | undefined
  >();

  const clearDebouncedTimeout = () => {
    const dTimeout = debouncedTimeoutRef.current;
    dTimeout && clearTimeout(dTimeout);
  };

  return (callback: Function, delay?: number) => {
    // remove existing timeout
    clearDebouncedTimeout();
    // set new timeout
    debouncedTimeoutRef.current = setTimeout(callback, delay);
    return clearDebouncedTimeout;
  };
}
