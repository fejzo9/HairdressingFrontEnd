import React, { useState } from "react";
import './AddAdminForm.css';

function AddAdminForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "ADMIN", // Default uloga
    password: "" // Dodajemo polje za password
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add admin");
      }

      const newAdmin = await response.json();
      onSave(newAdmin); // Dodaje novog admina u tabelu
    } catch (error) {
      console.error("Error adding admin:", error);
    }
  };

  return (
    <div className="add-admin-form">
      <h2>Dodaj Novog Admina</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <label>
          Role:
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="ADMIN">ADMIN</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
          </select>
        </label>
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>
        <button type="submit">Dodaj Admina</button>
        <button type="button" onClick={onCancel}>Otkaži</button>
      </form>
    </div>
  );
}

export default AddAdminForm;
