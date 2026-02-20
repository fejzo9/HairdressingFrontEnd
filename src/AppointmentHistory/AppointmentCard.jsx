import { useState } from "react";

const STATUS_CONFIG = {
  upcoming: { label: "Predstojeći", className: "bg-success" },
  confirmed: { label: "Potvrđen", className: "bg-success" },
  past: { label: "Završen", className: "bg-secondary" },
  completed: { label: "Završen", className: "bg-secondary" },
  cancelled: { label: "Otkazan", className: "bg-danger" },
};

function AppointmentCard({ appointment, onRefresh }) {
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const formatDate = (dateVal) => {
    if (!dateVal) return "-";
    if (Array.isArray(dateVal)) {
      const [year, month, day] = dateVal;
      return `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}.${year}`;
    }
    return dateVal;
  };

  const formatTime = (timeVal) => {
    if (!timeVal) return "-";
    if (Array.isArray(timeVal)) {
      const [hour, minute] = timeVal;
      return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    }
    return timeVal;
  };

  const handleCancel = async () => {
    if (!window.confirm("Da li ste sigurni da želite otkazati ovaj termin?")) return;
    try {
      const response = await fetch(`http://localhost:8080/appointments/${appointment.id}/cancel`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Greška pri otkazivanju.");
      setMessage("✅ Termin je uspješno otkazan.");
      setTimeout(onRefresh, 1500);
    } catch {
      setMessage("❌ Greška pri otkazivanju termina.");
    }
  };

  const status = appointment.status?.toLowerCase();
  const statusInfo = STATUS_CONFIG[status] || { label: appointment.status || "Nepoznato", className: "bg-secondary" };

  const salonName = appointment.salonName || appointment.salon?.name || "Salon";
  const hairdresserName =
    appointment.hairdresserName ||
    (appointment.hairdresser
      ? `${appointment.hairdresser.firstName} ${appointment.hairdresser.lastName}`
      : "-");
  const serviceName = appointment.serviceName || appointment.service?.naziv_usluge || "-";
  const price = appointment.price ?? appointment.service?.cijena_usluge;

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0">{salonName}</h5>
          <span className={`badge ${statusInfo.className}`}>{statusInfo.label}</span>
        </div>

        <p className="card-text small mb-1">
          <strong>Frizer:</strong> {hairdresserName}
        </p>
        <p className="card-text small mb-1">
          <strong>Usluga:</strong> {serviceName}
        </p>
        {price != null && (
          <p className="card-text small mb-1">
            <strong>Cijena:</strong> {price} KM
          </p>
        )}
        <p className="card-text small mb-1">
          <strong>Datum:</strong> {formatDate(appointment.date)}
        </p>
        <p className="card-text small mb-2">
          <strong>Vrijeme:</strong> {formatTime(appointment.startTime)}
          {appointment.duration && ` (${appointment.duration} min)`}
        </p>

        {message && <p className="small mt-2">{message}</p>}

        {(status === "upcoming" || status === "confirmed") && (
          <div className="d-flex gap-2 mt-2">
            <button className="btn btn-sm btn-outline-danger" onClick={handleCancel}>
              Otkaži
            </button>
          </div>
        )}
        {(status === "past" || status === "completed") && (
          <div className="mt-2">
            <button className="btn btn-sm btn-outline-warning">Ostavi recenziju</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentCard;
