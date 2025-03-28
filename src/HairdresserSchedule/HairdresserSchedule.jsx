import React, { useState } from "react";
import { useParams } from "react-router-dom";
import WeeklyShiftForm from "./WeeklyShiftForm";
import "./HairdresserSchedule.css";

const days = ["PON", "UTO", "SRI", "CET", "PET", "SUB", "NED"];
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
        } catch (error) {
          console.error("❌ Greška:", error);
          alert("❌ Došlo je do greške. Pokušajte ponovo.");
          console.log("🔹 Weekly data za slanje:", weeklyData);
        }
      };
      

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

                <button className="btn btn-primary">Unesi smjenu po danima</button>
            </div>

            {showWeeklyForm && (
            <WeeklyShiftForm onSubmit={handleWeeklySubmit} />
            )}


            <div className="calendar-table-wrapper rounded-3 bg-light bg-opacity-25 shadow p-2">
                <table className="table table-bordered calendar-table text-center">
                    <thead className="table-light">
                        <tr>
                            <th>Vrijeme</th>
                            {days.map(day => (
                                <th key={day}>{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {timeSlots.map((slot, rowIndex) => (
                            <tr key={rowIndex}>
                                <td className="fw-bold">{slot}</td>
                                {days.map((day, colIndex) => (
                                    <td key={colIndex} className="time-cell">
                                        {/* Prazna ćelija - kasnije možemo popunjavati */}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default HairdresserSchedule;
