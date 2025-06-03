export const formatDate = (dateToFormat) => {
  return dateToFormat?.toDate
    ? dateToFormat.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";
};
