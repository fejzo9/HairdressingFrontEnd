import { useNavigate } from "react-router-dom";
import { STATUS_BADGE, formatDateTime } from "./appointmentUtils";

function AppointmentCard({ appointment, onCancel, onViewDetails }) {
  const navigate = useNavigate();
  const {
    salonName,
    salonAddress,
    salonPhone,
    hairdresserName,
    serviceName,
    servicePrice,
    serviceDuration,
    date,
    startTime,
    status,
    salonId,
    hairdresserId,
  } = appointment;

  const badge = STATUS_BADGE[status] || { label: status, cls: "bg-secondary" };

  return (
    <div
      className="card h-100 shadow-sm"
      style={{ cursor: "pointer" }}
      onClick={() => onViewDetails(appointment)}
    >
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0">{salonName || "Nepoznat salon"}</h5>
          <span className={`badge ${badge.cls}`}>{badge.label}</span>
        </div>

        {salonAddress && (
          <p className="card-text text-muted small mb-1">
            <i className="bi bi-geo-alt me-1"></i>
            {salonAddress}
          </p>
        )}
        {salonPhone && (
          <p className="card-text text-muted small mb-1">
            <i className="bi bi-telephone me-1"></i>
            {salonPhone}
          </p>
        )}

        <hr className="my-2" />

        <p className="card-text small mb-1">
          <strong>Frizer:</strong> {hairdresserName || "—"}
        </p>
        <p className="card-text small mb-1">
          <strong>Usluga:</strong> {serviceName || "—"}
          {serviceDuration ? ` (${serviceDuration} min)` : ""}
        </p>
        {servicePrice != null && (
          <p className="card-text small mb-1">
            <strong>Cijena:</strong> {servicePrice} KM
          </p>
        )}
        <p className="card-text small mb-2">
          <strong>Datum i vrijeme:</strong> {formatDateTime(date, startTime)}
        </p>

        <div className="mt-auto d-flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
          {status === "CONFIRMED" || status === "PENDING" ? (
            <>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => onCancel(appointment)}
                style={{ minHeight: "44px" }}
              >
                Otkaži
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => onViewDetails(appointment)}
                style={{ minHeight: "44px" }}
              >
                Detalji
              </button>
            </>
          ) : status === "COMPLETED" ? (
            <>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => onViewDetails(appointment)}
                style={{ minHeight: "44px" }}
              >
                Detalji
              </button>
            </>
          ) : status === "CANCELLED" ? (
            <>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() =>
                  salonId && hairdresserId
                    ? navigate(`/rezervacija/${salonId}/${hairdresserId}`)
                    : navigate("/salons")
                }
                style={{ minHeight: "44px" }}
              >
                Rezerviši ponovo
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => onViewDetails(appointment)}
                style={{ minHeight: "44px" }}
              >
                Detalji
              </button>
            </>
          ) : (
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => onViewDetails(appointment)}
              style={{ minHeight: "44px" }}
            >
              Detalji
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppointmentCard;
