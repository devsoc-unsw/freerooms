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
    height: 340,
    thumbnailHeight: 150,
    compactHeight: 240,
    compactThumbnailHeight: 96,
  },
  picker: {
    width: 133,
    calendarWidth: 320, // size MUI's DateCalendar renders at
    calendarHeight: 336, // size MUI
  },
  toolbar: {
    buttonWidth: 115, // Filters/Sort/Time buttons
    menuWidth: 400,
    wideMenuWidth: 600,
  },
  slider: {
    rail: 11,
    thumb: 16,
    tickWidth: 1,
    tickHeight: 5,
  },
} as const;

export type AppSizes = typeof sizes;
