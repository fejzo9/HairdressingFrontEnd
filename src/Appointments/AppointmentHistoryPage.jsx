import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getMyAppointments,
  cancelAppointment,
  filterAppointments,
} from "./appointmentService";
import { DEFAULT_FILTERS } from "./appointmentConstants";
import AppointmentCard from "./AppointmentCard";
import AppointmentFilters from "./AppointmentFilters";
import AppointmentDetailModal from "./AppointmentDetailModal";
import "./AppointmentHistoryPage.css";

const TABS = [
  { key: "upcoming", label: "Predstojeći", statuses: ["CONFIRMED", "PENDING"] },
  { key: "past", label: "Prošli", statuses: ["COMPLETED"] },
  { key: "cancelled", label: "Otkazani", statuses: ["CANCELLED"] },
];

function AppointmentHistoryPage() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS });
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const fetchAppointments = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getMyAppointments(userId);
      setAllAppointments(Array.isArray(data) ? data : data.content ?? []);
    } catch (err) {
      setError(err.message || "Greška pri učitavanju termina.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancel = async (appointment) => {
    if (!window.confirm("Jeste li sigurni da želite otkazati termin?")) return;
    try {
      await cancelAppointment(appointment.id);
      setAllAppointments((prev) =>
        prev.map((a) =>
          a.id === appointment.id ? { ...a, status: "CANCELLED" } : a
        )
      );
    } catch {
      alert("Greška pri otkazivanju termina. Pokušajte ponovo.");
    }
  };

  const currentTab = TABS.find((t) => t.key === activeTab);
  const tabAppointments = allAppointments.filter((a) =>
    currentTab.statuses.includes(a.status)
  );
  const displayedAppointments = filterAppointments(tabAppointments, filters);

  const tabCount = (tab) =>
    allAppointments.filter((a) => tab.statuses.includes(a.status)).length;

  if (!token) return null;

  return (
    <div className="container mt-4 appointment-history-page">
      <h2 className="mb-4 text-center">Moji termini</h2>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        {TABS.map((tab) => (
          <li className="nav-item" key={tab.key}>
            <button
              className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {!loading && (
                <span className="ms-1 badge bg-secondary">
                  {tabCount(tab)}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {/* Filters */}
      <AppointmentFilters filters={filters} onChange={setFilters} />

      {/* Content */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Učitavanje...</span>
          </div>
          <p className="mt-2">Učitavanje termina...</p>
        </div>
      ) : error ? (
        <div className="text-center py-5">
          <p className="text-danger">{error}</p>
          <button className="btn btn-primary" onClick={fetchAppointments}>
            Pokušaj ponovo
          </button>
        </div>
      ) : displayedAppointments.length === 0 ? (
        <div className="empty-state">
          {activeTab === "upcoming" ? (
            <>
              <p className="fs-5">Nemate predstojećih termina.</p>
              <Link to="/salons" className="btn btn-primary mt-2">
                Rezerviši termin
              </Link>
            </>
          ) : activeTab === "past" ? (
            <p className="fs-5">Nemate prošlih termina.</p>
          ) : (
            <p className="fs-5">Nemate otkazanih termina.</p>
          )}
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {displayedAppointments.map((appt) => (
            <div className="col" key={appt.id}>
              <AppointmentCard
                appointment={appt}
                onCancel={handleCancel}
                onViewDetails={setSelectedAppointment}
              />
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

export default AppointmentHistoryPage;
