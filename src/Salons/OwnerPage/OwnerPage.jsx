import React, { useState, useEffect } from "react";
import SalonCard from "../SalonCard/SalonCard";
import "bootstrap/dist/css/bootstrap.min.css";

function OwnerPage() {
    const [salons, setSalons] = useState([]);
    const [salonImages, setSalonImages] = useState({});
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchOwnerSalons = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setMessage("❌ Nema autorizacije! Molimo prijavite se.");
                    setLoading(false);
                    return;
                }

                const response = await fetch("http://localhost:8080/salons/owner", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    if (data.length === 0) {
                        setMessage("❌ Nemate nijedan salon registriran.");
                        setLoading(false);
                        return;
                    }

                    const fetchSalonDetails = data.map(salon =>
                        fetch(`http://localhost:8080/salons/${salon.id}`)
                            .then(res => res.json())
                            .then(details => ({ ...details, id: salon.id }))
                    );

                    // Čekamo da svi detalji budu dohvaćeni
                    const salonDetails = await Promise.all(fetchSalonDetails);
                    setSalons(salonDetails);

                    // Nakon što dobijemo sve salone, dohvatimo slike
                    salonDetails.forEach(salon => fetchSalonImage(salon.id));
                } else {
                    setMessage("❌ Greška pri dohvaćanju salona.");
                }
            } catch (error) {
                console.error("❌ Greška pri dohvaćanju podataka:", error);
                setMessage("❌ Došlo je do greške.");
            } finally {
                setLoading(false);
            }
        };

        fetchOwnerSalons();
    }, []);

    // Dohvaća sliku prvog salona (index 0)
    const fetchSalonImage = async (salonId) => {
        try {
            const response = await fetch(`http://localhost:8080/salons/${salonId}/images/0`);
            if (response.ok) {
                const blob = await response.blob();  // Dohvati sliku kao Blob
                const imageUrl = URL.createObjectURL(blob); // Kreiraj URL za sliku

                setSalonImages(prevState => ({
                    ...prevState,
                    [salonId]: imageUrl
                }));
            }
        } catch (error) {
            console.error(`❌ Greška pri dohvaćanju slike za salon ${salonId}:`, error);
        }
    };

    // Briše salon iz prikaza nakon DELETE
    const handleDelete = (deletedId) => {
        setSalons(salons.filter(salon => salon.id !== deletedId));
    };

    return (
        <div className="container mg-3 bg-dark p-4 bg-opacity-50 rounded-4">
            <h1 className="text-center mb-4">Moji frizerski saloni</h1>
            
            {loading ? (
                <p className="text-center text-light">Učitavanje...</p>
            ) : message ? (
                <p style={styles.message}>{message}</p>
            ) : (
                <div className="row">
                    {salons.map((salon) => (
                        <div key={salon.id} className="salon col-lg-4 col-md-6 col-sm-8 mb-6">
                            <a href={`/edit-salon/${salon.id}`}>
                                <SalonCard 
                                    key={salon.id}
                                    id={salon.id}
                                    pic={salonImages[salon.id] || "/default-salon.png"} 
                                    name={salon.name} 
                                    address={salon.address} 
                                    phone={salon.phoneNumber}
                                    email={salon.email} 
                                    employees={salon.employees} 
                                    ownerName={salon.ownerFirstName + ' ' + salon.ownerLastName} 
                                    onDelete={handleDelete} // 🔹 Prosljeđujemo funkciju za ažuriranje
                                />
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Definisanje stilova
const styles = {
  message: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "red",
    margin: "auto", 
    padding: "20px",
    borderRadius: "10px",
    width: "fit-content",
    backgroundColor: "rgba(0, 0, 0, 0.8)", 
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px"
  },
};

export default OwnerPage;
