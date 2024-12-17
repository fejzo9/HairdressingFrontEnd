
import "./Card.css";

function Card(props){

    return (
        <div className="card"> 
            <img className="card-image" src={props.pic} alt="slika" width={150} height={150} />
            <h2 className="card-title">{props.name}</h2>
            <p className="card-text">{props.desc}</p>
        </div>
    );
}

export default Card