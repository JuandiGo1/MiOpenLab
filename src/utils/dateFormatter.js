const formatDate = (createdAt) => {
  return createdAt?.toDate
    ? createdAt.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";
};

export default formatDate;
