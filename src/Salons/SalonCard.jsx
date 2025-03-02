import { useNavigate } from "react-router-dom";
import "./SalonCard.css";

function SalonCard({id, pic, name, address, phone, email, ownerName }) {
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate(`/salon/${id}`); // Redirect na salon/{id}
    };

    return (
        <div className="salon-card" onClick={handleClick} style={{cursor: "pointer"}}>
            <img className="card-image" 
                 src={pic || "/default-salon.png"} 
                 alt="Salon Slika" 
                />
            <h2 className="card-title">{name}</h2>
            <p className="card-text">{address}</p>
            <p className="card-text">{phone}</p>
            <p className="card-text">{email}</p>
            <p className="card-text">vlasnik: {ownerName}</p>
        </div>
    );
}

export default SalonCard;
