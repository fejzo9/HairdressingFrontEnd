import React, { useState, useEffect } from "react";
import SalonCard from "./SalonCard/SalonCard";
import "bootstrap/dist/css/bootstrap.min.css";

function SalonsPage(){
    const [salons, setSalons] = useState([]);
    const [salonImages, setSalonImages] = useState({});

    useEffect(() => {
        const fetchSalons = async () => {
            try {
                const response = await fetch(`http://localhost:8080/salons`);
                if (response.ok) {
                  const data = await response.json();
                  setSalons(data);
                  console.log(data);
                   // Nakon što dobijemo salone, dohvatimo slike za svaki salon
                   data.forEach(salon => fetchSalonImage(salon.id));
                }
              } catch (error) {
                console.error("Greška pri dohvaćanju podataka:", error);
              }
        };

        fetchSalons();
    }, []);

    const fetchSalonImage = async (salonId) => {
      try{
        const response = await fetch(`http://localhost:8080/salons/${salonId}/images/0`);
        if(response.ok){
          const blob = await response.blob();  // Dohvati sliku kao Blob
          const imageUrl = URL.createObjectURL(blob); // Kreiraj URL za sliku

            // Postavi sliku u state (objekat { salonId: imageUrl })
            setSalonImages(prevState => ({
              ...prevState,
              [salonId]: imageUrl
            }));
        }
      } catch(error){
        console.error(`❌ Greška pri dohvaćanju slike za salon ${salonId}:`, error);
      }
    };

     // ✅ Briše salon iz prikaza nakon DELETE
     const handleDelete = (deletedId) => {
      setSalons(salons.filter(salon => salon.id !== deletedId));
  };

    return(    
          <div className="container mg-3 bg-dark p-4 bg-opacity-50 rounded-4">
            <h1 className="text-center mb-4">Frizerski saloni</h1>
            <div className="row">
            {salons.length > 0 ? (
                salons.map((salon) => (
                <div key={salon.id} className="salon col-lg-4 col-md-6 col-sm-8 mb-6">
                  <a href="#">
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
                ))
            ) : (
                <p style={styles.message} >Nema dostupnih salona.</p>
            )}
            </div>
          </div>
          
    )
}

// Definisanje stilova kao JavaScript objekat
const styles = {
  message: {
    display: "flex",            // Omogućava flexbox
    justifyContent: "center",   // Centriranje po horizontali
    alignItems: "center",       // Centriranje po vertikali
    textAlign: "center",
    color: "red",
    margin: "auto", 
    padding: "20px",
    borderRadius: "10px",
    width: "fit-content",
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Tamnija crna pozadina sa većom transparentnošću
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px"
  },
};

export default SalonsPage