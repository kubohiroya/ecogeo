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

/*
const array1 = [1, 2, 3];
const array2 = [2, 3, 4];
const result = arrayXOR(array1, array2);
console.log(result); // [1, 4]
const array1 = [0, 2];
const array2 = [1];
const result = arrayXOR(array1, array2);
console.log(result); // [1, 4]
 */
