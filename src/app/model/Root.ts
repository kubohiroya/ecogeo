import { Atom } from "jotai/vanilla/atom";
import { Session } from "./Session";
import { PrimitiveAtom } from "jotai";
import { atom } from "jotai/index";
import { UndoRedoState } from "../hooks/useUndoRedo";
import { SessionState } from "./SessionState";
import { enablePatches } from "immer";

enablePatches();

export type UndoRedoSessionState = UndoRedoState<SessionState>;

export interface Root {
  sessionIdsAtom: Atom<string[]>;
  sessionAtoms: Record<string, PrimitiveAtom<Session>>;
  sessionStateAtoms: Record<string, PrimitiveAtom<UndoRedoSessionState>>;
  sessionTitlesAtom: Atom<Map<string, string>>;
}

const sessionAtoms = {};
const sessionStateAtoms: Record<
  string,
  PrimitiveAtom<UndoRedoSessionState>
> = {};

const sessionIdsAtom = atom((get) =>
  Object.keys(get(rootAtom).sessionStateAtoms).sort((a: string, b: string) => {
    const key_a = get(get(rootAtom).sessionStateAtoms[a]).current.country.title;
    const key_b = get(get(rootAtom).sessionStateAtoms[b]).current.country.title;
    return key_a < key_b ? -1 : key_a > key_b ? 1 : 0;
  })
);

const sessionTitlesAtom = atom(
  (get) =>
    new Map(
      get(sessionIdsAtom).map((sessionId) => [
        sessionId,
        get(get(rootAtom).sessionStateAtoms[sessionId]).current.country.title
      ])
    )
);

const root: Root = {
  sessionAtoms,
  sessionStateAtoms,
  sessionIdsAtom,
  sessionTitlesAtom
};

export const rootAtom = atom(root);
