export function debounce<T>(callback: (...args: T[]) => void, timeout: number) {
  let timeoutId: null | number = null;

  return (...args: T[]) => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, timeout);
  };
}
