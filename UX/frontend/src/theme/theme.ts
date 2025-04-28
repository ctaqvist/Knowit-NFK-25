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
  main: {
    error: '#FF3131',
  },
};

export const theme = createTheme({
  palette: {
    ...themePalette,
  },
  typography: {
    fontFamily: "'Lexend Exa', 'Instrument Sans', sans-serif",
    h1: {
      fontSize: 36,
      fontWeight: 700,
      fontFamily: 'Lexend Exa, sans-serif',
      textWrap: 'balance',
    },
    h2: {
      fontSize: 36,
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
      fontSize: 20,
      fontWeight: 400,
      fontFamily: 'Instrument Sans, sans-serif',
      lineHeight: '30px',
    },
    body2: {
      fontSize: 18,
      fontWeight: 400,
      fontFamily: 'Instrument Sans, sans-serif',
    },
    body3: {
      fontSize: '16px',
      fontWeight: 400,
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
    subheading: {
      fontSize: 28,
      fontWeight: 500,
      fontFamily: 'Lexend Exa, sans-serif',
    },
    subheading2: {
      fontSize: 20,
      fontWeight: 500,
      fontFamily: 'Lexend Exa, sans-serif',
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
          '& a': {
            color: 'text.primary',
            textDecoration: 'none',
            transition: 'text-shadow 60ms',
          },
          '& a:is(#logo) img': {
            transition: 'filter 60ms',
            transitionDelay: 0,
          },
          '& a:is(#logo):hover img': {
            filter: 'drop-shadow(0px 10px 10px #5526FF)',
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
          width: 'fit-content',
          maxWidth: '100%',
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
                  backgroundColor: '#5526FF',
                },
              },
            },
            {
              props: { variant: 'contained', size: 'small' },
              style: {
                padding: '14px 20px',
                fontSize: 16,
                fontWeight: 500,
                gap: '10px',
                borderRadius: '16px',
                '&:hover': {
                  boxShadow: '6px 6px 14px 0px rgba(255, 255, 255, 0.20)',
                },
              },
            },
            {
              props: { variant: 'text_contained' },
              style: {
                backgroundColor: '#5526FF',
                color: '#FFF',
                '&:hover': { backgroundColor: '#3C16C3' },
              },
            },
          ],
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          zIndex: 2,
          '&::after': {
            content: '""',
            display: 'block',
            height: '1px',
            width: '100%',
            background:
              'linear-gradient(90deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.45) 29.81%, rgba(255, 255, 255, 0.50) 49.04%, rgba(255, 255, 255, 0.45) 68.27%, rgba(255, 255, 255, 0.10) 100%)',
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: 30,
          fill: '#FFF',
          color: '#FFF',
          variants: [
            {
              props: { color: 'primary' },
              fill: '#FFF',
              color: '#FFF',
            },
            {
              props: { size: 'small' },
              fontSize: 20,
            },
            {
              props: { size: 'large' },
              fontSize: 40,
            },
          ],
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          '& p': { fontWeight: 700 },
          padding: 0,
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '0 0 2rem',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          maxWidth: '100%',
          color: '#FFF',
          flex: 1,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#05030C',
        },
      },
    },
    MuiFormHelperText: {
      defaultProps: {
        component: 'span', // Prevent descendant error
      },
      styleOverrides: {
        root: {
          marginLeft: 0,
          fontSize: 18,
          fontFamily: 'Instrument Sans, sans-serif',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          backgroundColor: '#181724',
          border: '1px solid rgba(188, 197, 255, 1)',
          '&::placeholder': { color: 'rgb(93 92 101)' },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#FFF',
          fontFamily: 'Instrument Sans, sans-serif',
          color: 'rgba(5, 3, 12, 1)',
          fontWeight: 400,
          textAlign: 'center',
          fontSize: 14,
          padding: '6px 10px',
          maxWidth: 170,
           lineHeight: 'normal',
          
        },
        arrow: {
          '&:before': {
            backgroundColor: '#FFF',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          zIndex: 4,
          padding: '1rem 2rem',
          backgroundColor: '#180757',
          color: '#FFF',
          alignItems: 'center',
          gap: '10px',
          position: 'fixed',
          top: '6rem',
          maxWidth: 846,
          margin: '0 auto',
          transition: 'opacity 500ms',
          animationName: 'fadeOut',
          animationDelay: '3000ms',
          animationDuration: '1000ms',
        }
      }
    },
  },
});
