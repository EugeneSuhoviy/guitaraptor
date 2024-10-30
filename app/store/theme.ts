import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
    theme: string;
    setTheme: (theme: string) => void;
}

const useThemeStore = create(persist<ThemeState>(
    (set, get) => ({
        theme: "cupcake",
        setTheme: () => set((state) => ({
            ...state,
            theme: get().theme === "night" ? "cupcake" : "night"
        })),
    }), {
    name: 'theme',
}
));

export const useTheme = () => useThemeStore((state) => state.theme);
export const useSetTheme = () => useThemeStore((state) => state.setTheme);
