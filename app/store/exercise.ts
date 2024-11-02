import { create } from 'zustand';

interface StoreState {
    runningExerciseId: number | null;
    setRunningExerciseId: (id: number | null) => void;
}

export const useStore = create<StoreState>((set) => ({
    runningExerciseId: null,
    setRunningExerciseId: (id: number | null) => set({ runningExerciseId: id }),
}));