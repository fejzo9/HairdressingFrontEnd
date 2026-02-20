import React, { useState, useEffect } from "react";
import "./EditUserForm.css";
import API_BASE_URL from '../../config/api';

function EditUserForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    birthDate: user.birthDate,
    gender: user.gender,
    email: user.email,
    phoneNumber: user.phoneNumber,
    username: user.username,
    role: user.role
  });

  const [selectedImage, setSelectedImage] = useState(null); // 📸 Drži odabranu sliku
  const [profilePicture, setProfilePicture] = useState(null);

  // Dohvati korisnika
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

  // ✅ Dohvati profilnu sliku korisnika
  useEffect(() => {
    const fetchProfilePicture = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${user.id}/profile-picture`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            if (response.ok) {
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                setProfilePicture(imageUrl);
            }
        } catch (error) {
            console.error("❌ Greška pri dohvaćanju profilne slike:", error);
        }
    };

    fetchProfilePicture();
  }, [user.id]);

  // 📸 Obrada odabira slike
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Uzmi prvu odabranu datoteku
    if (file) {
      setSelectedImage(file);
    }
  };

  // 📤 Funkcija za upload slike na backend
  const handleImageUpload = async () => {
    if (!selectedImage) return; // Ako nema slike, preskoči upload

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}/upload-profile-picture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("❌ Greška pri uploadu slike!");
      }

      console.log("✅ Profilna slika uspješno dodana!");
    } catch (error) {
      console.error(error);
    }
  };

  // 📤 Funkcija za spremanje podataka i slanja slike
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // 1️⃣ Prvo ažuriraj korisničke podatke
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("❌ Greška pri ažuriranju korisnika!");
      }

      const updatedUser = await response.json();

      // 2️⃣ Ako je odabrana nova slika, pošalji je na backend
      if (selectedImage) {
        await handleImageUpload();
      }

      onSave(updatedUser); // 🔄 Ažuriraj korisnika u listi
    } catch (error) {
      console.error("❌ Greška:", error);
    }
  };

  return (
    <div className="edit-user-form">
      <h2>Uredi Korisnika</h2>
      <form onSubmit={handleSubmit}>
        {/* ✅ Prikaz postojeće profilne slike ako postoji */}
        {profilePicture ? (
          <div className="d-flex flex-column align-items-center mb-3">
            <p className="text-center fw-bold">Trenutna profilna slika:</p>
            <img src={profilePicture} alt="Profilna slika" 
                className="rounded-circle border shadow"
                style={{ width: "120px", height: "120px", objectFit: "cover" }} />
          </div>
        ) : (
          <p className="text-center text-light">🚫 Korisnik nema profilnu sliku.</p>
        )}

        <label>
          Ime:
          <input type="text" name="firstName" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
        </label>
        <label>
          Prezime:
          <input type="text" name="lastName" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
        </label>
        <label>
          Datum rođenja:
          <input type="date" name="birthDate" value={formData.birthDate} onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} required />
        </label>
        <label>
          Spol:
          <select name="gender" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} required>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
        </label>
        <label>
          Telefon:
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} required />
        </label>
        <label>
          Username:
          <input type="text" name="username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
        </label>
        <label>
          Uloga:
          <select name="role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required>
            <option value="USER">USER</option>
            <option value="HAIRDRESSER">HAIRDRESSER</option>
            <option value="OWNER">OWNER</option>
          </select>
        </label>

        {/* 📸 Sekcija za upload slike */}
        <label>
          Profilna slika:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        {selectedImage && (
          <div className="d-flex flex-column align-items-center mt-3">
            <p className="text-center">Pregled slike:</p>
            <img src={URL.createObjectURL(selectedImage)} alt="Pregled"
                className="rounded-circle border"
                style={{ width: "100px", height: "100px", objectFit: "cover" }} />
          </div>
        )}

        <button type="submit">Sačuvaj promjene</button>
        <button type="button" onClick={onCancel}>Otkaži</button>
      </form>
    </div>
  );
}

export default EditUserForm;
