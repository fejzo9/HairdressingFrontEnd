import "./SalonCard.css";

function SalonCard({ pic, name, address, phone, email }) {
    return (
        <div className="salon-card">
            <img className="card-image" 
                 src={pic || "/default-salon.png"} 
                 alt="Salon Slika" 
                 width={150} 
                 height={150} />
            <h2 className="card-title">{name}</h2>
            <p className="card-text">{address}</p>
            <p className="card-text">{phone}</p>
            <p className="card-text">{email}</p>
        </div>
    );
}

export default SalonCard;
