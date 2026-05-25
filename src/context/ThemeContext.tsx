import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'app-theme';

// FE-SHR-04: SSR-safe — `window` / `localStorage` postoje samo u browseru.
// Bez ovih guard-ova, bilo koji SSR/Node test renderer pri import-u modula
// puca sa "window is not defined". Vitest jsdom env ima window i ovi guard-i
// su no-op tamo; bezbedno za buduce SSR migracije (Next.js, Remix, RSC).
const IS_BROWSER = typeof window !== 'undefined';

function getSystemTheme(): 'light' | 'dark' {
  if (!IS_BROWSER) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readStoredTheme(): Theme {
  if (!IS_BROWSER) return 'system';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch {
    // localStorage moze pucati u privacy modu / iframe sandbox-u.
  }
  return 'system';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readStoredTheme);

  useEffect(() => {
    if (!IS_BROWSER) return;

    const root = document.documentElement;

    const applyTheme = () => {
      const resolved = theme === 'system' ? getSystemTheme() : theme;
      root.classList.remove('light', 'dark');
      root.classList.add(resolved);
    };

    applyTheme();
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Privacy mode / quota issues — silent fail; tema i dalje radi u memoriji.
    }

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme();
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
