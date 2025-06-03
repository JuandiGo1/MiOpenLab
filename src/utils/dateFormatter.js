export const formatDate = (dateToFormat) => {
  if (!dateToFormat) return "Just now";
  
  // Si ya es un Date, úsalo directamente
  if (dateToFormat instanceof Date) {
    return dateToFormat.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Si es un Timestamp de Firestore
  if (dateToFormat?.toDate) {
    return dateToFormat.toDate().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Si es un timestamp en segundos o milisegundos
  if (typeof dateToFormat === 'number') {
    const date = new Date(dateToFormat.toString().length === 10 ? dateToFormat * 1000 : dateToFormat);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return "Just now";
};
