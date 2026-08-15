import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

function ThemeSelector() {
  const { theme, themeName, changeTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          padding: '7px 12px',
          background: theme.card,
          border: `1px solid ${theme.border}`,
          borderRadius: '8px',
          cursor: 'pointer',
          color: theme.text,
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        🎨 {themes[themeName]?.name || 'Theme'}
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: '110%',
          right: 0,
          background: theme.card,
          border: `1px solid ${theme.border}`,
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          padding: '8px',
          zIndex: 2000,
          minWidth: '160px'
        }}>
          {Object.keys(themes).map((key) => (
            <button
              key={key}
              onClick={() => {
                changeTheme(key);
                setOpen(false);
              }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
                background: themeName === key ? `${theme.primary}18` : 'transparent',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                color: theme.text,
                fontWeight: themeName === key ? 600 : 400,
                fontSize: '13px'
              }}
            >
              {themes[key].name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ThemeSelector;