import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const apiKey = "AIzaSyDglKhMNLblxJ8wmtB9LnolZ8s1H8ciLr8"; 

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 41.01384, // Postavi početnu latitudu i longitudu (npr. za određeni grad)
  lng: 28.979530,
};

const radius = 5000; // Radijus pretrage u metrima (5 km)

function SalonMap() {
  const [salons, setSalons] = useState([]);

  useEffect(() => {
    // Funkcija za dohvaćanje frizerskih salona pomoću Places API
    const fetchSalons = async () => {
      const service = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );
      const request = {
        location: new window.google.maps.LatLng(center.lat, center.lng),
        radius: radius,
        type: ["hair_care", "hair_dressers", "hair_style"], // Tip pretrage - frizerski saloni
      };
      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setSalons(results);
        }
      });
    };

    fetchSalons();
  }, []);

  return (
    <div>
    <LoadScript googleMapsApiKey={apiKey} libraries={["places"]}>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={13}>
        {salons.map((salon) => (
          <Marker
            key={salon.place_id}
            position={{
              lat: salon.geometry.location.lat(),
              lng: salon.geometry.location.lng(),
            }}
            title={salon.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
    </div>
  );
}

export default SalonMap;
