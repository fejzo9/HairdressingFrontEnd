import { STATUS_BADGE, formatDateTime } from "./appointmentUtils";

function AppointmentDetailModal({ appointment, onClose, onCancel }) {
  if (!appointment) return null;

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
    notes,
  } = appointment;

  const badge = STATUS_BADGE[status] || { label: status, cls: "bg-secondary" };

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Detalji termina</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Zatvori"
            ></button>
          </div>
          <div className="modal-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0">{salonName || "Nepoznat salon"}</h6>
              <span className={`badge ${badge.cls}`}>{badge.label}</span>
            </div>

            <table className="table table-sm table-borderless">
              <tbody>
                {salonAddress && (
                  <tr>
                    <th scope="row" className="text-muted" style={{ width: "40%" }}>Adresa</th>
                    <td>{salonAddress}</td>
                  </tr>
                )}
                {salonPhone && (
                  <tr>
                    <th scope="row" className="text-muted">Telefon</th>
                    <td>{salonPhone}</td>
                  </tr>
                )}
                <tr>
                  <th scope="row" className="text-muted">Frizer</th>
                  <td>{hairdresserName || "—"}</td>
                </tr>
                <tr>
                  <th scope="row" className="text-muted">Usluga</th>
                  <td>
                    {serviceName || "—"}
                    {serviceDuration ? ` (${serviceDuration} min)` : ""}
                  </td>
                </tr>
                {servicePrice != null && (
                  <tr>
                    <th scope="row" className="text-muted">Cijena</th>
                    <td>{servicePrice} KM</td>
                  </tr>
                )}
                <tr>
                  <th scope="row" className="text-muted">Datum i vrijeme</th>
                  <td>{formatDateTime(date, startTime)}</td>
                </tr>
                {notes && (
                  <tr>
                    <th scope="row" className="text-muted">Napomena</th>
                    <td>{notes}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="modal-footer">
            {(status === "CONFIRMED" || status === "PENDING") && (
              <button
                className="btn btn-danger"
                onClick={() => {
                  onCancel(appointment);
                  onClose();
                }}
              >
                Otkaži termin
              </button>
            )}
            <button className="btn btn-secondary" onClick={onClose}>
              Zatvori
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentDetailModal;
