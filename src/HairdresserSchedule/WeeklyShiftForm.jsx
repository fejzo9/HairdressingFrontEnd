import React, { useState } from "react";

function WeeklyShiftForm({ onSubmit }) {
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("16:00");
  const [selectedDays, setSelectedDays] = useState([]);

  const daysOfWeek = [
    "MONDAY",
    "TUESDAY", 
    "WEDNESDAY", 
    "THURSDAY", 
    "FRIDAY", 
    "SATURDAY", 
    "SUNDAY"
  ];

  const handleDayChange = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const workingHoursList = selectedDays.map((day) => ({
      dayOfWeek: day,
      startTime,
      endTime,
      dayOff: false,
    }));
    onSubmit(workingHoursList);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-dark text-light p-4 rounded shadow-sm mb-4 bg-opacity-50">
      <h5 className="text-center mb-3">Unesi sedmičnu smjenu</h5>
      <div className="mb-3">
        <label className="form-label">Vrijeme početka</label>
        <input
          type="time"
          className="form-control"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Vrijeme završetka</label>
        <input
          type="time"
          className="form-control"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Odaberi dane</label>
        <div className="d-flex flex-wrap">
          {daysOfWeek.map((day) => (
            <div key={day} className="form-check me-3">
              <input
                type="checkbox"
                className="form-check-input"
                id={day}
                checked={selectedDays.includes(day)}
                onChange={() => handleDayChange(day)}
              />
              <label className="form-check-label" htmlFor={day}>
                {day.slice(0, 3)}
              </label>
            </div>
          ))}
        </div>
      </div>
      <button type="submit" className="btn btn-primary w-100">
        Sačuvaj smjenu
      </button>
    </form>
  );
}

export default WeeklyShiftForm;
