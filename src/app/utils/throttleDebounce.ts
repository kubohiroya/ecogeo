// 引数の型をジェネリクスで指定
type FunctionType<Args extends unknown[]> = (...args: Args) => void;

// スロットル関数
export function throttle<Args extends unknown[]>(
  func: FunctionType<Args>,
  limit: number,
): FunctionType<Args> {
  let inThrottle: boolean;
  return function (this: any, ...args: Args): void {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// デバウンス関数
export function debounce<Args extends unknown[]>(
  func: FunctionType<Args>,
  wait: number,
): FunctionType<Args> {
  let timeout: ReturnType<typeof setTimeout> | null;
  return function (this: any, ...args: Args): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => later(), wait);
  };
}

// スロットルとデバウンスを組み合わせた関数
export function throttleDebounce<Args extends unknown[]>(
  func: FunctionType<Args>,
  throttleLimit: number,
  debounceWait: number,
): FunctionType<Args> {
  const throttledFunc = throttle(func, throttleLimit);
  return debounce(throttledFunc, debounceWait);
}

// console.log(`/map/${z}/${lat}/${lng}`);
/*
const onViewportChangeThrottledDebounced = throttleDebounce<
  [number, number, number]
>(
  (newZoom: number, newLatitude: number, newLongitude: number): void => {
    console.log('!');
    // URL 更新のロジック
    // navigate(`/map/${newZoom}/${newLatitude}/${newLongitude}`, { replace: true });
  },
  100, // スロットルの間隔
  200, // デバウンスの遅延
);
*/
