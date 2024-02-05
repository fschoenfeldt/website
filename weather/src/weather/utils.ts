/**
 * Get the current date in the format YYYY-MM-DD and appends :00 seconds
 * @param {Date} date The date to format
 * @returns {string} The formatted date in the format YYYY-MM-DD
 */
export const formatDateTime = (date: Date) => {
  // Get the current date
  const today = date;

  // Format the date as YYYY-MM-DD
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  const hour = today.getHours().toString().padStart(2, "0");
  const minute = today.getMinutes().toString().padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}:00`;
};

export const offsetDate = (date: Date, offsetHours = 0): Date => {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + offsetHours);
  return newDate;
};

export const isoToDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString();
};

export const isoToTime = (isoDate: string) => {
  return new Date(isoDate).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const isoToLocaleString = (isoDate: string) => {
  return new Date(isoDate).toLocaleString();
};
