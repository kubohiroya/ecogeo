import { PrimitiveAtom, useAtom } from 'jotai';
import {
  applyPatches,
  Draft,
  Objectish,
  Patch,
  produceWithPatches,
} from 'immer';

type PatchPair = {
  patch: Patch[];
  inversePatch: Patch[];
  label?: string;
};

export interface UndoRedoState<T extends Objectish> {
  current: T;
  history: PatchPair[];
  future: PatchPair[];
  staging: PatchPair[];
}

export const createInitialState = <T extends Objectish>(
  initialState: T
): UndoRedoState<T> => {
  return {
    current: initialState,
    history: [],
    future: [],
    staging: [],
  };
};

function removeRedundantPatches(src: PatchPair[]): PatchPair | null {
  const paths = new Set<string>();
  const inversePaths = new Set<string>();

  const filteredPatch = [] as Patch[];
  const inverseFilteredPatch = [] as Patch[];

  for (let i = src.length - 1; i >= 0; i--) {
    const patchPair = src[i];
    for (let j = src[i].patch.length - 1; j >= 0; j--) {
      const patch = patchPair.patch[j];
      const path = JSON.stringify(patch.path);

      if (patch.op === 'replace' && paths.has(path)) {
        continue;
      }
      paths.add(path);
      filteredPatch.push(patch);
    }
  }

  for (let i = 0; i < src.length; i++) {
    const patchPair = src[i];
    for (let j = 0; j < src[i].patch.length; j++) {
      const inversePatch = patchPair.inversePatch[j];
      const inversePath = JSON.stringify(inversePatch.path);

      if (inversePatch.op === 'replace' && inversePaths.has(inversePath)) {
        // このパスに対するreplace操作は既に見つけているので、このパッチはスキップ
        continue;
      }
      inversePaths.add(inversePath);
      // このパッチは必要なので、セットにパスを追加し、フィルタリングされたパッチ配列に追加
      inverseFilteredPatch.push(inversePatch);
    }
  }

  if (filteredPatch.length == 0 && inverseFilteredPatch.length == 0) {
    return null;
  }

  // 後ろから走査しているので、元の順序に戻す
  return {
    patch: filteredPatch.reverse(),
    inversePatch: inverseFilteredPatch,
  };
}

export const useUndoRedo = <T extends Objectish>(
  undoRedoAtom: PrimitiveAtom<UndoRedoState<T>>, //initialState: T,
  maxHistoryLength = 30
) => {
  const [{ history, future, current, staging }, setUndoRedo] =
    useAtom(undoRedoAtom);

  const set = (
    updateFunction: (draft: Draft<T>) => void,
    commit: boolean = true,
    label?: string
  ) => {
    const [nextState, patches, inversePatches] = produceWithPatches(
      current,
      updateFunction
    );

    const newPathPairItem = {
      patch: patches,
      inversePatch: inversePatches,
      label,
    };

    if (commit) {
      const newPatchPair = removeRedundantPatches(
        staging.length > 0 ? staging : [newPathPairItem]
      );

      if (newPatchPair == null) {
        return;
      }

      // console.log('commit', label, newPatchPair.patch);

      setUndoRedo((prev) => {
        const newHistory =
          prev.history.length >= maxHistoryLength
            ? [...prev.history.slice(1), newPatchPair]
            : [...prev.history, newPatchPair];
        return {
          current: nextState,
          history: newHistory,
          future: [],
          staging: [],
        };
      });
    } else {
      const newStaging = [...staging, newPathPairItem];
      setUndoRedo((prev) => ({
        ...prev,
        current: nextState,
        staging: newStaging,
      }));
    }
  };

  const undo = () => {
    setUndoRedo((prev) => {
      if (history.length === 0 || prev.history.length === 0) return prev;
      const lastPatchPair = history[prev.history.length - 1];
      if (!lastPatchPair) return prev;
      const newCurrent = applyPatches(prev.current, lastPatchPair.inversePatch);
      return {
        history: prev.history.slice(0, -1),
        future: [lastPatchPair, ...prev.future],
        current: newCurrent,
        staging: [],
      };
    });
  };

  const redo = () => {
    setUndoRedo((prev) => {
      if (future.length === 0 || prev.future.length === 0) return prev;
      const nextPatchPair = prev.future[0];
      if (!nextPatchPair) return prev;
      const newCurrent = applyPatches(prev.current, nextPatchPair.patch);
      return {
        history: [...prev.history, nextPatchPair],
        future: prev.future.slice(1),
        current: newCurrent,
        staging: [],
      };
    });
  };

  return { set, undo, redo, history, future, staging, current };
};
