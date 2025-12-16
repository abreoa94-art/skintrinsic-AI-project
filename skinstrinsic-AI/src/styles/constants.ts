export const COLORS = {
  primary: '#1A1B1C',
  background: {
    gradient: 'bg-gradient-to-b from-blue-50 to-white',
    white: '#FFFFFF',
    grey: '#E5E7EB',
    hover: '#D1D5DB'
  },
  text: {
    primary: '#1A1B1C',
    secondary: '#999999',
    instruction: '#9CA3AF'
  },
  button: {
    black: '#000000',
    white: '#FFFFFF',
    hover: '#F3F4F6'
  },
  error: '#EF4444'
};

export const FONTS = {
  primary: 'Roobert TRIAL, sans-serif'
};

export const FONT_STYLES = {
  heading: {
    fontFamily: FONTS.primary,
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '16px',
    letterSpacing: '-0.02em'
  },
  subtitle: {
    fontFamily: FONTS.primary,
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '20px',
    letterSpacing: '-0.01em'
  },
  button: {
    fontFamily: FONTS.primary,
    fontWeight: 600,
    fontSize: '14px',
    letterSpacing: '-0.02em',
    textTransform: 'uppercase' as const
  },
  input: {
    fontFamily: FONTS.primary,
    fontWeight: 300,
    fontSize: '32px',
    lineHeight: '40px',
    letterSpacing: '-0.03em'
  }
};

export const SPACING = {
  header: {
    left: '32px',
    right: '32px',
    top: '24px'
  },
  mobileHeader: {
    left: '16px',
    right: '16px',
    top: '20px'
  },
  button: {
    bottom: '32px'
  },
  mobileButton: {
    bottom: '16px'
  }
};

export const TRANSITIONS = {
  default: 'all 0.3s ease',
  color: '0.3s ease',
  transform: '0.3s ease',
  opacity: '0.8s ease-in-out'
};
