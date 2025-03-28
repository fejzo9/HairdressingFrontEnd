import React, { useState } from "react";
import { DayOfWeekOptions } from "./utils/DayOfWeekOptions"; // 🔹 Helper lista dana
import "./DailyShiftForm.css";

function DailyShiftForm({ onSubmit, onCancel }) {
  const [dayOfWeek, setDayOfWeek] = useState("MONDAY");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("16:00");
  const [isDayOff, setIsDayOff] = useState(false);

  const parseTime = (timeStr) => {
    const [hour, minute] = timeStr.split(":").map(Number);
    return [hour, minute];
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    const data = {
      dayOfWeek,
      isDayOff,
      startTime: isDayOff ? null : parseTime(startTime),
      endTime: isDayOff ? null : parseTime(endTime) 
    };
  
    console.log("📤 Šaljem dnevne podatke:", data);
  
    onSubmit(data); // 👈 šalje podatke roditeljskoj komponenti
  };

  return (
    <form onSubmit={handleSubmit} className="bg-light text-dark p-4 rounded shadow bg-opacity-50 mb-4">
      <h4 className="text-center mb-3">Unos smjene za jedan dan</h4>

      <div className="mb-3">
        <label className="form-label d-flex justify-content-center">Dan</label>
        <select
          className="form-select"
          value={dayOfWeek}
          onChange={(e) => setDayOfWeek(e.target.value)}
          required
        >
          {DayOfWeekOptions.map((day) => (
            <option key={day.value} value={day.value}>
              {day.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-check form-switch mb-3 d-flex justify-content-center">
        <input
          className="form-check-input"
          type="checkbox"
          checked={isDayOff}
          onChange={() => setIsDayOff(!isDayOff)}
        />
        <label className="form-check-label">Neradni dan</label>
      </div>

      {!isDayOff && (
        <>
          <div className="mb-3">
            <label className="form-label">Početak rada</label>
            <input
              type="time"
              className="form-control"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Kraj rada</label>
            <input
              type="time"
              className="form-control"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </>
      )}

      <div className="d-flex justify-content-around">
        <button type="submit" className="btn btn-success">
          Sačuvaj dan
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Otkaži
        </button>
      </div>
    </form>
  );
}

export default DailyShiftForm;
