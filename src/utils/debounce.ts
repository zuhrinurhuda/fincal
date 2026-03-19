/**
 * Returns a debounced version of `fn` that delays invocation until `delay` ms
 * have elapsed since the last call. The returned function also exposes a
 * `.cancel()` method to clear any pending timer.
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay = 300
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: Parameters<T>) => {
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };

  debounced.cancel = () => {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
  };

  return debounced;
}
