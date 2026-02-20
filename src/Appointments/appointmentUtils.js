export const STATUS_BADGE = {
  CONFIRMED: { label: "Potvrđeno", cls: "bg-success" },
  PENDING: { label: "Na čekanju", cls: "bg-warning text-dark" },
  CANCELLED: { label: "Otkazano", cls: "bg-danger" },
  COMPLETED: { label: "Završeno", cls: "bg-primary" },
};

export function formatDateTime(dateArr, timeArr) {
  if (!dateArr) return "";
  const [y, m, d] = dateArr;
  const date = `${String(d).padStart(2, "0")}.${String(m).padStart(2, "0")}.${y}`;
  if (!timeArr) return date;
  const [h, min] = timeArr;
  return `${date} u ${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}
