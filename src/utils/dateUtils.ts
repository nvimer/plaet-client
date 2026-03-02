/**
 * DATE UTILITIES
 * 
 * Safe handling of local dates to avoid Timezone Shift issues.
 */

/**
 * Formats a Date object to YYYY-MM-DD string in local time.
 * Reliable for comparison and <input type="date"> values.
 */
export const getLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Parses a YYYY-MM-DD string into a Date object at local midnight.
 */
export const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

/**
 * Checks if a given date string (ISO or local) matches today's local date.
 */
export const isToday = (dateString: string): boolean => {
  const dateStr = dateString.includes("T") ? dateString.split("T")[0] : dateString;
  const todayStr = getLocalDateString(new Date());
  return dateStr === todayStr;
};

/**
 * Checks if a given date string matches yesterday's local date.
 */
export const isYesterday = (dateString: string): boolean => {
  const dateStr = dateString.includes("T") ? dateString.split("T")[0] : dateString;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);
  return dateStr === yesterdayStr;
};
