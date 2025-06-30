// src/themes/colors.jsx

// ===== PROFESSIONAL BLUE & TEAL COLOR PALETTE =====
// Based on your existing theme configuration

export const COLORS = {
  // Primary Colors - Professional Blue (matching your index.js)
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af', // Your main primary color
    900: '#1e3a8a',
    main: '#1e40af',
    light: '#3b82f6',
    dark: '#1e3a8a',
    contrastText: '#ffffff',
  },

  // Secondary Colors - Teal (professional service industry)
  secondary: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2', // Your main secondary color
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
    main: '#0891b2',
    light: '#22d3ee',
    dark: '#0e7490',
    contrastText: '#ffffff',
  },

  // Success Colors - Emerald Green (trust & reliability)
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669', // Main success color
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    main: '#059669',
    light: '#34d399',
    dark: '#047857',
    contrastText: '#ffffff',
  },

  // Warning Colors - Amber (professional alerts)
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
    light: '#fbbf24',
    dark: '#b45309',
    contrastText: '#ffffff',
  },

  // Error Colors - Red (clear error indication)
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

  // Info Colors - Blue (information & guidance)
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

  // Neutral Colors - Professional Grays
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

  // Background Colors
  background: {
    default: '#ffffff',
    paper: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    dark: '#0f172a',
  },

  // Text Colors
  text: {
    primary: '#1f2937',
    secondary: '#6b7280',
    disabled: '#9ca3af',
    inverse: '#ffffff',
  },

  // Border Colors
  border: {
    primary: '#e5e7eb',
    secondary: '#d1d5db',
    focus: '#1e40af',
    error: '#ef4444',
    success: '#059669',
  },
};

// ===== URBAN SKILL SPECIFIC COLORS =====
export const URBAN_SKILL_COLORS = {
  // Service Category Colors
  serviceCategories: {
    cleaning: {
      main: '#059669',
      light: '#d1fae5',
      dark: '#047857',
    },
    plumbing: {
      main: '#0891b2',
      light: '#cffafe',
      dark: '#0e7490',
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
      main: '#3b82f6',
      light: '#dbeafe',
      background: '#eff6ff',
    },
    inProgress: {
      main: '#8b5cf6',
      light: '#e9d5ff',
      background: '#f5f3ff',
    },
    completed: {
      main: '#059669',
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
    excellent: '#059669', // 4.5-5 stars
    good: '#3b82f6',      // 3.5-4.4 stars
    average: '#f59e0b',   // 2.5-3.4 stars
    poor: '#ef4444',      // Below 2.5 stars
    star: '#fbbf24',      // Star color
  },

  // Priority Colors
  priority: {
    low: '#6b7280',
    normal: '#3b82f6',
    high: '#f59e0b',
    urgent: '#ef4444',
  },
};

// ===== GRADIENT DEFINITIONS =====
export const GRADIENTS = {
  // Primary Gradients
  primary: 'linear-gradient(135deg, #1e40af 0%, #0891b2 100%)',
  primaryReverse: 'linear-gradient(135deg, #0891b2 0%, #1e40af 100%)',
  
  // Success Gradients
  success: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
  successSubtle: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
  
  // Warning Gradients
  warning: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
  warningSubtle: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
  
  // Error Gradients
  error: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
  errorSubtle: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
  
  // Neutral Gradients
  neutral: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
  dark: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
  
  // Hero Section Gradients
  hero: 'linear-gradient(135deg, #1e40af 0%, #0891b2 50%, #059669 100%)',
  heroOverlay: 'linear-gradient(135deg, rgba(30, 64, 175, 0.9) 0%, rgba(8, 145, 178, 0.9) 100%)',
  
  // Card Gradients
  cardHover: 'linear-gradient(135deg, rgba(30, 64, 175, 0.05) 0%, rgba(8, 145, 178, 0.05) 100%)',
  cardActive: 'linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)',
};

// ===== SEMANTIC COLORS =====
export const SEMANTIC_COLORS = {
  // Action Colors
  actions: {
    primary: COLORS.primary.main,
    secondary: COLORS.secondary.main,
    success: COLORS.success.main,
    warning: COLORS.warning.main,
    error: COLORS.error.main,
    info: COLORS.info.main,
  },

  // Interactive States
  interactive: {
    hover: 'rgba(30, 64, 175, 0.08)',
    active: 'rgba(30, 64, 175, 0.12)',
    focus: 'rgba(30, 64, 175, 0.24)',
    disabled: COLORS.grey[300],
  },

  // Feedback Colors
  feedback: {
    success: COLORS.success.main,
    warning: COLORS.warning.main,
    error: COLORS.error.main,
    info: COLORS.info.main,
  },
};

// ===== ACCESSIBILITY COLORS =====
export const ACCESSIBILITY_COLORS = {
  // High Contrast Colors
  highContrast: {
    text: '#000000',
    background: '#ffffff',
    primary: '#0000ff',
    secondary: '#008080',
    error: '#cc0000',
    success: '#006600',
  },

  // Focus Indicators
  focus: {
    ring: COLORS.primary.main,
    ringOffset: '#ffffff',
    ringWidth: '2px',
    ringOpacity: 0.5,
  },
};

// ===== DARK MODE COLORS =====
export const DARK_MODE_COLORS = {
  background: {
    default: '#0f172a',
    paper: '#1e293b',
    secondary: '#334155',
    tertiary: '#475569',
  },
  text: {
    primary: '#f1f5f9',
    secondary: '#cbd5e1',
    disabled: '#64748b',
  },
  border: {
    primary: '#334155',
    secondary: '#475569',
  },
};

// ===== COLOR UTILITIES =====
export const COLOR_UTILITIES = {
  // Opacity Variants
  withOpacity: (color, opacity) => `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
  
  // RGB to Hex Converter
  rgbToHex: (r, g, b) => `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`,
  
  // Hex to RGB Converter
  hexToRgb: (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },
  
  // Get Contrast Color
  getContrastColor: (hexColor) => {
    const rgb = COLOR_UTILITIES.hexToRgb(hexColor);
    if (!rgb) return '#000000';
    
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  },
};

// ===== EXPORT ALL =====
export default {
  COLORS,
  URBAN_SKILL_COLORS,
  GRADIENTS,
  SEMANTIC_COLORS,
  ACCESSIBILITY_COLORS,
  DARK_MODE_COLORS,
  COLOR_UTILITIES,
};
