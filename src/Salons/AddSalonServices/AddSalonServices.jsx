import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./AddSalonServices.css";
import API_BASE_URL from '../../config/api';

function AddSalonServices(){
    const navigate = useNavigate();
    const { salonId } = useParams();
    console.log("🏠 Salon ID:", salonId);
    const [formData, setFormData] = useState({
        nazivUsluge: "",
        trajanjeUsluge: "",
        cijenaUsluge: ""
    });

    const role = localStorage.getItem("role");
    const [message, setMessage] = useState("");

     // 🚨 Ako korisnik nema prava pristupa, preusmjeri ga
     if (!["OWNER", "ADMIN", "SUPER_ADMIN"].includes(role)) {
        return <p className="text-danger text-center">❌ Nemate dozvolu za dodavanje usluga.</p>;
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!salonId){
            setMessage("❌ Greška: ID salona nije pronađen!");
            return;
        }

        try{
            const response = await fetch(`${API_BASE_URL}/services/salon/${salonId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error("❌ Greška pri dodavanju usluge");
            }

            setMessage("✅ Usluga uspješno dodana!");
            setTimeout(() => navigate(-1), 1500); // 🔙 Vrati korisnika nazad nakon 1.5 sekunde
        } catch (error) {
            console.error("❌ Greška pri dodavanju usluge:", error);
            setMessage("❌ Greška pri dodavanju. Pokušajte ponovo!");
        }
    };

    return(
        <div className="container mt-4 text-center">
        <h2>Dodaj Novu Uslugu</h2>

        <form onSubmit={handleSubmit} className="bg-dark p-4 rounded text-light bg-opacity-50">
            <div className="mb-3">
                <label className="form-label">Naziv usluge</label>
                <input 
                    type="text" 
                    name="nazivUsluge" 
                    className="form-control text-center" 
                    value={formData.nazivUsluge} 
                    onChange={handleChange} 
                    required 
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Trajanje (minute)</label>
                <input 
                    type="number" 
                    name="trajanjeUsluge" 
                    className="form-control text-center" 
                    value={formData.trajanjeUsluge} 
                    onChange={handleChange} 
                    required 
                    min="1"
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Cijena (KM)</label>
                <input 
                    type="number" 
                    name="cijenaUsluge" 
                    className="form-control text-center" 
                    value={formData.cijenaUsluge} 
                    onChange={handleChange} 
                    required 
                    step="0.5"
                />
            </div>

            <button type="submit" className="btn btn-success w-100">Dodaj Uslugu</button>
            <button type="button" className="btn btn-danger w-100 mt-2" onClick={() => navigate(-1)}>Otkaži</button>

            {message && <p className="mt-3">{message}</p>}
        </form>
    </div>
    );
}

export default AddSalonServices;