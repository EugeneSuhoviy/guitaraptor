import { create } from 'zustand'

interface StoreState {
    runningExerciseId: number | null;
}


export const useStore = create<StoreState>((set) => ({
    runningExerciseId: null,
    setRunningExerciseId: (id: number) => set({ runningExerciseId: id }),
}))
