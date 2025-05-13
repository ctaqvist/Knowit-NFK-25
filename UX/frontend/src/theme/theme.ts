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
      fontSize: 20,
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
                '&:hover, :focus': {
                  boxShadow: '8px 8px 14px 0px rgba(255, 255, 255, 0.24)',
                  border: '1px solid rgba(255, 255, 255, 0.50)',
                  backgroundColor: '#5526FF',
                },

                '&.Mui-disabled': {
                  backgroundColor: '#180757',
                  color: 'rgba(255, 255, 255, 0.70)',
                  '& img': { opacity: 0.7 },
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
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(24, 7, 87, 0.60)',
                  color: 'rgba(255, 255, 255, 0.70)',
                },
              },
            },
            {
              props: { color: 'grey' },
              style: {
                color: '#FFF',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(255, 255, 255, 0.10)',
                  color: 'rgba(255, 255, 255, 0.50)',
                },
                '&:hover': { backgroundColor: 'rgba(188, 197, 255, 0.50)' },
                '&:focus': { backgroundColor: 'rgba(188, 197, 255, 0.50)' },
              },
            },
            { props: { variant: 'contained', size: 'xsmall' }, style: {
              padding: '12px 16px', fontSize: 14,
              '&:hover': {boxShadow: 'none'},
              '&:focus': { boxShadow: 'none'}
            } },
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
    MuiTabs: {
      styleOverrides: {
        root: {
          maxWidth: 1280,
          justifyContent: 'center',
          m: 'auto',
          backgroundColor: 'rgba(188, 197, 255, 0.10)',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          overflow: 'visible !important',
          gap: '20px',
          borderBottom: '2px solid #5526FF',
          height: 71,

          '& .MuiTabs-list': { height: '100%', gap: '20px' },
          '& .MuiTabs-scroller': { overflow: 'visible !important' },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: 'Lexend Exa',
          fontSize: 20,
          fontStyle: 'normal',
          fontWeight: 500,
          lineHeight: 'normal',
          textTransform: 'uppercase',
          maxWidth: '100%',
          color: 'rgba(255, 255, 255, 0.8)',
          flex: 1,
          '&.Mui-selected': {
            backgroundColor: '#5526FF',
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            color: 'white',
            boxShadow: '0px 23px 41.3px 0px rgba(85, 38, 255, 0.40)',
          },
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
          fontSize: 18,

          // Default border
          border: '1px solid rgba(188, 197, 255, 1)',

          // Focused border
          '& fieldset, fieldset:focus': { border: 'none' },
          '&:has(input:focus, fieldset:focus, :focus)': {
            border: '1px solid rgba(85, 38, 255, 1)',
            boxShadow:
              '8px 10px 14px 0px rgba(85, 38, 255, 0.24), inset 0px 0px 0px 2px rgba(85, 38, 255, 1)',
          },

          // Hover border
          '&:hover': { border: '1px solid rgba(188, 197, 255, 1)' },

          '&::placeholder': { color: 'rgb(93 92 101)' },
          '& input': {
            WebkitTextFillColor: '#fff',
            transition: 'background-color 5000s ease-in-out 0s',
          },

          // Autofill
          '& input:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 1000px #181724 inset',
            WebkitTextFillColor: '#fff',
            caretColor: '#fff',
            transition: 'background-color 5000s ease-in-out 0s',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&:hover': { border: 'none' },

          // Disabled
          '&.Mui-disabled': {
            backgroundColor: 'rgba(139, 139, 139, 0.05)',
            border: '1px solid rgba(139, 139, 139, 0.40)',

            '&:hover': { border: '1px solid rgba(139, 139, 139, 0.40)' },
          },
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
          padding: '1rem 2rem',
          backgroundColor: 'rgba(24, 7, 87, 0.80)',
          backdropFilter: 'blur(20px)',
          color: '#FFF',
          alignItems: 'center',
          gap: '10px',
          position: 'fixed',
          top: 94.89,
          left: '50&',
          zIndex: 10,
          margin: '0 auto',
          fontSize: 20,
          fontWeight: 500,
          fontFamily: 'Lexend Exa, sans-serif',
          '& svg': { width: 50, height: 50 },
          height: 210,
          minWidth: 513,
          maxWidth: 850,
          opacity: 0,
          borderRadius: '0px 0px 20px 20px',

          // Alert animation
          transition: 'opacity 500ms',
          animationName: 'fadeInOut',
          animationDuration: '5000ms',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'backgroundColor 0s',
          '&:hover': { backgroundColor: 'inherit' },
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(188, 197, 255, 0.10)',
          padding: '12px 20px',
          border: '1px solid #BCC5FF',
          borderRadius: '10px',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          padding: '16px',
          borderRadius: '10px',
          background: '#05030C',
          marginBottom: '10px',
          fontFamily: 'Instrument Sans',
          fontSize: 18,
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: 'normal',
          transition: 'all 200ms',
          '&:hover': {
            background: 'linear-gradient(90deg, #05030C 0%, #180757 100%)',
          },
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        root: {
          '& .Mui-selected': { background: '#05030C' },
          '& .Mui-selected:hover': {
            background: 'linear-gradient(90deg, #05030C 0%, #180757 100%)',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          variants: [
            {
              // Create variant: Link that has visual
              // style of a button
              props: { variant: 'button' },
              style: {
                color: 'white',
                textDecoration: 'none',
                backgroundColor: '#5526FF',
                width: 'fit-content',
                display: 'inline-flex',
                padding: '20px 28px',
                alignItems: 'center',
                gap: '20px',
                borderRadius: '16px',
                fontWeight: 500,
                textTransform: 'uppercase',
                boxSizing: 'border-box',
                transition: 'box-shadow 30ms',
                fontSize: 'clamp(18px, 3vw, 20px)',
                '&:hover, :focus': {
                  boxShadow: '8px 8px 14px 0px rgba(255, 255, 255, 0.24)',
                  border: '1px solid rgba(255, 255, 255, 0.50)',
                  backgroundColor: '#5526FF',
                },
              },
            },
          ],
        },
      },
    },
  },
});
