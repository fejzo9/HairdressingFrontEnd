import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import AppointmentCard from "./AppointmentCard";

const TABS = [
  { key: "upcoming", label: "Predstojeći" },
  { key: "past", label: "Prošli" },
  { key: "cancelled", label: "Otkazani" },
];

const EMPTY_MESSAGES = {
  upcoming: "Nemate predstojeće termine.",
  past: "Nemate prošlih termina.",
  cancelled: "Nemate otkazanih termina.",
};

function AppointmentHistoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");

  const fetchAppointments = useCallback(async (status) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `http://localhost:8080/users/${userId}/appointments?status=${status}&page=0&size=10`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error("Greška pri dohvaćanju termina.");
      const data = await response.json();
      setAppointments(data.content || data);
    } catch {
      setError("Greška pri učitavanju termina. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  }, [token, userId]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAppointments(activeTab);
  }, [activeTab, token, navigate, fetchAppointments]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Moji termini</h2>

      <ul className="nav nav-tabs mb-4">
        {TABS.map((tab) => (
          <li className="nav-item" key={tab.key}>
            <button
              className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {activeTab === tab.key && !loading && (
                <span className="badge bg-secondary ms-2">{appointments.length}</span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Učitavanje...</span>
          </div>
          <p className="mt-2">Učitavanje termina...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted fs-5">{EMPTY_MESSAGES[activeTab]}</p>
          {activeTab === "upcoming" && (
            <Link to="/salons" className="btn btn-primary mt-2">
              Rezerviši termin
            </Link>
          )}
        </div>
      ) : (
        <div className="row g-3">
          {appointments.map((appointment) => (
            <div className="col-12 col-md-6 col-lg-4" key={appointment.id}>
              <AppointmentCard
                appointment={appointment}
                onRefresh={() => fetchAppointments(activeTab)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AppointmentHistoryPage;
