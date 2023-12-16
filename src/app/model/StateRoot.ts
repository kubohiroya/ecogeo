import { UndoRedoSessionState } from './Sessions';
import { Session } from './Session';
import { Atom } from 'jotai/vanilla/atom';
import { PrimitiveAtom } from 'jotai';

export interface StateRoot {
  sessionIdsAtom: Atom<string[]>;
  sessionAtoms: PrimitiveAtom<Record<string, PrimitiveAtom<Session>>>;
  sessionStateAtoms: PrimitiveAtom<
    Record<string, PrimitiveAtom<UndoRedoSessionState>>
  >;
}
