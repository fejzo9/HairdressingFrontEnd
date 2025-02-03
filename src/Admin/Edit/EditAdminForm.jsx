import React, { useState, useEffect } from 'react';
import "./EditAdminForm.css";

function EditAdminForm({ admin, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    username: admin.username,
    email: admin.email,
    role: admin.role
  });

  useEffect(() => {
    setFormData({
      username: admin.username,
      email: admin.email,
      role: admin.role
    });
  }, [admin]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/admins/${admin.id}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Failed to update admin");
      }

      const updatedAdmin = await response.json();
      onSave(updatedAdmin); // Ažuriraj tabelu sa novim podacima
    } catch (error) {
      console.error("Error updating admin:", error);
    }
  };

  return (
    <div className="edit-admin-form">
      <h2>Uredi Admina</h2>
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
        <button type="submit">Sačuvaj promjene</button>
        <button type="button" onClick={onCancel}>Otkaži</button>
      </form>
    </div>
  );
}

export default EditAdminForm;
