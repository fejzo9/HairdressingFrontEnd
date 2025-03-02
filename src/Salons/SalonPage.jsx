import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function SalonPage() {
    const { id } = useParams();
    const [salon, setSalon] = useState(null);
    const [images, setImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchSalonDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/salons/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setSalon(data);
                    setEmployees(data.employees);
                }
            } catch (error) {
                console.error("Greška pri dohvaćanju salona:", error);
            }
        };

        const fetchImages = async () => {
            try {
                const response = await fetch(`http://localhost:8080/salons/${id}/images`);
                if (response.ok) { 
                    const imageBlobs = await response.json();
                    setImages(imageBlobs.map((blob, index) => `http://localhost:8080/salons/${id}/images/${index}`));
                }
            } catch (error) {
                console.error("Greška pri dohvaćanju slika:", error);
            }
        };

        fetchSalonDetails();
        fetchImages();
    }, [id]);

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    if (!salon) return <p className="text-center">Učitavanje...</p>;

    return (
        <div className="container mt-4">
            <h1 className="text-center">{salon.name}</h1>

            {/* Galerija slika */}
            <div className="position-relative text-center">
                <button className="btn btn-dark position-absolute start-0 top-50" onClick={prevImage}>&lt;</button>
                <img src={images[currentImageIndex]} className="img-fluid rounded" alt="Salon" />
                <button className="btn btn-dark position-absolute end-0 top-50" onClick={nextImage}>&gt;</button>
            </div>

            {/* Podaci o salonu */}
            <div className="mt-4 text-center">
                <p><strong>Adresa:</strong> {salon.address}</p>
                <p><strong>Telefon:</strong> {salon.phoneNumber}</p>
                <p><strong>Email:</strong> {salon.email}</p>
            </div>

            {/* Lista zaposlenih */}
            <h2 className="text-center mt-5">Frizeri i uposlenici</h2>
            <div className="row">
                {employees.map((employee) => (
                    <div key={employee.id} className="col-md-4">
                        <div className="card text-center">
                            <img src={`http://localhost:8080/employees/${employee.id}/profile-picture`} className="card-img-top" alt={employee.name} />
                            <div className="card-body">
                                <h5 className="card-title">{employee.name} {employee.surname}</h5>
                                <p className="card-text">📞 {employee.phoneNumber}</p>
                                <p className="card-text">✉️ {employee.email}</p>
                                <a href={`/rezervacija/${employee.id}`} className="btn btn-primary">Rezerviši termin</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SalonPage;
