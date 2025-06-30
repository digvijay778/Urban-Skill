// src/themes/breakpoints.jsx

// ===== BREAKPOINT CONSTANTS ===== 
export const BREAKPOINT_VALUES = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
  xxl: 2560
};

// ===== RESPONSIVE UTILITIES =====
export const createResponsiveBreakpoints = (theme) => ({
  values: BREAKPOINT_VALUES,
  
  // Media query helpers
  up: (key) => `@media (min-width:${BREAKPOINT_VALUES[key]}px)`,
  down: (key) => {
    const endValue = BREAKPOINT_VALUES[key] - 0.05;
    return `@media (max-width:${endValue}px)`;
  },
  between: (start, end) => {
    const endValue = BREAKPOINT_VALUES[end] - 0.05;
    return `@media (min-width:${BREAKPOINT_VALUES[start]}px) and (max-width:${endValue}px)`;
  },
  only: (key) => {
    const keys = Object.keys(BREAKPOINT_VALUES);
    const keyIndex = keys.indexOf(key);
    
    if (keyIndex === keys.length - 1) {
      return `@media (min-width:${BREAKPOINT_VALUES[key]}px)`;
    }
    
    const nextKey = keys[keyIndex + 1];
    const endValue = BREAKPOINT_VALUES[nextKey] - 0.05;
    return `@media (min-width:${BREAKPOINT_VALUES[key]}px) and (max-width:${endValue}px)`;
  },
  
  // Container max-widths for each breakpoint
  containers: {
    xs: '100%',
    sm: '540px',
    md: '720px',
    lg: '960px',
    xl: '1140px',
    xxl: '1320px'
  }
});

// ===== RESPONSIVE BACKGROUND COLORS =====
// Based on your professional blue & teal theme
export const createResponsiveBackgrounds = (theme) => ({
  // Mobile first approach
  [theme.breakpoints.down('sm')]: {
    backgroundColor: '#f8fafc', // Light gray for mobile
  },
  [theme.breakpoints.between('sm', 'md')]: {
    backgroundColor: '#f1f5f9', // Slightly darker for tablets
  },
  [theme.breakpoints.up('md')]: {
    backgroundColor: '#ffffff', // White for desktop
  },
  
  // Professional blue gradients for hero sections
  heroMobile: {
    [theme.breakpoints.down('sm')]: {
      background: 'linear-gradient(135deg, #1e40af 0%, #0891b2 100%)',
    }
  },
  heroDesktop: {
    [theme.breakpoints.up('md')]: {
      background: 'linear-gradient(135deg, #1e40af 0%, #0891b2 50%, #059669 100%)',
    }
  }
});

// ===== RESPONSIVE TYPOGRAPHY =====
export const createResponsiveTypography = (theme) => ({
  h1: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '2rem',
      lineHeight: 1.2,
    },
    [theme.breakpoints.between('sm', 'md')]: {
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '3.5rem',
      lineHeight: 1.2,
    },
  },
  h2: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    [theme.breakpoints.between('sm', 'md')]: {
      fontSize: '2.25rem',
      lineHeight: 1.3,
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '3rem',
      lineHeight: 1.3,
    },
  },
  h3: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.5rem',
      lineHeight: 1.3,
    },
    [theme.breakpoints.between('sm', 'md')]: {
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '2.5rem',
      lineHeight: 1.3,
    },
  },
  h4: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '2rem',
      lineHeight: 1.4,
    },
  },
  body1: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  }
});

// ===== RESPONSIVE SPACING =====
export const createResponsiveSpacing = (theme) => ({
  // Container padding
  containerPadding: {
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    [theme.breakpoints.between('sm', 'md')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
    },
  },
  
  // Section padding
  sectionPadding: {
    [theme.breakpoints.down('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
    [theme.breakpoints.between('sm', 'md')]: {
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8),
    },
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(12),
      paddingBottom: theme.spacing(12),
    },
  },
  
  // Card spacing
  cardSpacing: {
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
  }
});

// ===== RESPONSIVE COMPONENTS =====
export const createResponsiveComponents = (theme) => ({
  // Service Cards
  serviceCard: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: theme.spacing(1, 0),
    },
    [theme.breakpoints.between('sm', 'md')]: {
      width: 'calc(50% - 16px)',
      margin: theme.spacing(1),
    },
    [theme.breakpoints.up('md')]: {
      width: 'calc(33.333% - 16px)',
      margin: theme.spacing(1),
    },
    [theme.breakpoints.up('lg')]: {
      width: 'calc(25% - 16px)',
      margin: theme.spacing(1),
    },
  },
  
  // Worker Cards
  workerCard: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    [theme.breakpoints.between('sm', 'md')]: {
      width: 'calc(50% - 16px)',
      margin: theme.spacing(1),
    },
    [theme.breakpoints.up('md')]: {
      width: 'calc(33.333% - 16px)',
      margin: theme.spacing(1),
    },
  },
  
  // Dashboard Stats
  dashboardStat: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    [theme.breakpoints.between('sm', 'md')]: {
      width: 'calc(50% - 16px)',
      margin: theme.spacing(1),
    },
    [theme.breakpoints.up('md')]: {
      width: 'calc(25% - 16px)',
      margin: theme.spacing(1),
    },
  },
  
  // Buttons
  button: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: theme.spacing(1),
      padding: theme.spacing(1.5, 2),
    },
    [theme.breakpoints.up('md')]: {
      width: 'auto',
      padding: theme.spacing(1.5, 3),
    },
  },
  
  // Forms
  formContainer: {
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
      borderRadius: theme.spacing(1),
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(4),
      borderRadius: theme.spacing(2),
    },
  },
  
  // Modals
  modal: {
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1),
      maxHeight: '90vh',
      borderRadius: theme.spacing(1),
    },
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(4),
      maxHeight: '80vh',
      borderRadius: theme.spacing(2),
    },
  }
});

// ===== RESPONSIVE GRID SYSTEM =====
export const createResponsiveGrid = (theme) => ({
  container: {
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(1, 1fr)',
      gap: theme.spacing(2),
    },
    [theme.breakpoints.between('sm', 'md')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: theme.spacing(3),
    },
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: theme.spacing(4),
    },
    [theme.breakpoints.up('lg')]: {
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: theme.spacing(4),
    },
  }
});

// ===== URBAN SKILL SPECIFIC BREAKPOINTS =====
export const urbanSkillBreakpoints = {
  // Header heights
  headerHeight: {
    [BREAKPOINT_VALUES.xs]: '56px',
    [BREAKPOINT_VALUES.md]: '64px',
  },
  
  // Sidebar widths
  sidebarWidth: {
    [BREAKPOINT_VALUES.xs]: '100%',
    [BREAKPOINT_VALUES.md]: '280px',
  },
  
  // Service card dimensions
  serviceCardHeight: {
    [BREAKPOINT_VALUES.xs]: '300px',
    [BREAKPOINT_VALUES.md]: '400px',
  },
  
  // Worker card dimensions
  workerCardHeight: {
    [BREAKPOINT_VALUES.xs]: '280px',
    [BREAKPOINT_VALUES.md]: '360px',
  }
};

// ===== EXPORT ALL =====
export default {
  BREAKPOINT_VALUES,
  createResponsiveBreakpoints,
  createResponsiveBackgrounds,
  createResponsiveTypography,
  createResponsiveSpacing,
  createResponsiveComponents,
  createResponsiveGrid,
  urbanSkillBreakpoints
};
