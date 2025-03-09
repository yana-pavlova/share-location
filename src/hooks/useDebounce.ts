import { useRef, useCallback } from 'react';

type DebouncedFunction<T extends (...args: any[]) => void> = ((
	...args: Parameters<T>
) => void) & {
	cancel: () => void;
};

export const useDebounce = <T extends (...args: any[]) => void>(
	func: T,
	delay: number
): DebouncedFunction<T> => {
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const debouncedFunction = useCallback(
		(...args: Parameters<T>) => {
			if (timer.current) {
				clearTimeout(timer.current);
			}
			timer.current = setTimeout(() => {
				func(...args);
			}, delay);
		},
		[func, delay]
	) as DebouncedFunction<T>;

	return debouncedFunction;
};
