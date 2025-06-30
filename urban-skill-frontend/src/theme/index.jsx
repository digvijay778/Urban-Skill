// src/themes/index.js
import { createTheme } from '@mui/material/styles';

// ===== COLOR PALETTE (Your existing colors) =====
const colors = {
  primary: {
    50: '#f0f0ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1', // Main primary color - Indigo
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    main: '#6366f1',
    light: '#818cf8',
    dark: '#4338ca',
    contrastText: '#ffffff',
  },
  secondary: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Main secondary color - Amber
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    main: '#f59e0b',
    light: '#fcd34d',
    dark: '#d97706',
    contrastText: '#ffffff',
  },
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    main: '#10b981',
    light: '#34d399',
    dark: '#047857',
    contrastText: '#ffffff',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    main: '#ef4444',
    light: '#f87171',
    dark: '#b91c1c',
    contrastText: '#ffffff',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    main: '#f59e0b',
    light: '#fcd34d',
    dark: '#b45309',
    contrastText: '#ffffff',
  },
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    main: '#3b82f6',
    light: '#60a5fa',
    dark: '#1d4ed8',
    contrastText: '#ffffff',
  },
  grey: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  background: {
    default: '#ffffff',
    paper: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
  },
  text: {
    primary: '#1f2937',
    secondary: '#6b7280',
    disabled: '#9ca3af',
  },
};

// ===== TYPOGRAPHY CONFIGURATION =====
const typography = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  
  // Font weights
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 600,
  fontWeightExtraBold: 700,

  // Responsive headings
  h1: {
    fontSize: '3.5rem',
    fontWeight: 800,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    '@media (max-width:600px)': {
      fontSize: '2.5rem',
    },
  },
  h2: {
    fontSize: '3rem',
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
    '@media (max-width:600px)': {
      fontSize: '2rem',
    },
  },
  h3: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.3,
    '@media (max-width:600px)': {
      fontSize: '1.75rem',
    },
  },
  h4: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.4,
    '@media (max-width:600px)': {
      fontSize: '1.5rem',
    },
  },
  h5: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
    '@media (max-width:600px)': {
      fontSize: '1.25rem',
    },
  },
  h6: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },

  // Body text
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.6,
    '@media (max-width:600px)': {
      fontSize: '0.875rem',
    },
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.6,
  },

  // Captions and labels
  caption: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.025em',
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },

  // Buttons
  button: {
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '0.025em',
    textTransform: 'none',
  },
};

// ===== BREAKPOINTS =====
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
};

// ===== SPACING =====
const spacing = 8; // Base spacing unit (8px)

// ===== SHADOWS (Updated with your color scheme) =====
const shadows = [
  'none',
  '0 1px 3px 0 rgba(99, 102, 241, 0.1), 0 1px 2px 0 rgba(99, 102, 241, 0.06)',
  '0 4px 6px -1px rgba(99, 102, 241, 0.1), 0 2px 4px -1px rgba(99, 102, 241, 0.06)',
  '0 10px 15px -3px rgba(99, 102, 241, 0.1), 0 4px 6px -2px rgba(99, 102, 241, 0.05)',
  '0 20px 25px -5px rgba(99, 102, 241, 0.1), 0 10px 10px -5px rgba(99, 102, 241, 0.04)',
  '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
  '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
  '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
  '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
  '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
  '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
  '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
  '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
  '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
  '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
  '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
  '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
  '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
  '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
  '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
  '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
  '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
  '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
  '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
  '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
];

// ===== COMPONENT CUSTOMIZATIONS =====
const components = {
  // Button customizations
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        borderRadius: 8,
        fontWeight: 600,
        fontSize: '0.875rem',
        padding: '10px 24px',
        boxShadow: 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transform: 'translateY(-1px)',
        },
      },
      contained: {
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        '&:hover': {
          background: 'linear-gradient(135deg, #5b5bd6 0%, #7c3aed 100%)',
        },
      },
      sizeLarge: {
        padding: '12px 32px',
        fontSize: '1rem',
      },
      sizeSmall: {
        padding: '6px 16px',
        fontSize: '0.75rem',
      },
    },
  },

  // Card customizations
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #f3f4f6',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },

  // Paper customizations
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 12,
      },
      elevation1: {
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
    },
  },

  // TextField customizations
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
          transition: 'all 0.3s ease',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.primary.main,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.primary.main,
            boxShadow: `0 0 0 3px rgba(99, 102, 241, 0.1)`,
          },
        },
      },
    },
  },

  // Chip customizations
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 20,
        fontWeight: 500,
      },
    },
  },

  // AppBar customizations
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: '#ffffff',
        color: colors.text.primary,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      },
    },
  },

  // Drawer customizations
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRadius: 0,
        border: 'none',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },

  // Dialog customizations
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 16,
        boxShadow: '0 24px 48px rgba(99, 102, 241, 0.2)',
      },
    },
  },

  // Menu customizations
  MuiMenu: {
    styleOverrides: {
      paper: {
        borderRadius: 8,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        border: '1px solid #f3f4f6',
      },
    },
  },

  // Tab customizations
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.875rem',
      },
    },
  },

  // Loading button customizations
  MuiLoadingButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        borderRadius: 8,
        fontWeight: 600,
      },
    },
  },
};

// ===== URBAN SKILL SPECIFIC COLORS =====
const urbanSkillColors = {
  // Service Category Colors (using your color scheme)
  serviceCategories: {
    cleaning: {
      main: '#10b981',
      light: '#d1fae5',
      dark: '#047857',
    },
    plumbing: {
      main: '#6366f1',
      light: '#e0e7ff',
      dark: '#4338ca',
    },
    electrical: {
      main: '#f59e0b',
      light: '#fef3c7',
      dark: '#b45309',
    },
    appliance: {
      main: '#ef4444',
      light: '#fee2e2',
      dark: '#b91c1c',
    },
    beauty: {
      main: '#8b5cf6',
      light: '#e9d5ff',
      dark: '#7c3aed',
    },
    painting: {
      main: '#06b6d4',
      light: '#cffafe',
      dark: '#0891b2',
    },
  },

  // Status Colors
  status: {
    pending: {
      main: '#f59e0b',
      light: '#fef3c7',
      background: '#fffbeb',
    },
    confirmed: {
      main: '#6366f1',
      light: '#e0e7ff',
      background: '#f0f0ff',
    },
    inProgress: {
      main: '#8b5cf6',
      light: '#e9d5ff',
      background: '#f5f3ff',
    },
    completed: {
      main: '#10b981',
      light: '#d1fae5',
      background: '#ecfdf5',
    },
    cancelled: {
      main: '#ef4444',
      light: '#fecaca',
      background: '#fef2f2',
    },
  },

  // Rating Colors
  rating: {
    excellent: '#10b981', // 4.5-5 stars
    good: '#6366f1',      // 3.5-4.4 stars
    average: '#f59e0b',   // 2.5-3.4 stars
    poor: '#ef4444',      // Below 2.5 stars
    star: '#fbbf24',      // Star color
  },
};

// ===== CREATE THEME =====
const theme = createTheme({
  palette: {
    mode: 'light',
    ...colors,
  },
  typography,
  spacing,
  shadows,
  breakpoints,
  components,
  shape: {
    borderRadius: 12,
  },
  
  // Custom theme properties (integrated from all previous files)
  custom: {
    colors: urbanSkillColors,
    gradients: {
      primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      secondary: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
      success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      hero: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #10b981 100%)',
      cardHover: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
      cardActive: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
    },
    borderRadius: {
      small: 4,
      medium: 8,
      large: 12,
      xlarge: 16,
    },
    animation: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
      easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
    },
    // Urban Skill specific configurations
    urbanSkill: {
      serviceCard: {
        width: 320,
        height: 400,
        imageHeight: 200,
      },
      workerCard: {
        width: 280,
        height: 360,
        avatarSize: 80,
      },
      dashboard: {
        statCardHeight: 120,
        gridGap: 24,
      },
    },
    // Responsive utilities
    responsive: {
      containerPadding: {
        xs: 16,
        sm: 24,
        md: 32,
      },
      sectionPadding: {
        xs: 48,
        sm: 64,
        md: 96,
      },
    },
  },
});

export default theme;
