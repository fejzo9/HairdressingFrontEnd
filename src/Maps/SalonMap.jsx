import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 44.5375, // Centar Bosne i Hercegovine (prilagodite po potrebi)
  lng: 18.6667,
};

function SalonMap() {
  const [salons, setSalons] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState(null);

  useEffect(() => {
    // Funkcija za dohvaćanje frizerskih salona sa backenda
    const fetchSalons = async () => {
      try {
        const response = await fetch("http://localhost:8080/salons", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}` // Ako je potrebna autentifikacija
          }
        });
        if (response.ok) {
          const data = await response.json();
          // Filtriraj salone koji nemaju koordinate
          const validSalons = data.filter(salon => salon.latitude && salon.longitude);
          setSalons(validSalons);
        } else {
          console.error("Failed to fetch salons");
        }
      } catch (error) {
        console.error("Error fetching salons:", error);
      }
    };

    fetchSalons();
  }, []);

  return (
    <div>
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={7}>
          {salons.map((salon) => (
            <Marker
              key={salon.id}
              position={{
                lat: salon.latitude,
                lng: salon.longitude,
              }}
              title={salon.name}
              onClick={() => setSelectedSalon(salon)}
            />
          ))}

          {selectedSalon && (
            <InfoWindow
              position={{
                lat: selectedSalon.latitude,
                lng: selectedSalon.longitude,
              }}
              onCloseClick={() => setSelectedSalon(null)}
            >
              <div>
                <h3>{selectedSalon.name}</h3>
                <p>{selectedSalon.address}</p>
                <p>{selectedSalon.phoneNumber}</p>
                {/* Dodajte link za rezervaciju ili detalje */}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default SalonMap;
