export const create2DArray = (
  numVertices: number,
  createValue?: (i: number, j: number) => number
): number[][] => {
  const matrix2d: number[][] = [];
  for (let i = 0; i < numVertices; i++) {
    const row: number[] = [];
    for (let j = 0; j < numVertices; j++) {
      row.push(createValue ? createValue(i, j) : 0);
    }
    matrix2d.push(row);
  }
  return matrix2d;
};

export function createDiagonalMatrix(n: number, defaultValues?: number[][]) {
  const ret = new Array<Array<number>>(n);
  for (let i = 0; i < n; i++) {
    ret[i] = new Array<number>(n);
    ret[i].fill(Number.POSITIVE_INFINITY);
    if (defaultValues && defaultValues[i]) {
      for (let j = 0; j < n; j++) {
        if (defaultValues[i][j]) {
          ret[i][j] = defaultValues[i][j];
        }
      }
    }
  }
  return ret;
}

export function arrayIntersection(arr1: number[], arr2: number[]): number[] {
  const set2 = new Set(arr2);
  return arr1.filter((item) => set2.has(item));
}

export function arrayXOR(arr1: number[], arr2: number[]): number[] {
  const set2 = new Set(arr2);
  const union = new Set(arr1.concat(arr2));
  const intersection = new Set(arr1.filter((item) => set2.has(item)));
  return Array.from(union).filter((item) => !intersection.has(item));
}

export const loop = (start: number, end?: number) => {
  if (!end) {
    end = start - 1;
    start = 0;
  }
  const result = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
};

export function convertIdToIndex<T extends { id: number }>(
  arr: T[],
  id: number
): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (arr[mid].id === id) {
      // 探索対象の数値が見つかった場合、
      // 最初に現れる位置を見つけるために左側を探索
      while (mid > 0 && arr[mid - 1].id === id) {
        mid--;
      }
      return mid;
    } else if (arr[mid].id < id) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  // 探索する数値が配列に存在しない場合は-1を返す
  return -1;
}

export function getById<
  T extends {
    id: number;
  }
>(arr: T[], id: number): T | null {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (arr[mid].id === id) {
      // 探索対象の数値が見つかった場合、
      // 最初に現れる位置を見つけるために左側を探索
      while (mid > 0 && arr[mid - 1].id === id) {
        mid--;
      }
      return arr[mid];
    } else if (arr[mid].id < id) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  // 探索する数値が配列に存在しない場合はnullを返す
  return null;
}

export function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array; // for chaining
}
