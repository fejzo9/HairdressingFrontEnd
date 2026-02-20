import React, { useState, useEffect } from "react";
import API_BASE_URL from '../config/api';

function UserProfile({ userId }) {
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/users/${userId}/profile-picture`)
      .then((response) => response.blob()) // 🔹 Konvertuje odgovor u binarni format
      .then((imageBlob) => {
        setProfilePic(URL.createObjectURL(imageBlob)); // 🔹 Kreira URL za prikaz slike
      })
      .catch(() => setProfilePic(null)); // Ako nema slike, ostavi prazno
  }, [userId]);

  function handleFileChange(event) {
    const file = event.target.files[0];
  
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
  
      fetch(`${API_BASE_URL}/users/${userId}/upload-profile-picture`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.text())
        .then((data) => {
          alert(data); // ✅ Prikazuje poruku o uspjehu
          window.location.reload(); // ✅ Osvježava stranicu da se vidi nova slika
        })
        .catch((error) => console.error("Greška pri uploadu slike:", error));
    }
  }

  return (
    <div>
      <h2>Moj Profil</h2>
      <img
        src={profilePic || "./public/user-photo.png"} // Ako nema slike, koristi default, PROVJERITI PUTANJU
        alt="Profilna slika"
        style={{ width: "150px", height: "150px", borderRadius: "50%" }}
      />
    </div>
  );
}

export default UserProfile;
