const API_BASE = "http://localhost:8080";

export async function getMyAppointments(userId, status, page = 0, size = 10) {
  const params = new URLSearchParams({ page, size });
  if (status) params.append("status", status);
  const response = await fetch(
    `${API_BASE}/users/${userId}/appointments?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  if (!response.ok) throw new Error("Greška pri dohvaćanju termina.");
  return response.json();
}

export async function getAppointmentDetail(appointmentId) {
  const response = await fetch(`${API_BASE}/appointments/${appointmentId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) throw new Error("Greška pri dohvaćanju detalja termina.");
  return response.json();
}

export async function cancelAppointment(appointmentId) {
  const response = await fetch(
    `${API_BASE}/appointments/${appointmentId}/cancel`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  if (!response.ok) throw new Error("Greška pri otkazivanju termina.");
  return response.json();
}

export function filterAppointments(appointments, filters) {
  let result = [...appointments];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (a) =>
        a.salonName?.toLowerCase().includes(q) ||
        a.hairdresserName?.toLowerCase().includes(q) ||
        a.serviceName?.toLowerCase().includes(q)
    );
  }

  if (filters.salon) {
    result = result.filter((a) =>
      a.salonName?.toLowerCase().includes(filters.salon.toLowerCase())
    );
  }

  if (filters.hairdresser) {
    result = result.filter((a) =>
      a.hairdresserName?.toLowerCase().includes(filters.hairdresser.toLowerCase())
    );
  }

  if (filters.service) {
    result = result.filter((a) =>
      a.serviceName?.toLowerCase().includes(filters.service.toLowerCase())
    );
  }

  if (filters.sortBy === "date_asc") {
    result.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (filters.sortBy === "date_desc") {
    result.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (filters.sortBy === "salon_asc") {
    result.sort((a, b) => (a.salonName || "").localeCompare(b.salonName || ""));
  }

  return result;
}
