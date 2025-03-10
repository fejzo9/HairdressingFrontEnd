import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditSalon() {
    const { id } = useParams(); // Dohvati ID salona iz URL-a
    const navigate = useNavigate();
    const [salon, setSalon] = useState(null);
    const [owners, setOwners] = useState([]); // Lista vlasnika
    const [hairdressers, setHairdressers] = useState([]); // Lista frizera
    const [selectedHairdressers, setSelectedHairdressers] = useState([]); // Odabrani frizeri
    const [message, setMessage] = useState(""); 
    const [loading, setLoading] = useState(true); // Stanje učitavanja
    const [isSubmitting, setIsSubmitting] = useState(false); // Sprječavanje duplih zahtjeva
    const [salonImages, setSalonImages] = useState([]); // Već postojeće slike
    const [selectedImages, setSelectedImages] = useState([]); // Nove slike

    // ✅ Dohvati podatke o salonu i korisnicima
    useEffect(() => {
        const fetchSalonDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/salons/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setSalon(data);
                    setSelectedHairdressers(data.employeeNames || []);
                }
            } catch (error) {
                console.error("❌ Greška pri dohvaćanju salona:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchSalonImages = async () => {
            try {
                const response = await fetch(`http://localhost:8080/salons/${id}/images`);
                if (response.ok) {
                    const data = await response.json();
                    setSalonImages(data.map((_, index) => `http://localhost:8080/salons/${id}/images/${index}`));
                }
            } catch (error) {
                console.error("❌ Greška pri dohvaćanju slika:", error);
            }
        };

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
                console.error("❌ Greška pri dohvaćanju vlasnika:", error);
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
                console.error("❌ Greška pri dohvaćanju frizera:", error);
            }
        };

        fetchSalonDetails();
        fetchSalonImages();
        fetchOwners();
        fetchHairdressers();
        setLoading(false);
    }, [id]);

    // ✅ Funkcija za slanje ažuriranih podataka
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("❌ Autorizacija neuspješna!");
            setIsSubmitting(false);
            return;
        }

        const updatedSalonData = {
            ...salon,
            employeeUsernames: selectedHairdressers,
        };

        try {
            const response = await fetch(`http://localhost:8080/salons/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedSalonData),
            });

            if (response.ok) {
                setMessage("✅ Salon uspješno ažuriran!");

                 // ✅ Ako su dodane nove slike, pošalji ih na backend
                 if (selectedImages.length > 0) {
                    await uploadSalonImages();
                }

                setTimeout(() => navigate("/maps"), 1500); // Redirect
            } else {
                setMessage("❌ Greška pri ažuriranju salona.");
            }
        } catch (error) {
            console.error("❌ Greška pri slanju zahtjeva:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

      // ✅ Obradi odabir novih slika
      const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(files);
    };

    // ✅ Funkcija za upload novih slika
    const uploadSalonImages = async () => {
        try {
            console.log("🔹 Upload slika započeo...");
            const token = localStorage.getItem("token");
            const formData = new FormData();
            selectedImages.forEach((image) => formData.append("files", image));

            const response = await fetch(`http://localhost:8080/salons/${id}/upload-images`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (response.ok) {
                console.log(`✅ Nove slike uspješno dodane u salon ID ${id}`);
            } else {
                console.log("❌ Greška pri dodavanju slika.");
            }
        } catch (error) {
            console.error("❌ Greška pri uploadu slika:", error);
        }
    };

    if (loading) return <p className="text-center">Učitavanje...</p>;
    if (!salon) return <p className="text-center text-danger">❌ Salon nije pronađen.</p>;

    return (
        <div className="container mt-4 text-center">
            <h1 className="text-center">Uredi salon</h1>
            <form onSubmit={handleSubmit} className="bg-dark p-4 rounded text-light bg-opacity-50">
                 {/* 📸 Prikaz postojećih slika */}
                 <div className="mb-3">
                    <h5>Postojeće slike:</h5>
                    <div className="d-flex flex-wrap justify-content-center">
                        {salonImages.map((image, index) => (
                            <img key={index} src={image} alt={`Salon Slika ${index}`} className="m-2 rounded" style={{ width: "150px", height: "150px", objectFit: "cover" }} />
                        ))}
                    </div>
                </div>
                
                 {/* 📸 Sekcija za dodavanje slika */}
                 <div className="mb-3">
                    <label className="form-label">Dodaj slike salona (po želji)</label>
                    <input type="file" className="form-control" multiple onChange={handleImageChange} />
                </div>
                
                <div className="mb-3">
                    <label className="form-label">Ime salona</label>
                    <input type="text" className="form-control text-center" value={salon.name} onChange={(e) => setSalon({...salon, name: e.target.value})} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Adresa</label>
                    <input type="text" className="form-control text-center" value={salon.address} onChange={(e) => setSalon({...salon, address: e.target.value})} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Telefon</label>
                    <input type="text" className="form-control text-center" value={salon.phoneNumber} onChange={(e) => setSalon({...salon, phoneNumber: e.target.value})} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control text-center" value={salon.email} onChange={(e) => setSalon({...salon, email: e.target.value})} required />
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
                </div>


                <button type="submit" className="btn btn-warning w-100" disabled={isSubmitting}>
                    {isSubmitting ? "Ažuriranje..." : "Ažuriraj Salon"}
                </button>
            </form>
            {message && <p className="text-center mt-3">{message}</p>}
        </div>
    );
}

export default EditSalon;
