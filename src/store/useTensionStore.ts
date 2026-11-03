"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CategoryId } from "@/types";

export interface Challenge {
  code: string;
  name: string;
}

interface TensionState {
  selected: CategoryId[];
  /** Share code of the user's own latest result. */
  code: string | null;
  name: string;
  soundOn: boolean;
  /** True right after finishing the quiz, until the reveal plays once. */
  pendingReveal: boolean;
  challenge: Challenge | null;
  toggleCategory: (id: CategoryId) => void;
  setSelected: (ids: CategoryId[]) => void;
  finish: (code: string) => void;
  clearReveal: () => void;
  setName: (name: string) => void;
  toggleSound: () => void;
  setChallenge: (challenge: Challenge | null) => void;
}

export const useTensionStore = create<TensionState>()(
  persist(
    (set) => ({
      selected: [],
      code: null,
      name: "",
      soundOn: false,
      pendingReveal: false,
      challenge: null,
      toggleCategory: (id) =>
        set((s) => ({
          selected: s.selected.includes(id) ? s.selected.filter((c) => c !== id) : [...s.selected, id],
        })),
      setSelected: (ids) => set({ selected: ids }),
      finish: (code) => set({ code, pendingReveal: true }),
      clearReveal: () => set({ pendingReveal: false }),
      setName: (name) => set({ name }),
      toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
      setChallenge: (challenge) => set({ challenge }),
    }),
    {
      name: "tension-mapun",
      skipHydration: true,
      partialize: ({ selected, code, name, soundOn, challenge }) => ({ selected, code, name, soundOn, challenge }),
    },
  ),
);

/** False during SSR and until localStorage has been read on the client. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useTensionStore.persist.onFinishHydration(onChange),
    () => useTensionStore.persist.hasHydrated(),
    () => false,
  );
}
