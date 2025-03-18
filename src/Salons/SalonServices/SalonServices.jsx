import React, { useState, useEffect} from "react";
import { useParams } from "react-router-dom";

function SalonServices(){
    const { salonId } = useParams(); // Dohvaća salonId iz URL-a
    const [services, setServices] = useState([]); // Lista usluga
    const [loading, setLoading] = useState(true); // Status učitavanja
    const [error, setError] = useState(null); // Greška pri dohvaćanju

    useEffect(() => {
        const fetchServices = async () => {
            try{
                const response = await fetch(`http://localhost:8080/services/salon/${salonId}`);
                if (!response.ok) {
                    throw new Error("❌ Greška pri dohvaćanju usluga.");
                }
                const data = await response.json();
                setServices(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, [salonId]);

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
                <div className="row">
                    {services.length > 0 ? (
                    services.map((service) => (
                        <div key={service.id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                            <div className="card shadow-sm p-3 bg-light rounded bg-opacity-50 text-center">
                                <h5 className="card-title text-dark">{service.nazivUsluge}</h5>
                                <p className="card-text">
                                    ⏳ Trajanje: <strong>{service.trajanjeUsluge} min</strong>
                                </p>
                                <p className="card-text">
                                    💰 Cijena: <strong>{service.cijenaUsluge ? Number(service.cijenaUsluge).toFixed(2) : "N/A"} KM</strong>
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">⚠️ Trenutno nema dostupnih usluga.</p>
                )}
                </div>
            )}
        </div>
    );
}

export default SalonServices;