// --- ADD Functions ---

export function addDays(date: Date, days: number): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

export function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7);
}

export function addMonths(date: Date, months: number): Date {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
}

export function addYears(date: Date, years: number): Date {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + years);
  return newDate;
}

// --- SUBTRACT Functions ---

export function subDays(date: Date, days: number): Date {
  return addDays(date, -days);
}

export function subWeeks(date: Date, weeks: number): Date {
  return addWeeks(date, -weeks);
}

export function subMonths(date: Date, months: number): Date {
  return addMonths(date, -months);
}

export function subYears(date: Date, years: number): Date {
  return addYears(date, -years);
}

export function format(date: Date, pattern: string): string {
  const monthsShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthsLong = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return pattern
    .replace("MMMM", monthsLong[monthIndex])
    .replace("MMM", monthsShort[monthIndex])
    .replace("d", day.toString())
    .replace("yyyy", year.toString());
}

export const formatPeriodLabel = (date: Date, timeUnit: string): string => {
  switch (timeUnit) {
    case "daily":
      return format(date, "MMM d, yyyy");
    case "weekly":
      return `Week of ${format(date, "MMM d, yyyy")}`;
    case "monthly":
      return format(date, "MMMM yyyy");
    case "yearly":
      return format(date, "yyyy");
    default:
      return format(date, "MMM d, yyyy");
  }
};

export function getCurrentTimeFormatted() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, "0"); // two digits

  return `${hh}:${mm}:${ss}:${ms}`;
}
