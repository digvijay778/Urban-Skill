// src/themes/typography.jsx

// ===== FONT CONFIGURATION =====
export const FONT_FAMILIES = {
  primary: [
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
  
  mono: [
    '"SF Mono"',
    'Monaco',
    'Inconsolata',
    '"Roboto Mono"',
    'monospace',
  ].join(','),
  
  heading: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    'sans-serif',
  ].join(','),
};

// ===== FONT WEIGHTS =====
export const FONT_WEIGHTS = {
  thin: 100,
  extraLight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900,
};

// ===== FONT SIZES =====
export const FONT_SIZES = {
  xs: '0.75rem',      // 12px
  sm: '0.875rem',     // 14px
  base: '1rem',       // 16px
  lg: '1.125rem',     // 18px
  xl: '1.25rem',      // 20px
  '2xl': '1.5rem',    // 24px
  '3xl': '1.875rem',  // 30px
  '4xl': '2.25rem',   // 36px
  '5xl': '3rem',      // 48px
  '6xl': '3.75rem',   // 60px
  '7xl': '4.5rem',    // 72px
  '8xl': '6rem',      // 96px
  '9xl': '8rem',      // 128px
};

// ===== LINE HEIGHTS =====
export const LINE_HEIGHTS = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
};

// ===== LETTER SPACING =====
export const LETTER_SPACING = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
};

// ===== RESPONSIVE TYPOGRAPHY =====
export const createResponsiveTypography = (theme) => ({
  // Heading 1 - Hero titles
  h1: {
    fontFamily: FONT_FAMILIES.heading,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: LETTER_SPACING.tight,
    color: theme?.palette?.text?.primary || '#1f2937',
    [theme?.breakpoints?.down('sm') || '@media (max-width: 600px)']: {
      fontSize: '2rem',
      lineHeight: LINE_HEIGHTS.tight,
    },
    [theme?.breakpoints?.between('sm', 'md') || '@media (min-width: 600px) and (max-width: 960px)']: {
      fontSize: '2.5rem',
      lineHeight: LINE_HEIGHTS.tight,
    },
    [theme?.breakpoints?.up('md') || '@media (min-width: 960px)']: {
      fontSize: '3.5rem',
      lineHeight: LINE_HEIGHTS.tight,
    },
  },

  // Heading 2 - Section titles
  h2: {
    fontFamily: FONT_FAMILIES.heading,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: LETTER_SPACING.tight,
    color: theme?.palette?.text?.primary || '#1f2937',
    [theme?.breakpoints?.down('sm') || '@media (max-width: 600px)']: {
      fontSize: '1.75rem',
      lineHeight: LINE_HEIGHTS.snug,
    },
    [theme?.breakpoints?.between('sm', 'md') || '@media (min-width: 600px) and (max-width: 960px)']: {
      fontSize: '2.25rem',
      lineHeight: LINE_HEIGHTS.snug,
    },
    [theme?.breakpoints?.up('md') || '@media (min-width: 960px)']: {
      fontSize: '3rem',
      lineHeight: LINE_HEIGHTS.snug,
    },
  },

  // Heading 3 - Subsection titles
  h3: {
    fontFamily: FONT_FAMILIES.heading,
    fontWeight: FONT_WEIGHTS.semiBold,
    letterSpacing: LETTER_SPACING.tight,
    color: theme?.palette?.text?.primary || '#1f2937',
    [theme?.breakpoints?.down('sm') || '@media (max-width: 600px)']: {
      fontSize: '1.5rem',
      lineHeight: LINE_HEIGHTS.snug,
    },
    [theme?.breakpoints?.between('sm', 'md') || '@media (min-width: 600px) and (max-width: 960px)']: {
      fontSize: '2rem',
      lineHeight: LINE_HEIGHTS.snug,
    },
    [theme?.breakpoints?.up('md') || '@media (min-width: 960px)']: {
      fontSize: '2.5rem',
      lineHeight: LINE_HEIGHTS.snug,
    },
  },

  // Heading 4 - Card titles
  h4: {
    fontFamily: FONT_FAMILIES.heading,
    fontWeight: FONT_WEIGHTS.semiBold,
    letterSpacing: LETTER_SPACING.tight,
    color: theme?.palette?.text?.primary || '#1f2937',
    [theme?.breakpoints?.down('sm') || '@media (max-width: 600px)']: {
      fontSize: '1.25rem',
      lineHeight: LINE_HEIGHTS.normal,
    },
    [theme?.breakpoints?.up('md') || '@media (min-width: 960px)']: {
      fontSize: '2rem',
      lineHeight: LINE_HEIGHTS.normal,
    },
  },

  // Heading 5 - Component titles
  h5: {
    fontFamily: FONT_FAMILIES.heading,
    fontWeight: FONT_WEIGHTS.semiBold,
    letterSpacing: LETTER_SPACING.normal,
    color: theme?.palette?.text?.primary || '#1f2937',
    [theme?.breakpoints?.down('sm') || '@media (max-width: 600px)']: {
      fontSize: '1.125rem',
      lineHeight: LINE_HEIGHTS.normal,
    },
    [theme?.breakpoints?.up('md') || '@media (min-width: 960px)']: {
      fontSize: '1.5rem',
      lineHeight: LINE_HEIGHTS.normal,
    },
  },

  // Heading 6 - Small headings
  h6: {
    fontFamily: FONT_FAMILIES.heading,
    fontWeight: FONT_WEIGHTS.semiBold,
    letterSpacing: LETTER_SPACING.normal,
    color: theme?.palette?.text?.primary || '#1f2937',
    fontSize: '1.125rem',
    lineHeight: LINE_HEIGHTS.normal,
  },

  // Subtitle 1 - Large subtitles
  subtitle1: {
    fontFamily: FONT_FAMILIES.primary,
    fontWeight: FONT_WEIGHTS.medium,
    letterSpacing: LETTER_SPACING.normal,
    color: theme?.palette?.text?.secondary || '#6b7280',
    fontSize: '1rem',
    lineHeight: LINE_HEIGHTS.relaxed,
  },

  // Subtitle 2 - Small subtitles
  subtitle2: {
    fontFamily: FONT_FAMILIES.primary,
    fontWeight: FONT_WEIGHTS.medium,
    letterSpacing: LETTER_SPACING.wide,
    color: theme?.palette?.text?.secondary || '#6b7280',
    fontSize: '0.875rem',
    lineHeight: LINE_HEIGHTS.normal,
  },

  // Body 1 - Primary body text
  body1: {
    fontFamily: FONT_FAMILIES.primary,
    fontWeight: FONT_WEIGHTS.regular,
    letterSpacing: LETTER_SPACING.normal,
    color: theme?.palette?.text?.primary || '#1f2937',
    [theme?.breakpoints?.down('sm') || '@media (max-width: 600px)']: {
      fontSize: '0.875rem',
      lineHeight: LINE_HEIGHTS.relaxed,
    },
    [theme?.breakpoints?.up('md') || '@media (min-width: 960px)']: {
      fontSize: '1rem',
      lineHeight: LINE_HEIGHTS.relaxed,
    },
  },

  // Body 2 - Secondary body text
  body2: {
    fontFamily: FONT_FAMILIES.primary,
    fontWeight: FONT_WEIGHTS.regular,
    letterSpacing: LETTER_SPACING.normal,
    color: theme?.palette?.text?.secondary || '#6b7280',
    fontSize: '0.875rem',
    lineHeight: LINE_HEIGHTS.relaxed,
  },

  // Button text
  button: {
    fontFamily: FONT_FAMILIES.primary,
    fontWeight: FONT_WEIGHTS.semiBold,
    letterSpacing: LETTER_SPACING.wide,
    textTransform: 'none',
    fontSize: '0.875rem',
    lineHeight: LINE_HEIGHTS.normal,
  },

  // Caption text
  caption: {
    fontFamily: FONT_FAMILIES.primary,
    fontWeight: FONT_WEIGHTS.regular,
    letterSpacing: LETTER_SPACING.wide,
    color: theme?.palette?.text?.secondary || '#6b7280',
    fontSize: '0.75rem',
    lineHeight: LINE_HEIGHTS.normal,
  },

  // Overline text
  overline: {
    fontFamily: FONT_FAMILIES.primary,
    fontWeight: FONT_WEIGHTS.medium,
    letterSpacing: LETTER_SPACING.widest,
    color: theme?.palette?.text?.secondary || '#6b7280',
    fontSize: '0.75rem',
    lineHeight: LINE_HEIGHTS.normal,
    textTransform: 'uppercase',
  },
});

// ===== URBAN SKILL SPECIFIC TYPOGRAPHY =====
export const URBAN_SKILL_TYPOGRAPHY = {
  // Service card typography
  serviceCard: {
    title: {
      fontFamily: FONT_FAMILIES.heading,
      fontWeight: FONT_WEIGHTS.semiBold,
      fontSize: '1.25rem',
      lineHeight: LINE_HEIGHTS.snug,
      letterSpacing: LETTER_SPACING.normal,
    },
    price: {
      fontFamily: FONT_FAMILIES.heading,
      fontWeight: FONT_WEIGHTS.bold,
      fontSize: '1.5rem',
      lineHeight: LINE_HEIGHTS.none,
      letterSpacing: LETTER_SPACING.tight,
    },
    description: {
      fontFamily: FONT_FAMILIES.primary,
      fontWeight: FONT_WEIGHTS.regular,
      fontSize: '0.875rem',
      lineHeight: LINE_HEIGHTS.relaxed,
      letterSpacing: LETTER_SPACING.normal,
    },
  },

  // Worker card typography
  workerCard: {
    name: {
      fontFamily: FONT_FAMILIES.heading,
      fontWeight: FONT_WEIGHTS.semiBold,
      fontSize: '1.125rem',
      lineHeight: LINE_HEIGHTS.snug,
      letterSpacing: LETTER_SPACING.normal,
    },
    specialty: {
      fontFamily: FONT_FAMILIES.primary,
      fontWeight: FONT_WEIGHTS.medium,
      fontSize: '0.75rem',
      lineHeight: LINE_HEIGHTS.normal,
      letterSpacing: LETTER_SPACING.wide,
    },
    rating: {
      fontFamily: FONT_FAMILIES.primary,
      fontWeight: FONT_WEIGHTS.medium,
      fontSize: '0.875rem',
      lineHeight: LINE_HEIGHTS.normal,
      letterSpacing: LETTER_SPACING.normal,
    },
  },

  // Dashboard typography
  dashboard: {
    statValue: {
      fontFamily: FONT_FAMILIES.heading,
      fontWeight: FONT_WEIGHTS.bold,
      fontSize: '2rem',
      lineHeight: LINE_HEIGHTS.none,
      letterSpacing: LETTER_SPACING.tight,
    },
    statLabel: {
      fontFamily: FONT_FAMILIES.primary,
      fontWeight: FONT_WEIGHTS.medium,
      fontSize: '0.875rem',
      lineHeight: LINE_HEIGHTS.normal,
      letterSpacing: LETTER_SPACING.normal,
    },
  },

  // Form typography
  form: {
    label: {
      fontFamily: FONT_FAMILIES.primary,
      fontWeight: FONT_WEIGHTS.medium,
      fontSize: '0.875rem',
      lineHeight: LINE_HEIGHTS.normal,
      letterSpacing: LETTER_SPACING.normal,
    },
    input: {
      fontFamily: FONT_FAMILIES.primary,
      fontWeight: FONT_WEIGHTS.regular,
      fontSize: '1rem',
      lineHeight: LINE_HEIGHTS.normal,
      letterSpacing: LETTER_SPACING.normal,
    },
    error: {
      fontFamily: FONT_FAMILIES.primary,
      fontWeight: FONT_WEIGHTS.regular,
      fontSize: '0.75rem',
      lineHeight: LINE_HEIGHTS.normal,
      letterSpacing: LETTER_SPACING.normal,
    },
  },
};

// ===== TYPOGRAPHY UTILITIES =====
export const TYPOGRAPHY_UTILITIES = {
  // Truncate text
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  // Clamp text to specific lines
  clamp: (lines) => ({
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  }),

  // Responsive font size helper
  responsiveFontSize: (minSize, maxSize, minViewport = 320, maxViewport = 1200) => ({
    fontSize: `clamp(${minSize}, ${minSize} + (${maxSize.replace('rem', '')} - ${minSize.replace('rem', '')}) * ((100vw - ${minViewport}px) / (${maxViewport} - ${minViewport})), ${maxSize})`,
  }),

  // Text gradient
  textGradient: (gradient) => ({
    background: gradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  }),
};

// ===== MAIN TYPOGRAPHY CONFIGURATION =====
export const createTypographyConfig = (theme) => ({
  // Font configuration
  fontFamily: FONT_FAMILIES.primary,
  fontWeightLight: FONT_WEIGHTS.light,
  fontWeightRegular: FONT_WEIGHTS.regular,
  fontWeightMedium: FONT_WEIGHTS.medium,
  fontWeightBold: FONT_WEIGHTS.bold,

  // HTML font size (for rem calculations)
  htmlFontSize: 16,

  // Font size base
  fontSize: 14,

  // Responsive typography variants
  ...createResponsiveTypography(theme),

  // Custom Urban Skill typography
  urbanSkill: URBAN_SKILL_TYPOGRAPHY,

  // Typography utilities
  utilities: TYPOGRAPHY_UTILITIES,
});

// ===== EXPORT ALL =====
export default {
  FONT_FAMILIES,
  FONT_WEIGHTS,
  FONT_SIZES,
  LINE_HEIGHTS,
  LETTER_SPACING,
  createResponsiveTypography,
  URBAN_SKILL_TYPOGRAPHY,
  TYPOGRAPHY_UTILITIES,
  createTypographyConfig,
};
