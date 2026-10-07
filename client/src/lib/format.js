export function formatEGP(value) {
  const num = Number(value) || 0;
  return `${num.toLocaleString("en-EG", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} EGP`;
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
