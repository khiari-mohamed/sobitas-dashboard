/**
 * Format a date string or Date object to a human-readable format.
 * Example output: "2024-06-12", "12 Jun 2024", etc.
 * You can adjust the format as needed.
 */
export function formatDate(date: string | number | Date | undefined | null): string {
  if (!date) return "";
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  // Example: "12 Jun 2024"
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}