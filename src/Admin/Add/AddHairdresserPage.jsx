import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddUserForm.css";
import API_BASE_URL from '../../config/api';

function AddHairdresserPage() {
  const navigate = useNavigate(); // ✅ Navigacija omogućena

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "male",
    email: "",
    phoneNumber: "",
    username: "",
    role: "HAIRDRESSER",
    password: "user123!"
  });

  const role2 = localStorage.getItem("role");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Funkcija za slanje podataka na backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🚀 Slanje zahtjeva za dodavanje frizera...");

    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      console.log("🔍 Server response:", response);
      
      if (!response.ok) {
        throw new Error("❌ Greška pri dodavanju korisnika");
      }

      const newUser = await response.json();
      console.log("✅ Novi frizer dodan:", newUser);

      alert("✅ Frizer uspješno dodat!"); // ✅ Kratak feedback korisniku

        // ✅ Preusmjeravanje na prethodnu stranicu nakon uspješnog dodavanja
        navigate(-1);
    } catch (error) {
      console.error("❌ Greška pri dodavanju frizera:", error);
      alert("❌ Greška pri dodavanju frizera. Pokušajte ponovo!");
    }
  };
  
  // ✅ Funkcija za otkazivanje i povratak na prethodnu stranicu
  const handleCancel = () => {
    navigate(-1); // 👈 Vraća korisnika na prethodnu stranicu
  };

  return (
    <div className="add-user-form">
      <h2>Dodaj Novog Frizera</h2>
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
            <option value="male">Muški</option>
            <option value="female">Ženski</option>
            <option value="other">Ostalo</option>
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

        {/* ✅ ADMIN i SUPER_ADMIN mogu mijenjati uloge */}
        {(role2 === "ADMIN" || role2 === "SUPER_ADMIN") && (
        <label>
          Role:
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="USER">USER</option>
            <option value="HAIRDRESSER">HAIRDRESSER</option>
            <option value="OWNER">OWNER</option>
          </select>
        </label>
        )}
        <div className="button-group">
          <button type="submit">Sačuvaj</button>
          <button type="button" onClick={handleCancel}>Otkaži</button>
        </div>
      </form>
    </div>
  );
}

export default AddHairdresserPage;
