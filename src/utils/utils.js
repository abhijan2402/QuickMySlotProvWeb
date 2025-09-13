export function convertToIST(utcDateString) {
  if (!utcDateString) return "";

  // Parse UTC date
  const utcDate = new Date(utcDateString);

  // Convert to IST using Intl API
  const istDate = utcDate.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return istDate;
}

export function capitalizeFirstLetter(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
