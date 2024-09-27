export const debounce = (
  callback: (...args: unknown[]) => void,
  timeout: number
) => {
  let timeoutId: null | number = null;

  return (...args: unknown[]) => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, timeout);
  };
};
