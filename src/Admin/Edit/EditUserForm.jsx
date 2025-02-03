import React, { useState, useEffect } from "react";
import "./EditUserForm.css";
 
function EditUserForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    birthDate: user.birthDate,
    gender: user.gender,
    email: user.email,
    username: user.username,
    role: user.role
  });

  useEffect(() => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      birthDate: user.birthDate,
      gender: user.gender,
      email: user.email,
      phoneNumber: user.phoneNumber,
      username: user.username,
      role: user.role
    });
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const updatedUser = await response.json();
      onSave(updatedUser); // Ažuriraj tabelu sa novim podacima
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="edit-user-form">
      <h2>Uredi Korisnika</h2>
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
          Phone:
          <input type="text" name="phone" value={formData.phoneNumber} onChange={handleChange} required />
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
        <button type="submit">Sačuvaj promjene</button>
        <button type="button" onClick={onCancel}>Otkaži</button>
      </form>
    </div>
  );
}

export default EditUserForm;
