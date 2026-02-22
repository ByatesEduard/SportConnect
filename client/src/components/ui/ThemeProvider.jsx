import React from 'react'

// Theme constants for the new design
export const THEME = {
  colors: {
    bg: '#0d0f14',
    surface: '#13161d',
    surface2: '#1a1e27',
    border: '#252833',
    borderFocus: '#24ae7c',
    text: '#e8eaf0',
    muted: '#6b7280',
    green: '#24ae7c',
    greenDim: 'rgba(36,174,124,0.12)',
    red: '#f87171',
  },
  font: 'Plus Jakarta Sans, sans-serif',
}

// CSS-in-JS styles for the theme
export const themeCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { 
    box-sizing: border-box; 
    margin: 0; 
    padding: 0; 
  }

  :root {
    --bg: ${THEME.colors.bg};
    --surface: ${THEME.colors.surface};
    --surface2: ${THEME.colors.surface2};
    --border: ${THEME.colors.border};
    --border-focus: ${THEME.colors.borderFocus};
    --text: ${THEME.colors.text};
    --muted: ${THEME.colors.muted};
    --green: ${THEME.colors.green};
    --green-dim: ${THEME.colors.greenDim};
    --red: ${THEME.colors.red};
    --font: ${THEME.font};
  }

  body { 
    background: var(--bg); 
    color: var(--text); 
    font-family: var(--font); 
    min-height: 100vh; 
  }

  /* App Layout */
  .app-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .app-main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .app-main.with-navbar {
    padding-top: 64px; /* Height of navbar */
  }

  /* For pages without navbar (login, register) */
  .app-main:not(.with-navbar) {
    min-height: 100vh;
  }
`

export const ThemeProvider = ({ children }) => {
  return (
    <>
      <style>{themeCSS}</style>
      {children}
    </>
  )
}

export default ThemeProvider
