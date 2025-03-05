import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AddSalon() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [owners, setOwners] = useState([]); // Lista vlasnika
    const [selectedOwner, setSelectedOwner] = useState(""); // Odabrani vlasnik
    const [hairdressers, setHairdressers] = useState([]); // Lista frizera
    const [selectedHairdressers, setSelectedHairdressers] = useState([]); // Odabrani frizeri
    const [message, setMessage] = useState(""); // Poruka o uspjehu ili grešci
    const [selectedImages, setSelectedImages] = useState([]); 

    // ✅ Dohvati sve korisnike sa ulogom OWNER i HAIRDRESSER
    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const response = await fetch("http://localhost:8080/users/role/OWNER", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    setOwners(data);
                }
            } catch (error) {
                console.error("Greška pri dohvaćanju vlasnika:", error);
            }
        };

        const fetchHairdressers = async () => {
            try {
                const response = await fetch("http://localhost:8080/users/role/HAIRDRESSER", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    setHairdressers(data);
                }
            } catch (error) {
                console.error("Greška pri dohvaćanju frizera:", error);
            }
        };

        fetchOwners();
        fetchHairdressers();
    }, []);

     // ✅ Obradi odabir slika
     const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(files);
    };

    // ✅ Funkcija za dodavanje salona
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            setMessage("❌ Autorizacija neuspješna!");
            return;
        }

        const salonData = {
            name,
            address,
            phoneNumber,
            email,
            ownerUsername: selectedOwner, // Slanje username-a vlasnika
            employeeUsernames: selectedHairdressers,
        };

        try {
            const response = await fetch("http://localhost:8080/salons", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(salonData),
            });

            if (response.ok) {
                const createdSalon = await response.json(); // ✅ Dobijemo kreirani salon iz odgovora
                const salonId = createdSalon.id; // 🔹 Dohvatimo ID salona
                
                // 🔹 Ako su frizeri odabrani, dodaj ih u salon
                if (selectedHairdressers.length > 0) {
                    await addHairdressersToSalon(salonId, selectedHairdressers, token);
                }
                
                // 2️⃣ Ako su slike dodane, upload-aj ih
                if (selectedImages.length > 0) {
                    const formData = new FormData();
                    selectedImages.forEach((image) => {
                        formData.append("files", image);
                    });

                    const imageUploadResponse = await fetch(`http://localhost:8080/salons/${createdSalon.id}/upload-images`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`, // Autentifikacija
                        },
                        body: formData,
                    });

                    if (!imageUploadResponse.ok) {
                        setMessage("❌ Greška pri dodavanju slika.");
                        return;
                    }
                }
                
                setMessage("✅ Salon uspješno dodan!");
                setTimeout(() => navigate("/maps"), 1500); // Redirect na /salons
            } else {
                setMessage("❌ Greška pri dodavanju salona.");
            }
        } catch (error) {
            console.error("Greška pri slanju zahtjeva:", error);
        }
    };

    const addHairdressersToSalon = async (salonId, hairdresserUsernames, token) => {
        try {
            // 🔹 Dohvati ID-ove frizera na osnovu username-a
            const hairdresserIds = await fetchHairdresserIds(hairdresserUsernames, token);
    
            if (hairdresserIds.length === 1) {
                // ✅ Ako je samo jedan frizer, koristimo "/employees/add"
                await fetch(`http://localhost:8080/salons/${salonId}/employees/add`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(hairdresserIds[0]), // Šaljemo samo jedan ID
                });
            } else if (hairdresserIds.length > 1) {
                // ✅ Ako su više frizeri, koristimo "/employees"
                await fetch(`http://localhost:8080/salons/${salonId}/employees`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(hairdresserIds), // Šaljemo niz ID-ova
                });
            }
        } catch (error) {
            console.error("❌ Greška pri dodavanju frizera u salon:", error);
        }
    };
    
    const fetchHairdresserIds = async (usernames, token) => {
        try {
            const requests = usernames.map(async (username) => {
                const response = await fetch(`http://localhost:8080/users/username/${username}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                if (response.ok) {
                    const userData = await response.json();
                    return userData.id; // ✅ Vraćamo ID frizera
                }
                return null; // Ako ne pronađe frizera, vraćamo null
            });
    
            const ids = await Promise.all(requests);
            return ids.filter((id) => id !== null); // ✅ Filtriramo null vrijednosti
        } catch (error) {
            console.error("❌ Greška pri dohvaćanju ID-ova frizera:", error);
            return [];
        }
    };

    return (
        <div className="container mt-4 text-center">
            <h1 className="text-center">Dodaj novi salon</h1>
            <form onSubmit={handleSubmit} className="bg-dark p-4 rounded text-light bg-opacity-50">
                <div className="mb-3">
                    <label className="form-label">Ime salona</label>
                    <input type="text" className="form-control text-center" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Adresa</label>
                    <input type="text" className="form-control text-center" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Telefon</label>
                    <input type="text" className="form-control text-center" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control text-center" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Vlasnik salona</label>
                    <select className="form-select text-center" value={selectedOwner} onChange={(e) => setSelectedOwner(e.target.value)} required>
                        <option value="">Odaberi vlasnika</option>
                        {owners.map((owner) => (
                            <option key={owner.username} value={owner.username}>
                                {owner.firstName} {owner.lastName} ({owner.username})
                            </option>
                        ))}
                    </select>
                    <button className="btn btn-sm btn-outline-light mt-3" onClick={() => navigate("/admin")}>
                        ➕ Dodaj novog vlasnika
                    </button>
                </div>
                <div className="mb-3">
                    <label className="form-label">Frizeri</label>
                    <select className="form-select text-center" multiple value={selectedHairdressers} onChange={(e) => setSelectedHairdressers([...e.target.selectedOptions].map(option => option.value))}>
                        {hairdressers.map((hairdresser) => (
                            <option key={hairdresser.username} value={hairdresser.username}>
                                {hairdresser.firstName} {hairdresser.lastName} ({hairdresser.username})
                            </option>
                        ))}
                    </select>
                    <button className="btn btn-sm btn-outline-light mt-3" onClick={() => navigate("/admin")}>
                        ➕ Dodaj novog frizera
                    </button>
                </div>
                
                 {/* 📸 Sekcija za dodavanje slika */}
                 <div className="mb-3">
                    <label className="form-label">Dodaj slike salona (nije obavezno)</label>
                    <input type="file" className="form-control" multiple onChange={handleImageChange} />
                </div>

                <button type="submit" className="btn btn-success w-100">Dodaj Salon</button>
            </form>
            {message && <p className="text-center mt-3">{message}</p>}
        </div>
    );
}

export default AddSalon;