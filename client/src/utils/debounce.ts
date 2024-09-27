export function debounce<Type>(
  callback: (...args: Type[]) => void,
  timeout: number
) {
  let timeoutId: null | number = null;

  return (...args: Type[]) => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, timeout);
  };
}
