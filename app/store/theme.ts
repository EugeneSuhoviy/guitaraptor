import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { THEME_TYPES } from '@/utils/constants';

interface ThemeState {
    theme: string;
    setTheme: (theme: string) => void;
}

const useThemeStore = create(persist<ThemeState>(
    (set, get) => ({
        theme: THEME_TYPES.THEME_LIGHT,
        setTheme: () => set((state) => ({
            ...state,
            theme: get().theme === THEME_TYPES.THEME_DARK ? THEME_TYPES.THEME_LIGHT : THEME_TYPES.THEME_DARK
        })),
    }), {
    name: 'theme',
}
));

export const useTheme = () => useThemeStore((state) => state.theme);
export const useSetTheme = () => useThemeStore((state) => state.setTheme);
