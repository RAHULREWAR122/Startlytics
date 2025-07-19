import { useTheme } from "@/components/Redux/ThemeProvider";

const colors = {
  light: {
    background: {
      primary: '#fdfdfd',
      secondary: '#f7f8fc',
      accent: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)',
      card: '#3d3d3d',
      hover: '#f1f5f9',
    },
    text: {
      primary: '#0f172a',
      secondary: '#334155',
      muted: '#64748b',
      inverse: '#ffffff',
    },
    accent: {
      blue: '#2563eb',
      purple: '#7c3aed',
      pink: '#c2185b',
      gradient: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #c2185b 100%)',
    },
    border: {
      primary: '#e2e8f0',
      secondary: '#cbd5e1',
      accent: '#a5b4fc',
    },
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
  },


  dark: {
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
      accent: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      card: '#1e293b',
      hover: '#334155',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      muted: '#94a3b8',
      inverse: '#0f172a',
    },
    accent: {
      blue: '#3b82f6',
      purple: '#8b5cf6',
      pink: '#ec4899',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
    },
    border: {
      primary: '#334155',
      secondary: '#475569',
      accent: '#6366f1',
    },
    // Status colors
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
  },
};

export const useThemeColor = () => {
  const { theme } = useTheme();
  
  const getColor = (category, variant = 'primary') => {
    return colors[theme][category][variant];
  };

  const currentColors = colors[theme];

  return {
    // Direct access to color categories
    background: currentColors.background,
    text: currentColors.text,
    accent: currentColors.accent,
    border: currentColors.border,
    status: currentColors.status,
    
    getColor,
    
    cardStyle: {
      backgroundColor: currentColors.background.card,
      color: currentColors.text.primary,
      borderColor: currentColors.border.primary,
    },
    
    buttonPrimary: {
      background: currentColors.accent.gradient,
      color: currentColors.text.inverse,
    },
    
    buttonSecondary: {
      backgroundColor: currentColors.background.secondary,
      color: currentColors.text.primary,
      borderColor: currentColors.border.primary,
    },
  };
};