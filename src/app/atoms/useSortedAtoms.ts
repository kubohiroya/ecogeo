import { Atom } from 'jotai/vanilla/atom';
import { atom, PrimitiveAtom, useAtomValue } from 'jotai';

export function useSortedAtoms<K extends string, V>(
  dataAtom: Atom<Record<K, V>>,
  compareFunction: (a: V, b: V) => number
): Array<PrimitiveAtom<V>> {
  // コンポーネント内でAtomの値を取得
  const data = useAtomValue(dataAtom);

  // Recordから配列に変換
  const entries = Object.entries(data) as [K, V][];

  // 比較関数に基づいてソート
  const sortedEntries = entries.sort((a, b) => compareFunction(a[1], b[1]));

  // ソートされた各要素に対応するAtomを作成
  return sortedEntries.map(([_, value]) => atom(value));
}
