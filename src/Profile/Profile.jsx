import React, { useState, useEffect } from "react";
import "./Profile.css";

function Profile() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    phoneNumber: "",
    username: "",
    role: "",
    profilePicture: null,
  });

  const[adminData, setAdminData] = useState({
    username: "",
    email: "",
  });

  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.body.classList.add("profile-page");
    const userId = localStorage.getItem("id");
    const username = localStorage.getItem("username");

    if (!userId) {
        console.error("❌ ID korisnika nije pronađen u localStorage!");
        return;
    }

    const fetchUserData = async () => {
      try {
        
        const response = await fetch(`http://localhost:8080/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          fetchProfilePicture(data.profilePicture);
        }
      } catch (error) {
        console.error("Greška pri dohvaćanju podataka:", error);
      }
    };

    const fetchProfilePicture = async () => {
      if (isLoggedIn) {
        try {
          const response = await fetch(`http://localhost:8080/users/${localStorage.getItem("id")}/profile-picture`);
          if (response.ok) {
            const blob = await response.blob();
            setNewProfilePicture(URL.createObjectURL(blob));
          }
        } catch (error) {
          console.error("Greška pri dohvaćanju profilne slike:", error);
        }
      }
    };
    fetchProfilePicture();

    const fetchAdminData = async (adminUsername) => {
      try {
        const response = await fetch(`http://localhost:8080/admins/${adminUsername}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Greška pri dohvaćanju admin podataka!");

        const adminInfo = await response.json();
        setAdminData(adminInfo);
      } catch (error) {
        console.error("❌ Greška pri dohvaćanju admin podataka:", error);
      }
    };

    fetchUserData();
    fetchAdminData();

    return () => {
        // Ukloni klasu kada korisnik napusti Profile stranicu
        document.body.classList.remove("profile-page");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
        // 1️⃣ Prvo ažuriramo korisničke podatke (email, telefon)
        const userUpdateResponse = await fetch(`http://localhost:8080/users/${userData.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                email: userData.email,
                phoneNumber: userData.phoneNumber,
            }),
        });

        if (!userUpdateResponse.ok) {
            throw new Error("❌ Greška pri ažuriranju korisničkih podataka!");
        }

        // 2️⃣ Ako je odabrana nova profilna slika, šaljemo je
        if (newProfilePicture) {
            const formData = new FormData();
            formData.append("file", newProfilePicture);

            const imageResponse = await fetch(`http://localhost:8080/users/${userData.id}/upload-profile-picture`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!imageResponse.ok) {
                throw new Error("❌ Greška pri postavljanju profilne slike!");
            }
        }

        // 3️⃣ Postavljamo poruku o uspjehu i reloadujemo stranicu
        setMessage("✅ Podaci su uspješno ažurirani!");
        setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
        setMessage(error.message);
        console.error(error);
    }
  };

  const handleImageChange = (e) => {
    setNewProfilePicture(e.target.files[0]);
  };

  return (
    <div className="profile-container">
      <h2>Profil</h2>
      {console.log("🔍 Profilna slika URL:", userData.profilePicture)}
      <img src={userData.profilePicture 
           ? `http://localhost:8080/users/${userData.id}/profile-picture?timestamp=${new Date().getTime()}` 
           : "/user-photo.png"} 
     alt="Profilna slika" 
     className="profile-image" />

      <form onSubmit={handleSubmit} className="formaProfil">
        <label>Ime:</label>
        <input type="text" value={userData.firstName} disabled/>

        <label>Prezime:</label>
        <input type="text" value={userData.lastName} disabled/>

        <label>Datum rođenja:</label>
        <input type="text" value={userData.birthDate} disabled />

        <label>Email:</label>
        <input type="email" value={userData.email || adminData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} />

        <label>Broj telefona:</label>
        <input type="text" value={userData.phoneNumber} onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })} />

        <label>Username:</label>
        <input type="text" value={userData.username} disabled />

        <label>Promjena profilne slike:</label>
        <input type="file" onChange={handleImageChange} />

        <button type="submit">Sačuvaj promjene</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Profile;
