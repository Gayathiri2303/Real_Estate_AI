import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  light: {
    name: 'Light',
    primary: '#2563eb',
    secondary: '#3b82f6',
    background: '#f1f5f9',
    card: '#ffffff',
    text: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    success: '#10b981',
    danger: '#ef4444',
  },
  dark: {
    name: 'Dark',
    primary: '#3b82f6',
    secondary: '#60a5fa',
    background: '#0f172a',
    card: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#334155',
    success: '#10b981',
    danger: '#ef4444',
  },
  blue: {
    name: 'Ocean Blue',
    primary: '#0ea5e9',
    secondary: '#38bdf8',
    background: '#f0f9ff',
    card: '#ffffff',
    text: '#0c4a6e',
    textSecondary: '#0369a1',
    border: '#bae6fd',
    success: '#10b981',
    danger: '#ef4444',
  },
  green: {
    name: 'Forest Green',
    primary: '#059669',
    secondary: '#34d399',
    background: '#f0fdf4',
    card: '#ffffff',
    text: '#064e3b',
    textSecondary: '#047857',
    border: '#bbf7d0',
    success: '#10b981',
    danger: '#ef4444',
  },
  purple: {
    name: 'Royal Purple',
    primary: '#7c3aed',
    secondary: '#a78bfa',
    background: '#faf5ff',
    card: '#ffffff',
    text: '#4c1d95',
    textSecondary: '#6d28d9',
    border: '#ddd6fe',
    success: '#10b981',
    danger: '#ef4444',
  },
  orange: {
    name: 'Sunset Orange',
    primary: '#ea580c',
    secondary: '#fb923c',
    background: '#fff7ed',
    card: '#ffffff',
    text: '#9a3412',
    textSecondary: '#c2410c',
    border: '#fed7aa',
    success: '#10b981',
    danger: '#ef4444',
  },
};

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const theme = themes[themeName] || themes.light;

  useEffect(() => {
    localStorage.setItem('theme', themeName);
    
    // Apply theme to body
    document.body.style.backgroundColor = theme.background;
    document.body.style.color = theme.text;
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';

    // Optional: set data attribute for CSS
    document.documentElement.setAttribute('data-theme', themeName);
  }, [themeName, theme]);

  const changeTheme = (name) => {
    if (themes[name]) {
      setThemeName(name);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, changeTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}