import { DEFAULT_FILTERS } from "./appointmentConstants";

function AppointmentFilters({ filters, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  const handleClear = () => {
    onChange({ ...DEFAULT_FILTERS });
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <div className="row g-2 align-items-end">
          <div className="col-12 col-md-4">
            <label className="form-label small mb-1">Pretraga</label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Salon, frizer, usluga..."
              value={filters.search}
              onChange={(e) => handleChange("search", e.target.value)}
            />
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label small mb-1">Salon</label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Naziv salona"
              value={filters.salon}
              onChange={(e) => handleChange("salon", e.target.value)}
            />
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label small mb-1">Frizer</label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Ime frizera"
              value={filters.hairdresser}
              onChange={(e) => handleChange("hairdresser", e.target.value)}
            />
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label small mb-1">Usluga</label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Naziv usluge"
              value={filters.service}
              onChange={(e) => handleChange("service", e.target.value)}
            />
          </div>
          <div className="col-6 col-md-1">
            <label className="form-label small mb-1">Sortiraj</label>
            <select
              className="form-select form-select-sm"
              value={filters.sortBy}
              onChange={(e) => handleChange("sortBy", e.target.value)}
            >
              <option value="date_desc">Datum ↓</option>
              <option value="date_asc">Datum ↑</option>
              <option value="salon_asc">Salon A-Z</option>
            </select>
          </div>
          <div className="col-6 col-md-1 d-flex align-items-end">
            <button
              className="btn btn-sm btn-outline-secondary w-100"
              onClick={handleClear}
            >
              Očisti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentFilters;
