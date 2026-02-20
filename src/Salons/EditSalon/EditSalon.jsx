import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditSalon.css";
import API_BASE_URL from '../../config/api';

function EditSalon() {
    const { id } = useParams(); // Dohvati ID salona iz URL-a
    const navigate = useNavigate();
    const [salon, setSalon] = useState(null);
    const [hairdressers, setHairdressers] = useState([]); // Lista frizera
    const [selectedHairdressers, setSelectedHairdressers] = useState([]); // Odabrani frizeri
    const [message, setMessage] = useState(""); 
    const [loading, setLoading] = useState(true); // Stanje učitavanja
    const [isSubmitting, setIsSubmitting] = useState(false); // Sprječavanje duplih zahtjeva
    const [salonImages, setSalonImages] = useState([]); // Već postojeće slike
    const [selectedImages, setSelectedImages] = useState([]); // Nove slike
    const [showModal, setShowModal] = useState(false); // Modal state
    const [imageToDelete, setImageToDelete] = useState(null); // Index slike za brisanje
    const [role, setRole] = useState(localStorage.getItem("role"));
    const [owners, setOwners] = useState([]); // Lista vlasnika
    const [employedHairdressers, setEmployedHairdressers] = useState([]); // Lista zaposlenih frizera u salonu

    // ✅ Dohvati podatke o salonu i korisnicima
    useEffect(() => {
        const fetchSalonDetails = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/salons/${id}`);
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
                const response = await fetch(`${API_BASE_URL}/salons/${id}/images`);
                if (response.ok) {
                    const data = await response.json();
                    setSalonImages(data.map((_, index) => `${API_BASE_URL}/salons/${id}/images/${index}`));
                }
            } catch (error) {
                console.error("❌ Greška pri dohvaćanju slika:", error);
            }
        };

        const fetchHairdressers = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/users/role/HAIRDRESSER`, {
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
        fetchHairdressers();
        setLoading(false);
    }, [id]);

    //Za dohvaćanje svih vlasnika salona
    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/users/role/OWNER`, {
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
    
        if (role === "ADMIN" || role === "SUPER_ADMIN") {
            fetchOwners();
        }
    }, [role]);

    useEffect(() => {
        const fetchHairdresserDetails = async () => {
            if (!salon || !salon.employeeNames || salon.employeeNames.length === 0) return;
            
            try {
                const token = localStorage.getItem("token");
                const requests = salon.employeeNames.map(async (username) => {
                    const response = await fetch(`${API_BASE_URL}/users/username/${username}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
    
                    if (response.ok) {
                        return response.json();
                    }
                    return null; // Ako ne pronađe frizera, vrati null
                });
    
                const hairdressersData = await Promise.all(requests);
                setEmployedHairdressers(hairdressersData.filter((h) => h !== null)); // Filtriraj null vrijednosti
            } catch (error) {
                console.error("❌ Greška pri dohvaćanju frizera:", error);
            }
        };
    
        fetchHairdresserDetails();
    }, [salon]); // 👈 Ovaj useEffect će se pokrenuti svaki put kada se salon ažurira
    
    
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
            const response = await fetch(`${API_BASE_URL}/salons/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedSalonData),
            });

            if (response.ok) {
                setMessage("✅ Salon uspješno ažuriran!");

                // ✅ Dodajemo frizere u salon
                if (selectedHairdressers.length > 0) {
                    await addHairdressersToSalon(id, selectedHairdressers, token);
                }     

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

    const addHairdressersToSalon = async (salonId, hairdresserUsernames, token) => {
        try {
            console.log("🔹 Dodajem frizere u salon...");
    
            // Dohvati ID-ove frizera na osnovu username-a
            const hairdresserIds = await fetchHairdresserIds(hairdresserUsernames, token);
    
            if (hairdresserIds.length === 1) {
                // Ako je samo jedan frizer, koristi "/employees/add"
                await fetch(`${API_BASE_URL}/salons/${salonId}/employees/add`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(hairdresserIds[0]), // Šaljemo samo jedan ID
                });
            } else if (hairdresserIds.length > 1) {
                // Ako su više frizeri, koristi "/employees"
                await fetch(`${API_BASE_URL}/salons/${salonId}/employees`, {
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
                const response = await fetch(`${API_BASE_URL}/users/username/${username}`, {
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

            const response = await fetch(`${API_BASE_URL}/salons/${id}/upload-images`, {
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

     // ✅ Prikaži modal prije brisanja slike
     const confirmDeleteImage = (imageIndex) => {
        setImageToDelete(imageIndex);
        setShowModal(true);
    };

    // ✅ Funkcija za brisanje slike
    const handleDeleteImage = async (imageIndex) => {
        if (imageIndex === null) return; // Ako nije postavljena slika, izađi

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`${API_BASE_URL}/salons/${id}/images/${imageIndex}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                setMessage("✅ Slika uspješno obrisana.");
                // 🔹 Ažuriraj prikaz tako što brišemo sliku iz state-a
                setSalonImages(salonImages.filter((_, index) => index !== imageIndex));
            } else {
                setMessage("❌ Greška pri brisanju slike.");
            }
        } catch (error) {
            console.error("❌ Greška pri brisanju slike:", error);
        }

        setShowModal(false);
    };

    if (loading) return <p className="text-center">Učitavanje...</p>;
    if (!salon) return <p className="text-center text-danger">❌ Salon nije pronađen.</p>;

    return (
        <div className="container mt-4 text-center">
            <h1 className="text-center">Uredi salon</h1>
            <form onSubmit={handleSubmit} className="bg-dark p-4 rounded text-light bg-opacity-50">
                 {/* 📸 Prikaz postojećih slika */}
                 <div className="mb-3">
                 <div className="d-flex flex-wrap justify-content-center">
                        {salonImages.map((image, index) => (
                            <div key={index} className="m-2 position-relative">
                                <img src={image} alt={`Salon Slika ${index}`} className="rounded" style={{ width: "150px", height: "150px", objectFit: "cover" }} />
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm position-absolute top-0 mt-1 end-0"
                                    onClick={() => confirmDeleteImage(index)}
                                >
                                    ❌
                                </button>
                            </div>
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
                    {role === "ADMIN" || role === "SUPER_ADMIN" ? (
                    // ADMIN i SUPER_ADMIN vide sve frizere
                        hairdressers.map((hairdresser) => (
                            <option key={hairdresser.username} value={hairdresser.username}>
                                {hairdresser.firstName} {hairdresser.lastName} ({hairdresser.username})
                            </option>
                        ))
                    ) : (
                         // OWNER vidi samo frizere svog salona, ali prvo provjeravamo da li `salon.hairdressers` postoji
                            employedHairdressers.length > 0 ? (
                                employedHairdressers.map((hairdresser) => (
                                    <option key={hairdresser.username} value={hairdresser.username}>
                                        {hairdresser.firstName} {hairdresser.lastName} ({hairdresser.username})
                                    </option>
                                ))
                            ) : (
                                <option disabled>Nema dostupnih frizera</option>
                            )
                    )}
                    </select>
                </div>
                <div className="text-center mb-3 mt-2" style={{marginTop:"-15px"}}>
                    <button 
                        className="btn btn-primary w-100"
                        onClick={() => navigate("/add-hairdresser")}
                    >
                        Dodaj Frizera
                    </button>
                </div>

                <div className="text-center mb-3" style={{marginTop:"-15px"}}>
                    <button 
                        className="btn btn-primary w-100"
                        onClick={() => navigate(`/add-service/${id}`)}
                    >
                        Dodaj usluge
                    </button>
                </div>

                {(role === "ADMIN" || role === "SUPER_ADMIN") && (
                    <div className="mb-3">
                        <label className="form-label">Vlasnik salona</label>
                        <select 
                            className="form-select text-center" 
                            value={salon.ownerUsername} 
                            onChange={(e) => setSalon({...salon, ownerUsername: e.target.value})} 
                            required
                        >
                            <option value={salon.ownerUsername}>
                                {salon.ownerFirstName} {salon.ownerLastName} ({salon.ownerUsername})
                            </option>
                            {owners.map((owner) => (
                                <option key={owner.username} value={owner.username}>
                                    {owner.firstName} {owner.lastName} ({owner.username})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <button 
                    className="btn btn-info mt-2"
                    onClick={() => navigate(`/salon/${id}/services`)}
                >
                    Pogledaj Cjenovnik 💇‍♂️
                </button>

                <button type="submit" className="btn btn-warning w-100" disabled={isSubmitting}>
                    {isSubmitting ? "Ažuriranje..." : "Ažuriraj Salon"}
                </button>
            </form>

            {message && <p className="text-center mt-3">{message}</p>}
               {/* 🛑 MODAL ZA POTVRDU BRISANJA */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title text-dark">Brisanje slike</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body text-dark">
                                <p>Jeste li sigurni da želite obrisati ovu sliku?</p> 
                                <p>(Slika će trajno biti obrisana)</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Odustani
                                </button>
                                <button type="button" className="btn btn-danger" onClick={() => handleDeleteImage(imageToDelete)}>
                                    Obriši
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditSalon;
