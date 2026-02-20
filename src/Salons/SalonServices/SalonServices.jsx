import React, { useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import API_BASE_URL from '../../config/api';

function SalonServices({salonId}){
    const { salonId: paramSalonId } = useParams(); // Dohvati salonId iz URL-a ako nema prop
    const finalSalonId = salonId || paramSalonId; // Koristi ono što je dostupno
    const [services, setServices] = useState([]); // Lista usluga
    const [loading, setLoading] = useState(true); // Status učitavanja
    const [error, setError] = useState(null); // Greška pri dohvaćanju
    const [salonOwnerId, setSalonOwnerId] = useState(null); // ID vlasnika salona
    const currentUserId = localStorage.getItem("id"); // Trenutno prijavljeni korisnik

    useEffect(() => {
        const fetchServices = async () => {
            try{
                const response = await fetch(`${API_BASE_URL}/services/salon/${finalSalonId}`);
                if (!response.ok) {
                    throw new Error("❌ Greška pri dohvaćanju usluga.");
                }
                const data = await response.json();
                // 🔹 Prepravka podataka u camelCase

                const formattedData = data.map(service => ({
                    id: service.id,
                    nazivUsluge: service.naziv_usluge,
                    trajanjeUsluge: service.trajanje_usluge,
                    cijenaUsluge: service.cijena_usluge
                }));

                console.log("✅ Transformirani podaci:", formattedData);
                setServices(formattedData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, [salonId]);

    useEffect(() => {
        const fetchSalonOwner = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/salons/${finalSalonId}`);
                if (!response.ok) {
                    throw new Error("❌ Greška pri dohvaćanju podataka o salonu.");
                }
                const data = await response.json();
                setSalonOwnerId(data.ownerId); // ✅ Postavi vlasnika salona
            } catch (err) {
                console.error("❌ Greška pri dohvaćanju vlasnika salona:", err);
            }
        };
    
        if (finalSalonId) {
            fetchSalonOwner();
        }
    }, [finalSalonId]); // 🔹 Poziva se kada se promijeni finalSalonId
    

    const handleDeleteService = async (serviceId) => {
        const confirmDelete = window.confirm("Jeste li sigurni da želite obrisati ovu uslugu?");
        if(!confirmDelete) return;

        try{
            const response = await fetch(`${API_BASE_URL}/services/salon/${finalSalonId}/${serviceId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            
            if(!response.ok){
                throw new Error("❌ Greška pri brisanju usluge.");
            }

            // ✅ Uklanjamo obrisanu uslugu iz liste bez ponovnog dohvaćanja podataka
            setServices(services.filter(service => service.id !== serviceId));

            alert("✅ Usluga uspješno obrisana!");
        } catch (error){
            console.error("❌ Greška pri brisanju usluge:", error);
            alert("❌ Greška pri brisanju usluge. Pokušajte ponovo.");
        }
    }

    return(
        <div className="container mt-4">
            <h2 className="text-center mb-4">Cjenovnik usluga</h2>
            { loading ? (
                <p className="text-center">🔄 Učitavanje usluga...</p>
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : services.length === 0 ? (
                <p className="text-center">⚠️ Trenutno nema dostupnih usluga.</p>
            ) : (
                    <div className="table-responsive">
                    <table className="table table-striped table-hover text-center">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Naziv usluge</th>
                                <th>Trajanje (min)</th>
                                <th>Cijena (KM)</th>
                                {(["ADMIN", "SUPER_ADMIN"].includes(localStorage.getItem("role")) || currentUserId == salonOwnerId) && <th>Akcija</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service, index) => (
                                <tr key={service.id}>
                                    <td>{index + 1}</td>
                                    <td>{service.nazivUsluge}</td>
                                    <td>{service.trajanjeUsluge} min</td>
                                    <td>{service.cijenaUsluge ? Number(service.cijenaUsluge).toFixed(2) : "N/A"} KM</td>
                                    {(["ADMIN", "SUPER_ADMIN"].includes(localStorage.getItem("role")) || currentUserId == salonOwnerId) && (
                                        <td>
                                            <button 
                                                className="btn btn-danger btn-sm" 
                                                onClick={() => handleDeleteService(service.id)}
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
            )}
        </div>
    );
}

export default SalonServices;