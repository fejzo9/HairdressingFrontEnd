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
            employeeUsernames: selectedHairdressers, // Slanje username-a frizera
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
                setMessage("✅ Salon uspješno dodan!");
                setTimeout(() => navigate("/maps"), 1500); // Redirect na /salons
            } else {
                setMessage("❌ Greška pri dodavanju salona.");
            }
        } catch (error) {
            console.error("Greška pri slanju zahtjeva:", error);
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
                <button type="submit" className="btn btn-success w-100">Dodaj Salon</button>
            </form>
            {message && <p className="text-center mt-3">{message}</p>}
        </div>
    );
}

export default AddSalon;