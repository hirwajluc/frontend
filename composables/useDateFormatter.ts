// composables/useDateFormatter.js

export const useDateFormatter = () => {
  const formatDateStandard = (dateString: any) => {
    const date = new Date(dateString);
    // Format the date to match the desired format: YYYY-MM-DD HH:MM AM/PM
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);

    // Remove any unwanted commas and ensure the format matches exactly
    return formattedDate.replace(",", "").replace(" AM", " AM");
  };

  return {
    formatDateStandard,
  };
};
