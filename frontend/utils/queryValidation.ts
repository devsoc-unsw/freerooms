export const isValidDate = (date: string): boolean => {
  // Valid format is YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const [year, month, day] = date.split("-").map(Number);
  const parsedDate = new Date(year, month - 1, day);

  return (
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day
  );
};

export const isValidTime = (time: string): boolean => {
  // Valid format is HH:MM (24-hour)
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
};
