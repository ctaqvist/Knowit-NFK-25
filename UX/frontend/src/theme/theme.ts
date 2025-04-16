import { createTheme } from '@mui/material';

const themePalette = {
  primary: {
    main: '#5526FF',
    light: '#BCC5FF',
    dark: '#180757',
    background: '#05030C',
  },
  text: {
    primary: '#FFF',
    secondary: '#05030C',
    light: '#BCC5FF',
  },
};

export const theme = createTheme({
  palette: {
    ...themePalette,
  },
  typography: {
    fontFamily: "'Lexend Exa', 'Instrument Sans', sans-serif",
    h1: {
      fontSize: 'clamp(40px, 3vw, 48px);',
      fontWeight: 700,
      fontFamily: 'Lexend Exa, sans-serif',
      textWrap: 'balance'
    },
    h2: {
      fontSize: '36px',
      fontWeight: 700,
      fontFamily: 'Lexend Exa, sans-serif',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
      fontFamily: 'Lexend Exa, sans-serif',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      fontFamily: 'Lexend Exa, sans-serif',
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 500,
      fontFamily: 'Lexend Exa, sans-serif',
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 500,
      fontFamily: 'Lexend Exa, sans-serif',
    },
    body1: {
      fontSize: '20px',
      fontWeight: 400,
      fontFamily: 'Instrument Sans, sans-serif',
      lineHeight: '30px'
    },
    body2: {
      fontSize: '18px',
      fontWeight: 400,
      fontFamily: 'Instrument Sans, sans-serif',
    },
    body3: {
      fontSize: '16px',
      fontFamily: 'Instrument Sans, sans-serif',
    },
    headerlink: {
      fontSize: '18px',
      fontWeight: 500,
      fontFamily: 'Instrument Sans, sans-serif',
      color: 'text.primary',
      letterSpacing: '2.16px',
    },
    footerlabel: {
      fontSize: '24px',
      letterSpacing: '2.88px',
      fontWeight: 700,
    },
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
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(5, 3, 12, 0.02)',
          backdropFilter: 'blur(15px)',
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          gap: '85.68px',
          padding: '17px',
          bgcolor: 'transparent',
          boxShadow: 'none',
          filter: 'drop-shadow(0px 11px 10px black)',
          '& a :hover': { textShadow: '0px 9px 8px #5526FF' },
          '& a': { color: 'text.primary', textDecoration: 'none', transition: 'text-shadow 60ms' },
          '& a:is(#logo) img': { transition: 'filter 60ms',  transitionDelay: 0 },
          '& a:is(#logo):hover img': {
            filter: 'drop-shadow(0px 10px 10px #5526FF)'
          }, //
          '& a:not(#logo)::after': {
            content: '""',
            width: '0%',
            backgroundColor: '#FFF',
            height: '1px',
            display: 'block',
            transition: 'width 100ms',
          },
          '& a:not(#logo):hover::after': { width: '100%' },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: { variant: 'contained' },
              style: {
                width: 'fit-content',
                display: 'inline-flex',
                padding: '20px 28px',
                alignItems: 'center',
                gap: '20px',
                borderRadius: '16px',
                backgroundColor: 'primary.main',
                fontWeight: 500,
                textTransform: 'uppercase',
                color: 'text.primary',
                boxSizing: 'border-box',
                transition: 'box-shadow 30ms',
                fontSize: 'clamp(18px, 3vw, 20px)',
                '&:hover': {
                  boxShadow: '8px 8px 14px 0px rgba(255, 255, 255, 0.24)',
                  border: '1px solid rgba(255, 255, 255, 0.50)',
                  backgroundColor: '#5526FF'
                }
              }
            }
          ]
        }
      }
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true
      }
    }
  },
});
