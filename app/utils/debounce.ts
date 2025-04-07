let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

const debounce = (func: Function, delay: number) => {
  return (...args: any[]) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export default debounce;