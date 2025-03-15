export function throttle<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<T>) => {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          func(...args);
        }, wait);
      }
    };
  }