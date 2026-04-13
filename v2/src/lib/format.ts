const ORDINAL_SUFFIXES: Record<number, string> = { 1: "st", 2: "nd", 3: "rd" };

function ordinal(day: number): string {
  // 11th, 12th, 13th are exceptions
  if (day >= 11 && day <= 13) return `${day}th`;
  return `${day}${ORDINAL_SUFFIXES[day % 10] || "th"}`;
}

/** "July 7th" — no year. Used on the /blog listing page. */
export function formatBlogDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const month = d.toLocaleDateString("en-US", { month: "long" });
  return `${month} ${ordinal(d.getDate())}`;
}

/** "July 7, 2025" — with year. Used on country listing pages. */
export function formatBlogDateWithYear(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
