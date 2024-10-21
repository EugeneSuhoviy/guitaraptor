import { create } from 'zustand'

export const useStore = create((set) => ({
    runningExerciseId: null,
    setRunningExerciseId: (id: number) => set({ runningExerciseId: id }),
}))
