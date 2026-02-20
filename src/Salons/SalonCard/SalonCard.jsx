import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./SalonCard.css";
import API_BASE_URL from '../../config/api';

function SalonCard({id, pic, name, address, phone, email, ownerName, onDelete }) {
    const navigate = useNavigate();
    
    // 🔹 Dohvati ulogu korisnika iz localStorage
    const userRole = localStorage.getItem("role");

    const [showModal, setShowModal] = useState(false);

    const handleClick = () => {
        navigate(`/salon/${id}`); // Redirect na salon/{id}
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/salons/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                onDelete(id); // 🔹 Ažuriraj prikaz nakon brisanja
                navigate(`/maps`);
            } else {
                alert("❌ Greška pri brisanju salona!");
            }
        } catch (error) {
            console.error("❌ Greška pri slanju zahtjeva:", error);
        } finally {
            setShowModal(false);
        }
    };

    return (
        <div className="salon-card" onClick={handleClick} style={{cursor: "pointer"}}>
            <img className="card-image img-fluid" 
                 src={pic || "/default-salon.png"} 
                 alt="Salon Slika" 
                />
            <h2 className="card-title">{name}</h2>
            <p className="card-text">{address}</p>
            <p className="card-text">{phone}</p>
            <p className="card-text">{email}</p>
            <p className="card-text">vlasnik: {ownerName}</p>

            {/* ✅ Prikaz buttona samo za ADMIN i SUPER_ADMIN */}
            {(userRole === "ADMIN" || userRole === "SUPER_ADMIN") && (
                <div className="admin-buttons">
                    <button className="btn btn-warning btn-sm me-2" onClick={(e) => { e.stopPropagation(); navigate(`/edit-salon/${id}`); }}>
                        ✏️ Uredi
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); setShowModal(true); }}>
                        ❌ Obriši
                    </button>
                </div>
            )}

             {/* 🔹 Bootstrap modal za potvrdu brisanja */}
             {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Potvrda brisanja</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Jeste li sigurni da želite obrisati salon <strong>{name}</strong>?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Odustani</button>
                                <button className="btn btn-danger" onClick={handleDelete}>Obriši</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default SalonCard;
