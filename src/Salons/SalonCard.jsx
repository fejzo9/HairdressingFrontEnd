import "./SalonCard.css";

function SalonCard(props){

    return (
        <div className="salon-card">
            <img className="card-image" src={props.pic} alt="slika" width={150} height={150} />
            <h2 className="card-title">{props.name}</h2>
            <p className="card-text">{props.address}</p>
            <p className="card-text">{props.phone}</p>
            <p className="card-text">{props.email}</p>
        </div>
    );
}

export default SalonCard