import React, { useState } from "react";
import "./AddUserForm.css";

function AddUserForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "male",
    email: "",
    phoneNumber: "",
    username: "",
    role: "USER",
    password: "user123!"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add user");
      }

      const newUser = await response.json();
      onSave(newUser); // Dodavanje novog korisnika u tabelu
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <div className="add-user-form">
      <h2>Dodaj Novog Korisnika</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Ime:
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </label>
        <label>
          Prezime:
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </label>
        <label>
          Datum rođenja:
          <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
        </label>
        <label>
          Spol:
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <label>
          Broj telefona:
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
        </label>
        <label>
          Username:
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </label>
        <label>
          Role:
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="USER">USER</option>
            <option value="HAIRDRESSER">HAIRDRESSER</option>
            <option value="OWNER">OWNER</option>
          </select>
        </label>
        <button type="submit" onClick={handleSubmit}>Sačuvaj</button>
        <button type="button" onClick={onCancel}>Otkaži</button>
      </form>
    </div>
  );
}

export default AddUserForm;
