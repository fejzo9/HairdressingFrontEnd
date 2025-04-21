import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';


function BookingPage() {
    const { hairdresserId } = useParams();
    const { salonId } = useParams();
    const navigate = useNavigate();

    const [calendar, setCalendar] = useState(null);
    const [services, setServices] = useState([]);
    const [workingHours, setWorkingHours] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedService, setSelectedService] = useState("");
    const [availableTimes, setAvailableTimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [token, setToken] = useState(localStorage.getItem("token"));
       
    // Prvi useEffect: dohvaća calendar i radno vrijeme frizera
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

        const fetchWorkingHours = async () => {
            try{
                console.log("Hairdresser id: ", hairdresserId);
                const response = await fetch(`http://localhost:8080/working-hours/hairdresser/${hairdresserId}`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  });
                if (!response.ok) throw new Error("Neusješno dohvaćanje radnog vremena.");
                const data = await response.json();
                setWorkingHours(data);  
            } catch (error) {
                console.error("❌ Greška pri dohvaćanju usluga:", error);
            }
        };

        fetchCalendar();
        fetchWorkingHours();
    }, [hairdresserId]); // ✅ Samo hairdresserId

        // Drugi useEffect: kad imamo calendar, dohvaćamo usluge
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(`http://localhost:8080/services/salon/${salonId}`);
                if (!response.ok) throw new Error("Neuspješno dohvaćanje usluga.");
                const data = await response.json();
                setServices(data);
                setLoading(false);
            } catch (error) {
                console.error("❌ Greška pri dohvaćanju usluga:", error);
                setLoading(false);
            }
        };

        if (calendar) {
            fetchServices();
        }
    }, [calendar, salonId]); // ✅ kad calendar postoji, onda dohvaćamo usluge

    const getDayOfWeek = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
    };

    useEffect(() => {
        console.log(workingHours);
        console.log(calendar);
        console.log(calendar?.appointments);
        if (!selectedDate || !workingHours.length || !calendar?.appointments) return;
      
        const dayOfWeek = getDayOfWeek(selectedDate).toUpperCase(); // Normalize
        const hours = workingHours.find(w => w.dayOfWeek === dayOfWeek && !w.dayOff);
        if (!hours || !hours.startTime || !hours.endTime) return setAvailableTimes([]);
    
        const [startHour, startMinute] = hours.startTime;
        const [endHour, endMinute] = hours.endTime;
    
        const startTime = new Date();
        startTime.setHours(startHour, startMinute, 0, 0);
        const endTime = new Date();
        endTime.setHours(endHour, endMinute, 0, 0);
    
        const times = [];
        while (startTime < endTime) {
            const timeStr = startTime.toTimeString().slice(0, 5);
    
            const isTaken = calendar.appointments.some(appt => {
                return (
                    appt.date[0] === new Date(selectedDate).getFullYear() &&
                    appt.date[1] === new Date(selectedDate).getMonth() + 1 &&
                    appt.date[2] === new Date(selectedDate).getDate() &&
                    appt.startTime[0] === startTime.getHours() &&
                    appt.startTime[1] === startTime.getMinutes()
                );
            });
    
            if (!isTaken) times.push(timeStr);
            startTime.setMinutes(startTime.getMinutes() + 30);
        }
    
        setAvailableTimes(times);
    }, [selectedDate, workingHours, calendar]);    

    const handleBooking = async () => {
        if (!selectedDate || !selectedTime || !selectedService) {
            setMessage("❌ Molimo odaberite datum, satnicu i uslugu.");
            return;
        }

        setToken(localStorage.getItem("token"));

        if (!token) {
            setMessage("❌ Morate biti prijavljeni za rezervaciju termina.");
            return;
        }

        try {
            const params = new URLSearchParams({
                calendarId: calendar.id,
                serviceId: selectedService,
                customerId: localStorage.getItem("id"),
                date: selectedDate,
                startTime: selectedTime
            });
            
            const response = await fetch(`http://localhost:8080/appointments/book?${params.toString()}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });            

            if (!response.ok) throw new Error("Neuspješno kreiranje rezervacije.");
            setMessage("✅ Uspješno ste rezervisali termin! Hvala vam.");
            setTimeout(() => navigate("/"), 2000);
        } catch (error) {
            setMessage("❌ Greška pri rezervaciji termina. Pokušajte ponovo.");
            console.error("❌ Greška pri rezervaciji:", error);
        }
    };

    // Da ne bih na backendu pravio datume, pa da se vraćaju datumi za frizera kada on radi
    // Napravio sam ovo na frontendu da mi izbaci lokalan izračun neradnih dana, za sljedećih 30 dana
    const getWorkingDates = () => {
        const today = new Date();
        const workingDates = [];
      
        for (let i = 0; i < 30; i++) {
          const date = new Date();
          date.setDate(today.getDate() + i);
      
          const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
      
          const dayWorks = workingHours.find(w => w.dayOfWeek === dayOfWeek && !w.dayOff);
      
          if (dayWorks) {
            workingDates.push(date.toISOString().split("T")[0]); // format "YYYY-MM-DD"
          }
        }
      
        return workingDates;
      };

      // Za formatiranje datuma, da bi mi se prikazao u formatu dd.mm.yyyy.
      const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}.${month}.${year}`;
      };
      
      
    return (
        <div className="container mt-4">
            <h2 className="text-center">Rezervacija termina</h2>
            {loading ? (
                <p className="text-center">🔄 Učitavanje...</p>
            ) : (
                <>
                 {/*  <label className="form-label">Odaberite datum:</label>
                    <select
                    className="form-select mb-3 text-center"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    >
                    <option value="">-- Odaberite datum --</option>
                    {getWorkingDates().map(date => (
                        <option key={date} value={date}>
                            {formatDate(date)}
                            </option>
                    ))}
                    </select> */}  
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className="mb-3">
                        <label className="form-label">Odaberite datum putem kalendara:</label>
                        <DateCalendar
                        disablePast
                        value={selectedDate ? dayjs(selectedDate) : null}
                        onChange={(newValue) => {
                            const isoDate = newValue.format("YYYY-MM-DD");
                            const availableDates = getWorkingDates();
                            if (availableDates.includes(isoDate)) {
                            setSelectedDate(isoDate);
                            }
                        }}
                        shouldDisableDate={(date) => {
                            const isoDate = date.format("YYYY-MM-DD");
                            return !getWorkingDates().includes(isoDate); // disable ako NIJE radni dan
                          }}
                        sx={{
                            backgroundColor: 'white',
                            borderRadius: 2,
                            boxShadow: 3,
                            p: { xs: 1, sm: 2, md: 3 },
                            pb: 4,
                            color: 'black',
                            width: 570,
                            '.MuiPickersDay-root': {
                                fontSize: '1.3rem',  // datumi: 1, 2, 3...
                                width: 48,
                                height: 48,
                                margin: '3px'
                              },
                              '.MuiPickersCalendarHeader-label': {
                                fontSize: '1.6rem', // mjesec i godina
                                fontWeight: 'bold',
                                color: 'black'
                              },
                              '.MuiPickersArrowSwitcher-button': {
                                color: 'black' // strelice
                              },
                              '.MuiDayCalendar-monthContainer': {
                                paddingBottom: '24px' // 👈 Daje prostor ispod zadnje sedmice
                                }
                            }}
                        />
                    </div>
                    </LocalizationProvider>

                    {/* Ovdje ostavljamo i stari select ako korisnik više voli taj način */}
                    <div className="mb-3">
                    <label className="form-label">Ili odaberite iz liste:</label>
                    <select
                        className="form-select text-center"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    >
                        <option value="">-- Odaberite datum --</option>
                        {getWorkingDates().map(date => (
                        <option key={date} value={date}>
                            {formatDate(date)}
                        </option>
                        ))}
                    </select>
                    </div>

                    {!selectedDate && (
                    <p className="text-danger d-flex justify-content-center">⚠️ Molimo prvo odaberite datum kako bi se prikazale dostupne satnice.</p>
                    )}

                    <label className="form-label">Odaberite satnicu:</label>
                    <select className="form-select mb-3 text-center" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                        <option value="">-- Odaberite vrijeme --</option>
                        {availableTimes.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>

                    <label className="form-label">Odaberite uslugu:</label>
                    <select className="form-select mb-3 text-center" value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                        <option value="">-- Odaberite uslugu --</option>
                        {services.map((service) => (
                            <option key={service.id} value={service.id}>{service.naziv_usluge} - {service.cijena_usluge} KM</option>
                        ))}
                    </select>
                       
                    <button className="btn btn-primary w-100" onClick={handleBooking}>Rezerviši</button>
                    {message && <p className="text-center mt-3">{message}</p>}
                </>
            )}

            {!token && (
                <div
                    className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center"
                    style={{ zIndex: 10 }}
                >
                    <div className="bg-white p-4 rounded text-center" style={{ maxWidth: '600px' }}>
                        <h5 className="mb-3 text-danger">Niste prijavljeni!</h5>
                        <p className="text-dark">
                            Da biste rezervisali termin, trebate imati svoj račun. <br />
                            Molimo vas <Link to="/login" className="fw-bold">prijavite se</Link> ili{' '}
                            <Link to="/registration" className="fw-bold">registrujte</Link>.
                        </p>
                    </div>
                </div>
            )} 

        </div>
    );
}

export default BookingPage;
