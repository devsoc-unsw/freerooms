export const sizes = {
  control: {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 56,
  },
  icon: {
    sm: 16,
    md: 24,
    lg: 32,
  },
  searchBar: {
    width: 1440,
    halfWidth: 720,
  },
  roomCard: {
    height: 178,
  },
  picker: {
    width: 133,
  },
} as const;

export type AppSizes = typeof sizes;
