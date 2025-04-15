import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SalonServices from "../SalonServices/SalonServices";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SalonPage.css";

function SalonPage() {
    const { id } = useParams();
    const navigate = useNavigate();
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

                     // Ako postoji lista username-a uposlenika, dohvatimo njihove podatke
                     if (data.employeeNames) {
                        fetchEmployeesData(data.employeeNames);
                    }
                }
            } catch (error) {
                console.error("Greška pri dohvaćanju salona:", error);
            }
        };

        const fetchEmployeesData = async (employeeUsernames) => {
            try {
                const employeePromises = employeeUsernames.map(async (username) => {
                    const response = await fetch(`http://localhost:8080/users/username/${username}`);
                    if (response.ok) {
                        const employeeData = await response.json();
                        console.log("Employee Data:", employeeData); // Debug log
                        return employeeData;
                    }
                    return null; // Ako ne uspije, vrati null
                });

                const employeesData = await Promise.all(employeePromises);
                setEmployees(employeesData.filter(emp => emp !== null)); // Filtriraj neuspjele zahtjeve
            } catch (error) {
                console.error("Greška pri dohvaćanju podataka o uposlenicima:", error);
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
            <div className="position-relative text-center salon-gallery">
                <button className="btn btn-dark position-absolute start-0 top-50" onClick={prevImage}>&lt;</button>
                <img src={images[currentImageIndex]} className="w-100 rounded" alt="Salon" />
                <button className="btn btn-dark position-absolute end-0 top-50" onClick={nextImage}>&gt;</button>
            </div>

            {/* Podaci o salonu */}
            <div className="salon-data mt-4 text-center">
                <p><strong>Adresa:</strong> {salon.address}</p>
                <p><strong>Telefon:</strong> {salon.phoneNumber}</p>
                <p><strong>Email:</strong> {salon.email}</p>
            </div>

            {/* Lista zaposlenih */}
            <h2 className="text-center mt-5 text-light">Frizeri i uposlenici</h2>
            <div className="row justify-content-center">
                {employees.map((employee) => (
                    <div key={employee.id} className="col-12 col-sm-6 col-md-6 col-lg-4 d-flex justify-content-center">
                        <div className="card text-center bg-dark bg-opacity-50 m-2 employee-card">
                            {/* ✅ Profilna slika */}
                            <img 
                                src={`http://localhost:8080/users/${employee.id}/profile-picture`} 
                                className="card-img-top employee-image" 
                                alt={employee.name || employee.username} 
                            />
                            <div className="card-body">
                                {/* ✅ Prikaz imena (ili username-a ako nema imena) */}
                                <h5 className="card-title text-white mb-3">
                                    {employee.firstName ? `${employee.firstName} ${employee.lastName || ''}` : employee.username}
                                </h5>
                                <p className="card-text text-light">📞phone: {employee.phoneNumber || "N/A"}</p>
                                <p className="card-text text-light">✉️email: {employee.email}</p>
                                <button 
                                className="btn btn-primary"
                                onClick={() => navigate(`/rezervacija/${id}/${employee.id}`)}
                                >
                                Rezerviši termin
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <SalonServices salonId={id} />

        </div>
    );
}

export default SalonPage;
