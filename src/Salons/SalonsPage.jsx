import React, { useState, useEffect } from "react";
import SalonCard from "/SalonCard.jsx";

function SalonPage(){
    const [salons, setSalons] = useState({
        id: "",
        name: "",
        address: "",
        phone: "",
        email: "",
        photos: "",
        employees: "",
        ownerId: "",
        ownerName: "",
        ownerSurname: "",
    });

    useEffect(() => {
        const fetchSalons = async () => {
            try {
                const response = await fetch(`http://localhost:8080/salons`);
                if (response.ok) {
                  const data = await response.json();
                  setSalons(data);
                }
              } catch (error) {
                console.error("Greška pri dohvaćanju podataka:", error);
              }
        };
    });

    return(
            <>
                <div className="salon">
                <a href="#">
                <SalonCard pic={salons.photos} name={salons.name} 
                        address={salons.address} phone={salons.phone}
                        email={salons.email} photos={salons.photos}
                        employees={salons.employees} ownerName={salons.ownerName} />
                </a>
                </div>
            </>
    )
}

export default SalonsPage