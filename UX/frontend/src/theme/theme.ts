import { createTheme } from '@mui/material'

const themePalette = {
  primary: {
    main: '#5526FF',
    light: '#BCC5FF',
    dark: '#180757',
    background: '#05030C'
  },
  text: {
    primary: '#FFF',
    secondary: '#05030C',
    light: '#BCC5FF'
  },
}

export const theme = 
createTheme({
  palette: {
    ...themePalette
  },
  typography: {
    fontFamily: "'Lexend Exa', 'Instrument Sans', sans-serif",
    h1: { fontSize: '2rem', fontWeight: 500, fontFamily: 'Lexend Exa, sans-serif' },
    h2: { fontSize: '1.75rem', fontWeight: 500, fontFamily: 'Lexend Exa, sans-serif' },
    h3: { fontSize: '1.5rem', fontWeight: 500, fontFamily: 'Lexend Exa, sans-serif' },
    h4: { fontSize: '1.25rem', fontWeight: 500, fontFamily: 'Lexend Exa, sans-serif' },
    h5: { fontSize: '1rem', fontWeight: 500, fontFamily: 'Lexend Exa, sans-serif' },
    h6: { fontSize: '0.875rem', fontWeight: 500, fontFamily: 'Lexend Exa, sans-serif' },
    body1: { fontSize: '1rem', fontWeight: 400, fontFamily: 'Instrument Sans, sans-serif'},
    body2: { fontSize: '0.875rem', fontWeight: 400, fontFamily: 'Instrument Sans, sans-serif' },
    headerlink: { fontSize: '0.8rem', fontWeight: 500, fontFamily: 'Instrument Sans, sans-serif', color: 'text.primary'},
    footerlabel: { fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(0,0,0,0.2)',
    '0px 1px 5px rgba(0,0,0,0.2)',
    '0px 1px 8px rgba(0,0,0,0.2)',
    '0px 1px 10px rgba(0,0,0,0.2)',
    '0px 1px 14px rgba(0,0,0,0.2)',
    '0px 1px 18px rgba(0,0,0,0.2)',
    '0px 2px 4px rgba(0,0,0,0.2)',
    '0px 2px 6px rgba(0,0,0,0.2)',
    '0px 2px 8px rgba(0,0,0,0.2)',
    '0px 2px 10px rgba(0,0,0,0.2)',
    '0px 2px 12px rgba(0,0,0,0.2)',
    '0px 2px 14px rgba(0,0,0,0.2)',
    '0px 2px 16px rgba(0,0,0,0.2)',
    '0px 2px 18px rgba(0,0,0,0.2)',
    '0px 2px 20px rgba(0,0,0,0.2)',
    '0px 2px 22px rgba(0,0,0,0.2)',
    '0px 2px 24px rgba(0,0,0,0.2)',
    '0px 2px 26px rgba(0,0,0,0.2)',
    '0px 2px 28px rgba(0,0,0,0.2)',
    '0px 2px 30px rgba(0,0,0,0.2)',
    '0px 2px 32px rgba(0,0,0,0.2)',
    '0px 2px 34px rgba(0,0,0,0.2)',
    '0px 2px 36px rgba(0,0,0,0.2)',
    '0px 27px 47.4px #5526FF', // Custom shadow
  ],
})
