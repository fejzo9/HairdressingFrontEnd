import React, { useState, useEffect } from "react";
import SalonCard from "./SalonCard";

function SalonsPage(){
    const [salons, setSalons] = useState([]);

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
        fetchSalons();
    }, []);

    return(
            <>
            <div className="salons-container">
            {salons.length > 0 ? (
                salons.map((salon) => (
                <div key={salon.id} className="salon">
                  <a href="#">
                    <SalonCard 
                                pic={salons.photos} 
                                name={salons.name} 
                                address={salons.address} 
                                phone={salons.phone}
                                email={salons.email} 
                                photos={salons.photos}
                                employees={salons.employees} 
                                ownerName={salons.ownerName} />
                  </a>
                </div> 
                ))
            ) : (
                <p>Nema dostupnih salona.</p>
            )}
            </div>
            </>
    )
}

export default SalonsPage