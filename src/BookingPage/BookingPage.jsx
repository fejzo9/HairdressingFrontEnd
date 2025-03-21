import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function BookingPage() {
    const { hairdresserId } = useParams();
    const { salonId } = useParams();
    const navigate = useNavigate();
    const [calendar, setCalendar] = useState(null);
    const [services, setServices] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedService, setSelectedService] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    
    useEffect(() => {
        const fetchCalendar = async () => {
            try {
                const response = await fetch(`http://localhost:8080/calendars/hairdresser/${hairdresserId}`);
                if (!response.ok) throw new Error("Neuspješno dohvaćanje kalendara.");
                const data = await response.json();
                setCalendar(data);
            } catch (error) {
                console.error("❌ Greška pri dohvaćanju kalendara:", error);
            }
        };

        const fetchServices = async () => {
            try {
                const response = await fetch(`http://localhost:8080/services/salon/${salonId}`);
                if (!response.ok) throw new Error("Neuspješno dohvaćanje usluga.");
                const data = await response.json();
                setServices(data);
            } catch (error) {
                console.error("❌ Greška pri dohvaćanju usluga:", error);
            }
        };

        fetchCalendar();
        if (calendar) fetchServices();
        setLoading(false);
    }, [hairdresserId, calendar]);

    const handleBooking = async () => {
        if (!selectedDate || !selectedTime || !selectedService) {
            setMessage("❌ Molimo odaberite datum, satnicu i uslugu.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("❌ Morate biti prijavljeni za rezervaciju termina.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/appointments/book", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    calendarId: calendar.id,
                    serviceId: selectedService,
                    customerId: localStorage.getItem("id"),
                    date: selectedDate,
                    startTime: selectedTime,
                }),
            });

            if (!response.ok) throw new Error("Neuspješno kreiranje rezervacije.");
            setMessage("✅ Uspješno ste rezervisali termin! Hvala vam.");
            setTimeout(() => navigate("/"), 2000);
        } catch (error) {
            setMessage("❌ Greška pri rezervaciji termina. Pokušajte ponovo.");
            console.error("❌ Greška pri rezervaciji:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">Rezervacija termina</h2>
            {loading ? (
                <p className="text-center">🔄 Učitavanje...</p>
            ) : (
                <>
                    <label className="form-label">Odaberite datum:</label>
                    <input type="date" className="form-control mb-3" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />

                    <label className="form-label">Odaberite satnicu:</label>
                    <input type="time" className="form-control mb-3" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} />

                    <label className="form-label">Odaberite uslugu:</label>
                    <select className="form-select mb-3" value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                        <option value="">-- Odaberite uslugu --</option>
                        {services.map((service) => (
                            <option key={service.id} value={service.id}>{service.naziv_usluge} - {service.cijena_usluge} KM</option>
                        ))}
                    </select>
                       
                    <button className="btn btn-primary w-100" onClick={handleBooking}>Rezerviši</button>
                    {message && <p className="text-center mt-3">{message}</p>}
                </>
            )}
        </div>
    );
}

export default BookingPage;
