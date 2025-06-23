export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    // Check if the date is invalid
    console.error("Invalid date string:", dateString);
    return "Invalid Date"; // Or some other appropriate fallback
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
