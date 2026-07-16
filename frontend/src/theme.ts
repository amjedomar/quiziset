import { extendTheme } from '@mui/joy'

export const theme = extendTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    JoyButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState.size === 'md' && {
            paddingInline: '14px',
            [theme.breakpoints.down('md')]: {
              '--Button-paddingBlock': '8px',
              paddingInline: '16px',
            },
            [theme.breakpoints.down('sm')]: {
              minHeight: 40,
            },
          }),
        }),
      },
    },
    JoyIconButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState.size === 'md' && {
            [theme.breakpoints.down('sm')]: {
              padding: '7px',
            },
          }),
        }),
      },
    },
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          // Please also update "theme.scss" with the same values
          50: '#e7e9ed',
          100: '#c1c8d5',
          200: '#9aa5b8',
          300: '#74829a',
          400: '#586887',
          500: '#3b5076',
          600: '#35486e',
          700: '#2d3f63',
          800: '#273656',
          900: '#1e263d',
        },
      },
    },
  },
})
