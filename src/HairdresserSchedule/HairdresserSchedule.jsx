import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import WeeklyShiftForm from "./WeeklyShiftForm";
import DailyShiftForm from "./DailyShiftForm";
import "./HairdresserSchedule.css";

const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
const dayLabels = ["PON", "UTO", "SRI", "ČET", "PET", "SUB", "NED"];
const startHour = 8;
const endHour = 22;
const timeSlots = [];

for (let hour = startHour; hour < endHour; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
}

function HairdresserSchedule() {

    const { hairdresserId } = useParams();
    const [showWeeklyForm, setShowWeeklyForm] = useState(false);
    const [showDailyForm, setShowDailyForm] = useState(false);
    const [workingHours, setWorkingHours] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [calendarId, setCalendarId] = useState(null);

    const getStartOfWeek = (date) => {
      const d = new Date(date);
      const day = d.getDay(); // 0 (ned) - 6 (sub)
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // pomak do ponedjeljka
      return new Date(d.setDate(diff));
    }; 
    
    const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));

    useEffect(() => {
        const fetchWorkingHours = async () => {
            try {
                const response = await fetch(`http://localhost:8080/working-hours/hairdresser/${hairdresserId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                if (!response.ok) throw new Error("Greška pri dohvaćanju radnih sati");
                const data = await response.json();
                setWorkingHours(data);
                console.log("Dohvaćeni podaci o smjenama: ", data);
            } catch (error) {
                console.error("❌ Greška pri dohvatu radnog vremena:", error);
            }
        };

        const fetchCalendarAndAppointments = async () => {
            try {
              // 1. Dohvati calendar ID
              const calendarRes = await fetch(`http://localhost:8080/calendars/hairdresser/${hairdresserId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
              });
        
              if (!calendarRes.ok) throw new Error("Neuspješno dohvaćanje kalendara");
              const calendarData = await calendarRes.json();
              setCalendarId(calendarData.id);
        
              // 2. Dohvati sve termine za taj kalendar
              const appointmentRes = await fetch(`http://localhost:8080/appointments/calendar/${calendarData.id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
              });
        
              if (!appointmentRes.ok) throw new Error("Neuspješno dohvaćanje termina");
              const appointmentsData = await appointmentRes.json();
              setAppointments(appointmentsData);
              console.log("📅 Termini sa detaljima:", appointmentsData);
            } catch (err) {
              console.error("❌ Greška:", err);
            }
          };
        
          fetchWorkingHours();
          fetchCalendarAndAppointments();
    }, [hairdresserId]);

    const handleWeeklySubmit = async (weeklyData) => {
        try {
          const response = await fetch(`http://localhost:8080/working-hours/hairdresser/${hairdresserId}/weekly`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(weeklyData),
          });
      
          if (!response.ok) throw new Error("Greška prilikom slanja podataka.");
          
          alert("✅ Radna sedmica uspješno postavljena!");
          setShowWeeklyForm(false);
          console.log("🔹 Weekly data za slanje:", weeklyData);
          window.location.reload();
        } catch (error) {
          console.error("❌ Greška:", error);
          alert("❌ Došlo je do greške. Pokušajte ponovo.");
          console.log("🔹 Weekly data za slanje:", weeklyData);
        }
      };

      const handleDailySubmit = async (dailyData) => {
        try {

            console.log("📦 Podaci koji se šalju:", dailyData);
            const response = await fetch(`http://localhost:8080/working-hours/hairdresser/day/${hairdresserId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(dailyData),
        });
    
          if (!response.ok) throw new Error("Greška prilikom slanja podataka.");
    
          alert("✅ Radno vrijeme po danima uspješno postavljeno!");
          setShowDailyForm(false);
          window.location.reload();
        } catch (error) {
          console.error("❌ Greška:", error);
          alert("❌ Došlo je do greške. Pokušajte ponovo.");
        }
      };

      // Pomoćna funkcija: pretvara [hh, mm] => "HH:mm"
        const formatTimeArray = (timeArray) => {
            if (!Array.isArray(timeArray) || timeArray.length !== 2) return null;
            const [hour, minute] = timeArray;
            return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        };   
        
        const weekDates = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(currentWeekStart);
          d.setDate(currentWeekStart.getDate() + i);
          return d;
        });
        
    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Frizerski Kalendar</h2>

            <div className="d-flex justify-content-evenly mb-4">
            <button 
            className="btn btn-success me-2" 
            onClick={() => setShowWeeklyForm(!showWeeklyForm)}
            >
            {showWeeklyForm ? "Zatvori formu" : "Unesi sedmičnu smjenu"}
            </button>

            <button className="btn btn-primary" onClick={() => setShowDailyForm(!showDailyForm)}>
                Unesi smjenu po danima
                </button>
            </div>

            {showWeeklyForm && (
            <WeeklyShiftForm onSubmit={handleWeeklySubmit} />
            )}

            {showDailyForm && (
            <DailyShiftForm onSubmit={handleDailySubmit} />
            )}

            <div className="calendar-table-wrapper rounded-3 bg-light bg-opacity-25 shadow p-2">
                <table className="table table-bordered calendar-table text-center">
                    <thead className="table-light">
                        <tr>
                            <th>Vrijeme</th>
                            {weekDates.map((date, index) => (
                            <th key={index}>
                              {dayLabels[index]} <br />
                              {`${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.`}
                            </th>
                          ))}
                        </tr>
                    </thead>
                    <tbody>
                        {timeSlots.map((slot, rowIndex) => (
                            <tr key={rowIndex}>
                                <td className="fw-bold">{slot}</td>
                                {days.map((dayKey, colIndex) => {
                                const wh = workingHours.find(w => w.dayOfWeek === dayKey);
                                const start = wh?.startTime;
                                const end = wh?.endTime;
                                const formattedStart = formatTimeArray(start);
                                const formattedEnd = formatTimeArray(end);
                                const isDayOff = wh?.dayOff;
                                const currentHour = slot;

                                const isActive = formattedStart && formattedEnd &&
                                    currentHour >= formattedStart && currentHour < formattedEnd;

                                const appointment = appointments.find(appt => {
                                    const apptDate = new Date(appt.date[0], appt.date[1] - 1, appt.date[2]);
                                    const apptDay = apptDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
                                    const [apptHour, apptMin] = appt.startTime;
                                    const slotHour = parseInt(slot.split(":")[0]);
                                    const slotMin = parseInt(slot.split(":")[1]);
                                  
                                    return apptDay === dayKey && apptHour === slotHour && apptMin === slotMin;
                                  });
                                  
                                  const isBooked = !!appointment;
                                  
                                  const cellClass = isBooked
                                    ? "bg-danger bg-opacity-50"
                                    : isDayOff
                                    ? "bg-secondary bg-opacity-25"
                                    : isActive
                                    ? "bg-success bg-opacity-50"
                                    : "";
                                  
                                    let tooltipText = "";

                                    if (isBooked && appointment?.customer && appointment?.service) {
                                    tooltipText = `${appointment.customer.firstName} ${appointment.customer.lastName}\n${appointment.service.nazivUsluge}\n📞 ${appointment.customer.phoneNumber}\nPočetak usluge: ${appointment.startTime}\nTrajanje usluge: ${appointment.service.trajanjeUsluge} min`;
                                    } else if (isDayOff) {
                                    tooltipText = "🚫 Neradni dan";
                                    } else if (isActive) {
                                    tooltipText = "✅ Slobodan termin";
                                    }                                
                                  
                                return <td key={colIndex} className={cellClass} title={tooltipText}>                                
                                </td>;
                            })}

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default HairdresserSchedule;
